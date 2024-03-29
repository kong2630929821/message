/**
 * 群组相关的rpc操作
 */
// ================================================================= 导入
import { GROUP_STATE, GroupInfo, GroupUserLink } from '../db/group.s';
import { AccountGenerator, Contact, GENERATOR_TYPE, UserInfo, VIP_LEVEL } from '../db/user.s';
import { GroupUserLinkArray, Result } from './basic.s';
import { GroupAgree, GroupCreate, GroupInfoList, GroupMembers, GuidsAdminArray, Invite, InviteArray, NeedAgree, NewGroup } from './group.s';

import { Env } from '../../../../pi/lang/env';
import { BonBuffer } from '../../../../pi/util/bon';
import { mqttPublish, QoS, setMqttTopic, unsetMqttTopic } from '../../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../../utils/db';
import { Logger } from '../../../utils/logger';
import { delGidFromApplygroup, delValueFromArray, genGroupHid, genGuid, genHIncId, genNewIdFromOld, genNextMessageIndex, getGidFromGuid, getUidFromGuid } from '../../../utils/util';
import { getSession } from '../../rpc/session.r';
import * as CONSTANT from '../constant';
import { GroupHistory, GroupHistoryCursor, GroupMsg, MSG_TYPE, MsgLock  } from '../db/message.s';
import { GROUP_MEMBERS_OVERLIMIT, OPERAT_WITHOUT_AUOTH, USER_GREATE_GROUP_OVERLIMIT } from '../errorNum';
import { sendGroupMessage } from './message.r';
import { GroupSend, SendMsg } from './message.s';

declare var env: Env;

const logger = new Logger('GROUP');
const START_INDEX = 0;
// ================================================================= 导出

/**
 * 用户主动申请加入群组
 * @param guid group user id
 */
// #[rpc=rpcServer]
export const applyJoinGroup = (gid: number): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();
    const res = new Result();

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];
    // 群是否存在
    if (!gInfo) {
        logger.debug('group: ', gid, 'is not exist');
        res.r = -2;

        return res;
    }
    // 群是否被解散
    if (gInfo.state === GROUP_STATE.DISSOLVE) {
        logger.debug('group: ', gid, 'was Disbanded');
        res.r = -2;

        return res;
    }
    // 当前用户是否已经在群里
    if (gInfo.memberids.indexOf(uid) > -1) {
        res.r = -1;
        logger.debug(`user: ${uid}, is exist in group: ${gInfo.name}`);

        return res;
    }
    // 群成员是否达到上限  
    const max_members = getGroupMaxMembers(gInfo.level);
    if (gInfo.memberids.length >= max_members) {
        res.r = GROUP_MEMBERS_OVERLIMIT;

        return res;
    }
    
    // 加群是否需要管理员同意,不需要同意则直接进群
    if (!gInfo.need_agree) {
        // 添加该用户的申请信息
        gInfo.applyUser.findIndex(item => item === uid) === -1 && gInfo.applyUser.push(uid);
        groupInfoBucket.put(gid,gInfo);
        const agree = new GroupAgree();
        agree.gid = gid;
        agree.uid = uid;
        agree.agree = true;
        const r = acceptUser(agree);
        res.r = r.r;

        return res;
    }
    gInfo.applyUser.findIndex(item => item === uid) < 0 && gInfo.applyUser.push(uid);
    groupInfoBucket.put(gid, gInfo);
    res.r = 1;

    return res;
};

/**
 * 用户申请加入游戏群组
 * @param uid 游戏官方客服账号
 */
// // #[rpc=rpcServer]
// export const applyJoinGameGroup = (uid:number):number => {
//     const contactBucket = new Bucket('file',Contact._$info.name);
//     const contact = contactBucket.get(uid)[0];
//     const gids = contact.myGroup;  // 游戏客服创建的游戏群组
//     if (gids && gids.length > 0) {
//         let fg = false; // 是否已经成功申请入群
//         let i = 0;
//         while (!fg || i < gids.length) {
//             const res = applyJoinGroup(gids[i]);  // 从第一个群开始加
//             if (res && res.r === 1) {
//                 fg = true;
//             } else if (res && res.r === GROUP_MEMBERS_OVERLIMIT) {  // 如果群已经超过人数上限，则加入下一个群组
//                 i++;
//             } else {  // 其他错误情况退出循环
//                 break;
//             }
//         }
        
//         return gids[i];

//     } else {
//         return 0;
//     }
// };

/**
 * 用户主动退出群组
 * @param gid group number
 */

// #[rpc=rpcServer]
export const userExitGroup = (gid: number): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const contactBucket = getContactBucket();

    const uid = getUid();
    const res = new Result();

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];
    const uidIndex = gInfo.memberids.indexOf(uid);
    const contact = contactBucket.get<number, [Contact]>(uid)[0];
    const gidIndex = contact.group.indexOf(gid);
    // 群主不能主动退出群组 只能调用解散群接口
    if (gInfo.ownerid === uid) {
        logger.debug('user: ', uid, 'is owner, cant exit group: ', gid);
        res.r = -1;

        return res;
    }
    if (uidIndex > -1) {
        const userinfo = getCurrentUserInfo();
        const info = new GroupSend();
        info.msg = `${userinfo.name}已退出群组`;
        info.mtype = MSG_TYPE.OTHERMSG;
        info.gid = gid;
        info.time = Date.now();
        const gh = sendGroupMessage(info);
        logger.debug('user exit group mess, gh: ',gh);
        // 管理员数组也要清除
        const index = gInfo.adminids.indexOf(uid);
        index > -1 && gInfo.adminids.splice(index, 1);

        gInfo.memberids.splice(uidIndex, 1);
        groupInfoBucket.put(gid, gInfo);
        logger.debug('user: ', uid, 'exit group: ', gid);

        contact.group.splice(gidIndex, 1);
        contactBucket.put(uid, contact);
        logger.debug('Remove group: ', gid, 'from user\'s contact');

        const groupUserLinkBucket = getGroupUserLinkBucket();
        groupUserLinkBucket.delete(`${gid}%${uid}`);
        logger.debug('delete user: ', uid, 'from groupUserLinkBucket');
        res.r = 1;
        
    } else {
        res.r = 0;
    }

    return res;
};

/**
 * 管理员接受/拒绝用户的加群申请
 * @param agree agree
 */
// #[rpc=rpcServer]
// tslint:disable-next-line:max-func-body-length
export const acceptUser = (agree: GroupAgree): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();
    const res = new Result();

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(agree.gid)[0];
    const admins = gInfo.adminids;
    const owner = gInfo.ownerid;

    const contactBucket = getContactBucket();
    const contact = contactBucket.get<number, [Contact]>(agree.uid)[0];

    // 如果加群申请中没有该用户 
    if (gInfo.applyUser.findIndex(item => item === agree.uid) === -1) {
        res.r = 0;
        logger.debug('user:', agree.uid, 'not to be invited');

        return res;
    }
    // 删除接受/拒绝用户的加群申请
    gInfo.applyUser = delValueFromArray(agree.uid, gInfo.applyUser);
    groupInfoBucket.put(gInfo.gid, gInfo);

    // 进群需要同意，判断同意者是否是管理员
    if (gInfo.need_agree && !(admins.indexOf(uid) > -1 || owner === uid)) {
        res.r = 3; // user is not admin or owner
        logger.debug('User: ', uid, 'is not amdin or owner');

        return res;
    }

    // 拒绝入群申请
    if (!agree.agree) {
        res.r = 4; // admin refuse user to join
        logger.debug('Admin refuse user: ', agree.uid, 'to join in group: ', agree.gid);

        return res;
    }
    // 用户已经在群中
    if (gInfo.memberids.indexOf(agree.uid) > -1) {
        res.r = 2; // user has been exist
        logger.debug('User: ', agree.uid, 'has been exist');

        return res;
    } else if (!contact) { // 用户是否存在
        res.r = -1; // agree.uid is not a registered user
        logger.error('user: ', agree.uid, 'is not a registered user');

        return res;
    } 
    const max_members = getGroupMaxMembers(gInfo.level);
    if (gInfo.memberids.length >= max_members) {
        res.r = GROUP_MEMBERS_OVERLIMIT;

        return res;
    }
    gInfo.memberids.push(agree.uid);
    groupInfoBucket.put(gInfo.gid, gInfo);
    logger.debug('Accept user: ', agree.uid, 'to group: ', agree.gid);
    contact.applyGroup = delGidFromApplygroup(agree.gid,contact.applyGroup);  // 同意用户入群，清空该用户受该群组的邀请记录
    contact.group = delValueFromArray(agree.gid,contact.group);  // 同意用户入群，清空该用户错误的群组id
    contact.group.push(agree.gid);
    contactBucket.put(agree.uid, contact);
    logger.debug('acceptUser uid', agree.uid, 'group ', contact.group,'applyGroup:',contact.applyGroup);

    const groupUserLinkBucket = getGroupUserLinkBucket();
    const currentUser = getCurrentUserInfo(agree.uid);
    const gul = new GroupUserLink();
    gul.guid = genGuid(agree.gid,agree.uid);
    gul.hid = '';
    gul.join_time = Date.now();
    gul.userAlias = '';
    gul.groupAlias = '';
    gul.avatar = currentUser.avatar;

    groupUserLinkBucket.put(gul.guid, gul);
    moveGroupCursor(agree.gid, agree.uid);
    logger.debug('Add user: ', agree.uid, 'to groupUserLinkBucket',gul);
   
    // 发布一条用户入群成功消息，发送者ID应该是入群者非当前用户
    const groupHistoryBucket = new Bucket('file', CONSTANT.GROUP_HISTORY_TABLE);
    const msgLockBucket = new Bucket('file', CONSTANT.MSG_LOCK_TABLE);
    const gh = new GroupHistory();
    const gmsg = new GroupMsg();
    gmsg.msg = '用户加群成功';
    gmsg.mtype = MSG_TYPE.ADDGROUP;
    gmsg.send = true;
    gmsg.sid = agree.uid;
    gmsg.time = Date.now(); // 发送时间由服务器设置
    gmsg.cancel = false;
    gh.msg = gmsg;
    // 生成消息ID
    const msgLock = new MsgLock();
    msgLock.hid = genGroupHid(agree.gid);
    // 这是一个事务
    msgLockBucket.readAndWrite(msgLock.hid, (mLock) => {
        mLock[0] === undefined ? (msgLock.current = 0) : (msgLock.current = genNextMessageIndex(mLock[0].current));

        return msgLock;
    });
    gh.hIncId = genHIncId(msgLock.hid, msgLock.current);
    groupHistoryBucket.put(gh.hIncId, gh);
    const mqttServer = env.get('mqttServer');
    const sendMsg = new SendMsg();
    sendMsg.code = 1;
    sendMsg.last = msgLock.current;
    sendMsg.rid = gmsg.sid;
    const buf = new BonBuffer();
    sendMsg.bonEncode(buf);
    const groupTopic = `ims/group/msg/${agree.gid}`;
    logger.debug(`before publish ,the topic is : ${groupTopic}`);
    // directly send message to group topic
    mqttPublish(mqttServer, true, QoS.AtMostOnce, groupTopic, buf.getBuffer());

    res.r = 1; // successfully add user
    
    return res;
};

/**
 * 群成员邀请其他用户加入群
 * @param invite invaite Array
 */
// #[rpc=rpcServer]
export const inviteUsers = (invites: InviteArray): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const contactBucket = getContactBucket();
    const uid = getUid();
    const res = new Result();
    const gid = invites.arr[0].gid;

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];
    console.log('inviteUsers groupInfo: ',gInfo);
    
    // 判断当前登录用户是否属于该群组
    if (gInfo.memberids.indexOf(uid) <= -1) {
        logger.debug('user: ', uid, 'is not a member of this group');
        res.r = 2; // 当前登陆用户不是该群成员

        return res;
    }
    // 群成员是否达到上限
    const max_members = getGroupMaxMembers(gInfo.level);
    if (gInfo.memberids.length >= max_members) {
        res.r = GROUP_MEMBERS_OVERLIMIT;

        return res;
    }
        
    // 判断当前登录用户是否和被邀请的用户是好友
    // const currentUserInfo = contactBucket.get<number, [Contact]>(uid)[0];
    // logger.debug(`before filter invites is : ${JSON.stringify(invites.arr)}`);
    // logger.debug(`currentUserInfo.friends is : ${JSON.stringify(currentUserInfo.friends)}`);
    // invites.arr = invites.arr.filter((ele: Invite) => {

    //     // 无法邀请不是好友的用户
    //     return currentUserInfo.friends.findIndex(item => item === ele.rid) !== -1;
    // });

    logger.debug(`after filter invites is : ${JSON.stringify(invites.arr)}`);
    for (let i = 0; i < invites.arr.length; i++) {
        const rid = invites.arr[i].rid;
        const cInfo = contactBucket.get<number, [Contact]>(rid)[0];
        // 判断对方是否已经在当前群中
        if (gInfo.memberids.indexOf(rid) > -1) {
            logger.debug('be invited user: ', rid, 'is exist in this group:', gid);
            continue;
        }

        // cInfo.applyGroup.indexOf(genGuid(gid, uid)) === -1 && cInfo.applyGroup.push(genGuid(gid, uid));

        // 无需同意直接入群
        cInfo.group.indexOf(gid) === -1 && cInfo.group.push(gid);
        contactBucket.put(rid, cInfo);
        logger.debug('Invite user: ', rid, 'to group: ', gid);

        gInfo.memberids.push(rid);

    }
    groupInfoBucket.put(gid,gInfo);
        
    res.r = 1;

    return res;
};

/**
 * 用户同意加入群组(被动加入)
 * @param agree GroupAgree
 */
// #[rpc=rpcServer]
export const agreeJoinGroup = (agree: GroupAgree): GroupInfo => {
    const groupInfoBucket = getGroupInfoBucket();
    const contactBucket = getContactBucket();
    const uid = getUid();

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(agree.gid)[0];
    const cInfo = contactBucket.get<number, [Contact]>(uid)[0];
    // 判断群组是否邀请了该用户,如果没有邀请，则直接返回
    if (cInfo.applyGroup.findIndex(item => getGidFromGuid(item) === agree.gid) === -1) {
        gInfo.gid = -1; // gid = -1 indicate that user don't want to join this group

        return gInfo;
    }
    // 群成员是否达到上限
    const max_members = getGroupMaxMembers(gInfo.level);
    if (gInfo.memberids.length >= max_members) {
        gInfo.gid = GROUP_MEMBERS_OVERLIMIT;

        return gInfo;
    }
    // 删除applyGroup并放回db中
    cInfo.applyGroup = delGidFromApplygroup(agree.gid, cInfo.applyGroup);
    contactBucket.put(uid, cInfo);

    // 拒绝加入群组
    if (!agree.agree) {
        logger.debug('User: ', uid, 'don\'t want to join group: ', agree.gid);
        gInfo.gid = -2; // gid = -1 indicate that user don't want to join this group

        return gInfo;
    }
    
    // 已经在群组中
    if (gInfo.memberids.indexOf(uid) > -1) {
        logger.debug('User: ', uid, 'has been exist');
        gInfo.gid = -3;

        return gInfo;
    } 

    cInfo.group.push(agree.gid);
    contactBucket.put(uid, cInfo);
    gInfo.memberids.push(uid);
    gInfo.applyUser = delValueFromArray(agree.uid, gInfo.applyUser); // 用户同意入群，清空该群组该用户的申请记录
    groupInfoBucket.put(gInfo.gid, gInfo);
    logger.debug('User: ', uid, 'agree to join group: ', agree.gid);

    const groupUserLinkBucket = getGroupUserLinkBucket();
    const currentUser = getCurrentUserInfo();
    const gul = new GroupUserLink();
    gul.guid = genGuid(agree.gid, uid);
    gul.hid = gInfo.hid;
    gul.join_time = Date.now();
    gul.userAlias =  '';
    gul.groupAlias = '';
    gul.avatar = currentUser.avatar;

    groupUserLinkBucket.put(gul.guid, gul);
    moveGroupCursor(agree.gid, agree.uid);
    logger.debug('Add user: ', uid, 'to groupUserLinkBucket');
    const info = new GroupSend();
    info.msg = '用户加群成功';
    info.mtype = MSG_TYPE.ADDGROUP;
    info.gid = agree.gid;
    info.time = Date.now();
    sendGroupMessage(info);
    
    return gInfo;
};

/**
 * 根据id或名称搜索群组
 */
// #[rpc=rpcServer]
export const searchGroup = (group: string): GroupInfoList => {
    console.log('!!!!!!!!!!!!searchGroup:', group);
    const groupInfoBucket = new Bucket(CONSTANT.WARE_NAME, GroupInfo._$info.name);
    const groupInfoList = new GroupInfoList();
    groupInfoList.list = [];
    const gid = parseInt(group, 10);
    if (isNaN(gid)) {
        // 不是群组id
        const iter = groupInfoBucket.iter(null, false);
        do {
            const v = iter.next();
            console.log('!!!!!!!!!!!!v:', v);
            if (!v) break;
            const groupInfo: GroupInfo = v[1];
            if (groupInfo.name.split(group).length > 1) {
                groupInfoList.list.push(groupInfo);
                continue;
            }
        } while (iter);

        return groupInfoList;
    }
    const groupInfo = groupInfoBucket.get<number, GroupInfo[]>(gid)[0];
    if (!groupInfo) {
        // id查找失败 根据群名称查找
        const iter = groupInfoBucket.iter(null, false);
        do {
            const v = iter.next();
            console.log('!!!!!!!!!!!!v:', v);
            if (!v) break;
            const groupInfo: GroupInfo = v[1];
            if (groupInfo.name.split(group).length > 1) {
                groupInfoList.list.push(groupInfo);
                continue;
            }
        } while (iter);
    } else {
        groupInfoList.list.push(groupInfo);
    }

    return groupInfoList;
};

/**
 * 用户被动或主动进入群组后创建一个游标
 */
const moveGroupCursor = (gid: number, rid: number) => {
    logger.debug('JoinGroup moveGroupCursor gid: ', gid, 'rid: ', rid);

    const guid = genGuid(gid, rid);
    const groupHistoryCursorBucket = new Bucket('file', CONSTANT.GROUP_HISTORY_CURSOR_TABLE);
    const msgLockBucket = new Bucket('file', CONSTANT.MSG_LOCK_TABLE);
    const msglock = msgLockBucket.get<string, MsgLock>(genGroupHid(gid))[0];

    const ridGroupCursor = new GroupHistoryCursor();
    ridGroupCursor.guid = guid;
    ridGroupCursor.cursor = msglock ? msglock.current : -1;

    logger.debug('JoinGroup moveGroupCursor guid: ', guid, 'ridGroupCursor: ', ridGroupCursor);
    groupHistoryCursorBucket.put(guid, ridGroupCursor);
};

/**
 * 转移群主
 * @param guid group user id
 */
// #[rpc=rpcServer]
export const setOwner = (guid: string): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    const groupId = getGidFromGuid(guid);
    const newOwnerId = getUidFromGuid(guid);
    const res = new Result();

    logger.debug('user logged in with uid: ', uid, 'and you want to chang new owner: ', newOwnerId);
    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(groupId)[0];
    if (uid !== gInfo.ownerid) {
        logger.debug('User: ', uid, 'is not the owner of group: ', gInfo.gid);
        res.r = 0; // not the group owner

        return res;
    }

    // 将原管理员列表对应项替换成新的群主
    const ownerIdindex = gInfo.adminids.indexOf(gInfo.ownerid);
    // 如果群主临时者是管理员
    if (gInfo.adminids.indexOf(newOwnerId) > -1) {
        gInfo.adminids.splice(ownerIdindex, 1);
    } else {
        gInfo.adminids.splice(ownerIdindex, 1, newOwnerId);
    }
    gInfo.ownerid = newOwnerId;
    groupInfoBucket.put(gInfo.gid, gInfo);
    logger.debug('change group: ', groupId, 'owner from: ', gInfo.ownerid, 'to: ', newOwnerId);

    const userinfo = getCurrentUserInfo(newOwnerId);
    const info = new GroupSend();
    info.msg = `${userinfo.name}成为了新的群主`;
    info.mtype = MSG_TYPE.OTHERMSG;
    info.gid = groupId;
    info.time = Date.now();
    sendGroupMessage(info);
    res.r = 1;

    return res;
};

/**
 * 添加管理员
 * @param guidsAdmin group users id
 */
// #[rpc=rpcServer]
export const addAdmin = (guidsAdmin: GuidsAdminArray): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    // 判断被添加的用户是否已经是管理员
    const uid = getUid();

    const guids = guidsAdmin.guids;

    const res = new Result();
    const groupId = getGidFromGuid(guids[0]);
    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(groupId)[0];
    if (!gInfo) {
        logger.debug('group: ', groupId, 'is not exist');
        res.r = -1;

        return res;
    }
    if (gInfo.state === GROUP_STATE.DISSOLVE) {
        logger.debug('group: ', groupId, 'was Disbanded');
        res.r = -1;

        return res;
    }
    if (gInfo.ownerid !== uid) {
        logger.debug('User: ', uid, 'is not an owner');
        res.r = -1;

        return res;
    }
    // 管理员人数超过5个
    if (gInfo.adminids.length + guids.length > 5) {
        logger.debug('admins count is: ',gInfo.adminids.length + guids.length);
        res.r = -2;

        return res;
    }
    const addAdminIds = [];
    for (const v of guids) {
        const uid = getUidFromGuid(v);
        if (gInfo.adminids.indexOf(uid) > -1) {
            res.r = 0;
            logger.debug('User: ', uid, 'is already an admin');

            return res;
        }
        gInfo.adminids.push(uid);
        addAdminIds.push(uid);
    }
    groupInfoBucket.put(gInfo.gid, gInfo);
    logger.debug('After add admin: ', gInfo);

    for (const v of addAdminIds) {
        const userinfo = getCurrentUserInfo(v);
        const info = new GroupSend();
        info.msg = `群主添加了${userinfo.name}为管理员`;
        info.mtype = MSG_TYPE.OTHERMSG;
        info.gid = groupId;
        info.time = Date.now();
        sendGroupMessage(info);
    }
    
    res.r = 1;

    return res;
};

/**
 * 删除管理员
 * @param guid group user id
 */
// #[rpc=rpcServer]
export const delAdmin = (guid: string): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();
    // 判断被添加的用户是否是管理员成员
    const groupId = getGidFromGuid(guid);
    const delAdminId = getUidFromGuid(guid);
    const res = new Result();

    logger.debug('user logged in with uid: ', uid, 'and you want to delete an admin: ', delAdminId);
    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(groupId)[0];
    logger.debug('read group info: ', gInfo);
    if (gInfo.state === 1) {
        logger.debug('group: ', gInfo.gid, ',', gInfo.name, 'is dissolve');
        res.r = -1;

        return res;
    }
    if (gInfo.gid === -1) {
        logger.debug('group: ', gInfo.gid, ',', gInfo.name, 'is not exist');
        res.r = -2;

        return res;
    }
    if (uid !== gInfo.ownerid) {
        logger.debug('user: ', uid, 'is not group owner, not have the permission of delete admins');
        res.r = -3;

        return res;
    }
    const adminids = gInfo.adminids;

    logger.debug('before delete admin memebers: ', gInfo.adminids);
    const index = adminids.indexOf(delAdminId);
    if (index > -1) {
        if (adminids[index] === gInfo.ownerid) {
            logger.debug('group owner: ', gInfo.ownerid, ',', 'is not allow to be delete');
            res.r = -4;

            return res;
        }
        adminids.splice(index, 1);
        gInfo.adminids = adminids;
        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug('after delete admin memmber: ', groupInfoBucket.get(gInfo.gid));

        const userinfo = getCurrentUserInfo(delAdminId);
        const info = new GroupSend();
        info.msg = `群主撤销了${userinfo.name}的管理员职位`;
        info.mtype = MSG_TYPE.OTHERMSG;
        info.gid = gInfo.gid;
        info.time = Date.now();
        const gh = sendGroupMessage(info);
        logger.debug('user exit group mess, gh: ',gh);

        res.r = 1;

        return res;
    } else {
        res.r = 0; // not an admin
        logger.debug('User: ', delAdminId, 'is not an admin');

        return res;
    }
};

/**
 * 剔除用户
 * @param guid group user id
 */
// #[rpc=rpcServer]
export const delMember = (guid: string): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    const groupId = getGidFromGuid(guid);
    const delId = getUidFromGuid(guid);
    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(groupId)[0];
    logger.debug('read group info: ', gInfo);
    const res = new Result();
    if (uid !== gInfo.ownerid && gInfo.adminids.indexOf(uid) === -1) {
        logger.debug('user : ', uid, 'is not a owner and admins');
        res.r = 0;

        return res;
    }
    if (delId === gInfo.ownerid || gInfo.adminids.indexOf(delId) > -1) {
        logger.debug('user : ', delId, 'is a owner or admins, cant remove');
        res.r = -1;

        return res;
    }
    logger.debug('user logged in with uid: ', uid, 'and you want to delete a member: ', delId);
    logger.debug('before delete memeber: ', gInfo.memberids);
    const index = gInfo.memberids.indexOf(delId);
    if (index > -1) {
        gInfo.memberids.splice(index, 1);
        const groupUserLinkBucket = getGroupUserLinkBucket();
        groupUserLinkBucket.delete(guid);
        logger.debug('delete user: ', delId, 'from groupUserLinkBucket');
    }
    
    groupInfoBucket.put(gInfo.gid, gInfo);
    // 被踢出用户的群列表中将该群去掉
    const contactBucket = getContactBucket();
    const contact = contactBucket.get<number, [Contact]>(delId)[0];
    const delGroupIndex = contact.group.indexOf(groupId);
    contact.group.splice(delGroupIndex, 1);
    contactBucket.put(delId, contact);
    logger.debug('user:', delId, 'has exit group', groupId);
    logger.debug('after delete memmber: ', groupInfoBucket.get(gInfo.gid)[0]);

    const userinfo = getCurrentUserInfo(delId);
    const info = new GroupSend();
    info.msg = `${userinfo.name}已被移出群组`;
    info.mtype = MSG_TYPE.OTHERMSG;
    info.gid = gInfo.gid;
    info.time = Date.now();
    const gh = sendGroupMessage(info);
    logger.debug('user exit group mess, gh: ',gh);

    res.r = 1;

    return res;
};

/**
 * 获取群组内的用户id
 * @param gid group id
 */
export const getGroupMembers = (gid: number): GroupMembers => {
    const groupInfoBucket = getGroupInfoBucket();

    const gm = new GroupMembers();
    const m = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];
    gm.members = m.memberids;

    return gm;
};

/**
 * 获取用户在群组内的信息
 * @param gid group id
 */
// #[rpc=rpcServer]
export const getGroupUserLink = (gid: number): GroupUserLinkArray => {
    const groupInfoBucket = getGroupInfoBucket();
    const groupUserLinkBucket = new Bucket('file', CONSTANT.GROUP_USER_LINK_TABLE);
    const userInfoBucket = new Bucket('file',CONSTANT.USER_INFO_TABLE);

    const gla = new GroupUserLinkArray();
    const m = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];
    logger.debug('getGroupUserLink gid: ', gid, 'groupInfo: ', m);
    if (!m) {
        gla.arr = [];

        return gla;
    }

    const guids = m.memberids.map(item => genGuid(gid, item));
    gla.arr = [];
    for (const i of guids) {
        let userlink = groupUserLinkBucket.get<string,GroupUserLink>(i)[0];
        const userInfo = userInfoBucket.get<number,UserInfo>(getUidFromGuid(i))[0];
        if (!userlink) {
            userlink = new GroupUserLink();
            userlink.guid = i;
            userlink.hid = '';
            userlink.join_time = Date.now();
            userlink.groupAlias = '';
        }
        userlink.userAlias = userInfo.name;
        userlink.avatar = userInfo.avatar; 
        gla.arr.push(userlink);
        console.log('getGroupUserLink userlink: ',userlink,'userinfo: ',userInfo);
    }

    logger.debug('Get group user link: ', gla);

    return gla;
    
};

/**
 * 创建群之前的判断 群组等级 初始化群组基础信息
 */
const judgeCreateGroup = (uid:number,contact:Contact, level1: any) => {
    const userInfoBucket = new Bucket('file', UserInfo._$info.name);
    const gInfo = new GroupInfo();
    // 获取用户的权限等级和对应的群组限制
    let level: number;
    const userInfo = userInfoBucket.get<number,UserInfo>(uid)[0];
    if (!userInfo) {
        level = VIP_LEVEL.VIP0;
    } else if (level1) {
        level = level1;
    } else {
        level = userInfo.level;
    }
    let groupLimit: number;
    switch (level) {
        case VIP_LEVEL.VIP0:
            groupLimit = CONSTANT.VIP0_GROUPS_LIMIT;
            break;
        case VIP_LEVEL.VIP5:
            groupLimit = CONSTANT.VIP5_GROUPS_LIMIT;
            break;
        default:
            groupLimit = CONSTANT.VIP0_GROUPS_LIMIT;
    }
    
    // 判断用户创建的群聊是否超过上限
    const groupCount = contact.myGroup.length;
    if (groupCount >= groupLimit) {
        gInfo.gid = USER_GREATE_GROUP_OVERLIMIT;

        return gInfo;
    } else {
        gInfo.adminids = [uid];
        gInfo.level = level; 
        // genAnnounceIncId(gInfo.gid, START_INDEX)
        gInfo.annoceids = [];
        gInfo.create_time = Date.now();
        gInfo.dissolve_time = 0;

        gInfo.join_method = 0;
        gInfo.ownerid = uid;
        // TODO: add self to memberids
        gInfo.memberids = [uid]; // add self to member
        gInfo.state = 0;
        gInfo.applyUser = [];

        return gInfo;
    }
};

/**
 * 创建群
 * @param uid user id
 * 
 * 
 */
// #[rpc=rpcServer]
export const createGroup = (groupInfo: GroupCreate): GroupInfo => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();
    const accountGeneratorBucket = new Bucket('file', CONSTANT.ACCOUNT_GENERATOR_TABLE);
    const contactBucket = getContactBucket();
    const contact = contactBucket.get<number, [Contact]>(uid)[0];
    const gInfo = judgeCreateGroup(uid, contact, groupInfo.level);
    if (gInfo.gid) {  // 创建的群个数超出限制
        return gInfo;
    }

    // 这是一个事务
    accountGeneratorBucket.readAndWrite(GENERATOR_TYPE.GROUP, (items: any[]) => {
        const accountGenerator = new AccountGenerator();
        accountGenerator.index = GENERATOR_TYPE.GROUP;
        accountGenerator.currentIndex = genNewIdFromOld(items[0].currentIndex);
        gInfo.gid = accountGenerator.currentIndex;

        return accountGenerator;
    });
    gInfo.name = groupInfo.name;
    gInfo.hid = genGroupHid(gInfo.gid);
    gInfo.note = groupInfo.note;
    gInfo.avatar = groupInfo.avatar;
    gInfo.need_agree = gInfo.level < VIP_LEVEL.VIP5 ? groupInfo.need_agree :false ;
    logger.debug('createGroup ginfo: ', gInfo);

    groupInfoBucket.put(gInfo.gid, gInfo);
    logger.debug('read group info: ', groupInfoBucket.get(gInfo.gid));
    // 修改创建群的人的联系人列表，把当前群组加进去
    contact.group.push(gInfo.gid);
    contact.myGroup.push(gInfo.gid);
    contactBucket.put(uid, contact);
    moveGroupCursor(gInfo.gid, uid);
    logger.debug('Add self: ', uid, 'to conatact group');
    // 创建群聊主题
    const groupTopic = `ims/group/msg/${gInfo.gid}`;
    const mqttServer = env.get('mqttServer');
    setMqttTopic(mqttServer, groupTopic, true, true);
    logger.debug('Set mqtt topic for group: ', gInfo.gid, 'with topic name: ', groupTopic);
    
    // 把创建群的用户加入groupUserLink
    const groupUserLinkBucket = new Bucket('file', CONSTANT.GROUP_USER_LINK_TABLE);
    const currentUser = getCurrentUserInfo(uid);
    const gulink = new GroupUserLink();
    gulink.groupAlias = '';
    gulink.guid = genGuid(gInfo.gid, uid);
    gulink.hid = '';
    gulink.join_time = Date.now();
    gulink.userAlias = '';
    gulink.avatar = currentUser.avatar;
    groupUserLinkBucket.put(gulink.guid, gulink);
    
    // 发送一条当前群组创建成功的消息
    const info = new GroupSend();
    info.msg = `你已经成功创建群 \"${gInfo.name}\"`;
    info.mtype = MSG_TYPE.CREATEGROUP;
    info.gid = gInfo.gid;
    info.time = Date.now();
    sendGroupMessage(info);

    return gInfo;
};

/**
 * 解散群
 * @param guid group user id
 */
// #[rpc=rpcServer]
export const dissolveGroup = (gid: number): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    const res = new Result();

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];

    if (uid === gInfo.ownerid) {
        gInfo.state = GROUP_STATE.DISSOLVE;
        groupInfoBucket.put(gid, gInfo);
        logger.debug('After group dissovled: ', groupInfoBucket.get(gid)[0]);

        const contactBucket = getContactBucket();
        gInfo.memberids.forEach((uid) => {
            const contact = contactBucket.get<number, [Contact]>(uid)[0];
            const index = contact.group.indexOf(gid);
            if (index > -1) {
                contact.group.splice(index, 1);
            }
            contactBucket.put(uid, contact);
            logger.debug('dissolveGroup uid: ', uid, 'contact', contact);
        });
        // 删除群主题
        const mqttServer = env.get('mqttServer');
        const groupTopic = `ims/group/msg/${gid}`;
        console.log('删除群主题！！！！！！！！！！！！！！', groupTopic);
        unsetMqttTopic(mqttServer, groupTopic);
        console.log('删除群主题！！！！！！！！！！！！！！ok');
        res.r = 1;

        return res;
    }
    res.r = 0;

    return res;

};

/**
 * 修改群信息
 * @param gid group id
 * @param groupAlias group alias / new group name
 */
// #[rpc=rpcServer]
export const updateGroupInfo = (newGroup: NewGroup): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const gid = newGroup.gid;
    const uid = getUid();

    const res = new Result();

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];
    logger.debug('updateGroupInfo group begin: ', gInfo);

    if (uid === gInfo.ownerid) {
        gInfo.name = newGroup.name;
        gInfo.avatar = newGroup.avatar;
        gInfo.note = newGroup.note;
        groupInfoBucket.put(gid, gInfo);
        logger.debug('updateGroupInfo group after: ', gInfo);

        res.r = 1;

        return res;
    }
}; 

/**
 * 群管理员设置群是否需要验证加入群
 * 
 */
// #[rpc=rpcServer]
export const updateNeedAgree = (needAgree: NeedAgree): Result => {
    const uid = getUid();
    const gid = needAgree.gid;
    const result = new Result();
    // 获取群信息
    const groupInfoBucket = getGroupInfoBucket();
    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];
    // 判断用户是否是该群的管理员
    if (!(gInfo.adminids.indexOf(uid) > -1 || gInfo.ownerid === uid)) {
        result.r = OPERAT_WITHOUT_AUOTH;

        return result;
    }
    gInfo.need_agree = needAgree.need_agree;
    groupInfoBucket.put(gid, gInfo);
    result.r = CONSTANT.RESULT_SUCCESS;

    return result;
}; 

export const getUid = () => {
    // const dbMgr = getEnv().getDbMgr();
    // const session = getEnv().getSession();
    // let uid;
    // read(dbMgr, (tr: Tr) => {
    //     uid = session.get(tr, 'uid');
    // });
    const uid = getSession('uid');

    return parseInt(uid, 10);
};
// ============ helpers =================

// 获取群成员上限
const getGroupMaxMembers = (groupLevel: number) => {
    let maxMembers: number;
    switch (groupLevel) {
        case VIP_LEVEL.VIP0:
            maxMembers = CONSTANT.VIP0_GROUP_MEMBERS_LIMIT;
            break;
        case VIP_LEVEL.VIP5:
            maxMembers = CONSTANT.VIP5_GROUP_MEMBERS_LIMIT;
            break;
        default:
            maxMembers = CONSTANT.VIP0_GROUP_MEMBERS_LIMIT;
    }

    return maxMembers;
};

const getGroupUserLinkBucket = () => {

    return new Bucket('file', CONSTANT.GROUP_USER_LINK_TABLE);
};

const getGroupInfoBucket = () => {

    return new Bucket('file', CONSTANT.GROUP_INFO_TABLE);
};

const getContactBucket = () => {

    return new Bucket('file', CONSTANT.CONTACT_TABLE);
};

const getCurrentUserInfo = (uid?: number): UserInfo => {
    const currentUid = uid || getUid();
    const userInfoBucket = new Bucket('file', CONSTANT.USER_INFO_TABLE);

    return userInfoBucket.get(currentUid)[0];
};