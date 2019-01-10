/**
 * 群组相关的rpc操作
 */
// ================================================================= 导入
import { GROUP_STATE, GroupInfo, GroupUserLink } from '../db/group.s';
import { AccountGenerator, Contact, GENERATOR_TYPE, UserInfo } from '../db/user.s';
import { GroupUserLinkArray, Result } from './basic.s';
import { GroupAgree, GroupAlias, GroupCreate, GroupMembers, GuidsAdminArray, Invite, InviteArray } from './group.s';

import { getEnv } from '../../../../pi_pt/net/rpc_server';
import { ServerNode } from '../../../../pi_pt/rust/mqtt/server';
import { setMqttTopic } from '../../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../../utils/db';
import { Logger } from '../../../utils/logger';
import { delGidFromApplygroup, delValueFromArray, genGroupHid, genGuid, genNewIdFromOld, getGidFromGuid, getUidFromGuid } from '../../../utils/util';
import { getSession } from '../../rpc/session.r';
import * as CONSTANT from '../constant';
import { GroupHistoryCursor, MsgLock  } from '../db/message.s';

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
    if (gInfo.memberids.indexOf(uid) > -1) {
        res.r = -1;
        logger.debug(`user: ${uid}, is exist in group: ${gInfo.name}`);

        return res;
    }
    gInfo.applyUser.findIndex(item => item === uid) < 0 && gInfo.applyUser.push(uid);
    groupInfoBucket.put(gid, gInfo);
    res.r = 1;

    return res;
};

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
        gInfo.memberids.splice(uidIndex, 1);
        groupInfoBucket.put(gid, gInfo);
        logger.debug('user: ', uid, 'exit group: ', gid);

        contact.group.splice(gidIndex, 1);
        contactBucket.put(uid, contact);
        logger.debug('Remove group: ', gid, 'from user\'s contact');

        const groupUserLinkBucket = getGroupUserLinkBucket();
        groupUserLinkBucket.delete(`${gid}:${uid}`);
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

    if (!(admins.indexOf(uid) > -1 || owner === uid)) {
        res.r = 3; // user is not admin or owner
        logger.debug('User: ', uid, 'is not amdin or owner');

        return res;
    }

    if (!agree.agree) {
        res.r = 4; // admin refuse user to join
        logger.debug('Admin refuse user: ', agree.uid, 'to join in group: ', agree.gid);

        return res;
    }
    if (gInfo.memberids.indexOf(agree.uid) > -1 || gInfo.adminids.indexOf(agree.uid) > -1) {
        res.r = 2; // user has been exist
        logger.debug('User: ', agree.uid, 'has been exist');

        return res;
    } else if (contact === undefined) {
        res.r = -1; // agree.uid is not a registered user
        logger.error('user: ', agree.uid, 'is not a registered user');

        return res;
    } else {
        gInfo.memberids.push(agree.uid);
        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug('Accept user: ', agree.uid, 'to group: ', agree.gid);
        contact.applyGroup = delValueFromArray(agree.gid,contact.applyGroup);  // 同意用户入群，清空该用户受该群组的邀请记录
        contact.group.push(agree.gid);
        contactBucket.put(agree.uid, contact);
        logger.debug('Add group: ', agree.gid, 'to user\'s contact: ', contact.group);

        const groupUserLinkBucket = getGroupUserLinkBucket();
        const gul = new GroupUserLink();
        gul.guid = `${agree.gid}:${agree.uid}`;
        gul.hid = '';
        gul.join_time = Date.now();
        gul.userAlias = getCurrentUserInfo(agree.uid).name;
        gul.groupAlias = '';

        groupUserLinkBucket.put(gul.guid, gul);
        logger.debug('Add user: ', agree.uid, 'to groupUserLinkBucket');

        res.r = 1; // successfully add user
    }
    moveGroupCursor(agree.gid, agree.uid);

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
    // 判断该用户是否属于该群组
    if (gInfo.memberids.indexOf(uid) <= -1) {
        logger.debug('user: ', uid, 'is not a member of this group');
        res.r = 2; // User is not a member of this group

        return res;
    }
    // 判断该用户是否和被邀请的用户是好友
    const currentUserInfo = contactBucket.get<number, [Contact]>(uid)[0];
    logger.debug(`before filter invites is : ${JSON.stringify(invites.arr)}`);
    logger.debug(`currentUserInfo.friends is : ${JSON.stringify(currentUserInfo.friends)}`);
    invites.arr = invites.arr.filter((ele: Invite) => {
        // 无法邀请不是好友的用户
        return currentUserInfo.friends.findIndex(item => item === ele.rid) !== -1;
    });
    logger.debug(`after filter invites is : ${JSON.stringify(invites.arr)}`);
    for (let i = 0; i < invites.arr.length; i++) {
        const rid = invites.arr[i].rid;
        const cInfo = contactBucket.get<number, [Contact]>(rid)[0];
        // TODO: 判断对方是否已经在当前群中
        if (gInfo.memberids.indexOf(rid) > -1) {
            logger.debug('be invited user: ', rid, 'is exist in this group:', gid);
            continue;
        }
        cInfo.applyGroup.indexOf(genGuid(gid, rid)) === -1 && cInfo.applyGroup.push(genGuid(gid, rid));
        contactBucket.put(rid, cInfo);
        logger.debug('Invite user: ', rid, 'to group: ', gid);
    }

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

    } else {
        cInfo.group.push(agree.gid);
        contactBucket.put(uid, cInfo);
        gInfo.memberids.push(uid);
        gInfo.applyUser = delValueFromArray(agree.uid, gInfo.applyUser); // 用户同意入群，清空该群组该用户的申请记录
        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug('User: ', uid, 'agree to join group: ', agree.gid);

        const groupUserLinkBucket = getGroupUserLinkBucket();
        const gul = new GroupUserLink();
        gul.guid = genGuid(agree.gid, uid);
        gul.hid = gInfo.hid;
        gul.join_time = Date.now();
        gul.userAlias = getCurrentUserInfo().name;
        gul.groupAlias = gInfo.name;

        groupUserLinkBucket.put(gul.guid, gul);
        logger.debug('Add user: ', uid, 'to groupUserLinkBucket');
    }
    moveGroupCursor(agree.gid, agree.uid);

    return gInfo;
};

/**
 * 用户被动或主动进入群组后创建一个游标
 */
const moveGroupCursor = (gid: number, rid: number) => {
    logger.debug('JoinGroup moveGroupCursor gid: ', gid, 'rid: ', rid);

    const dbMgr = getEnv().getDbMgr();
    const guid = genGuid(gid, rid);
    const groupHistoryCursorBucket = new Bucket('file', CONSTANT.GROUP_HISTORY_CURSOR_TABLE, dbMgr);
    const msgLockBucket = new Bucket('file', CONSTANT.MSG_LOCK_TABLE, dbMgr);
    const msglock = msgLockBucket.get<string, MsgLock>(genGroupHid(gid))[0];

    const ridGroupCursor = new GroupHistoryCursor();
    ridGroupCursor.guid = guid;
    ridGroupCursor.cursor = -1;
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
    // TODO:判断群是否已经销毁
    // TODO:判断群是否存在
    // TODO:先判断当前用户是否是管理员
    // TODO:判断被添加的用户是否是群成员
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
    guids.forEach(item => {
        const addAdminId = item.split(':')[1];
        if (gInfo.adminids.indexOf(parseInt(addAdminId, 10)) > -1) {
            res.r = 0;
            logger.debug('User: ', addAdminId, 'is already an admin');

            return res;
        }
        logger.debug('user logged in with uid: ', uid, 'and you want to add an admin: ', addAdminId);
        gInfo.adminids.push(parseInt(addAdminId, 10));
    });
    groupInfoBucket.put(gInfo.gid, gInfo);
    logger.debug('After add admin: ', gInfo);
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
    // TODO:判断群是否已经销毁
    // TODO:判断群是否存在
    // TODO:先判断当前用户是否是管理员
    // TODO:判断是否是群主，群主必须是管理员,不能被删除
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
    const members = gInfo.memberids;
    logger.debug('before delete memeber: ', gInfo.memberids);
    const index = members.indexOf(delId);
    if (index > -1) {
        members.splice(index, 1);
        const groupUserLinkBucket = getGroupUserLinkBucket();
        groupUserLinkBucket.delete(guid);
        logger.debug('delete user: ', delId, 'from groupUserLinkBucket');
    }

    gInfo.memberids = members;
    groupInfoBucket.put(gInfo.gid, gInfo);
    // 被踢出用户的群列表中将该群去掉
    const contactBucket = getContactBucket();
    const contact = contactBucket.get<number, [Contact]>(delId)[0];
    const delGroupIndex = contact.group.indexOf(groupId);
    contact.group.splice(delGroupIndex, 1);
    contactBucket.put(delId, contact);
    logger.debug('user:', delId, 'has exit group', groupId);
    logger.debug('after delete memmber: ', groupInfoBucket.get(gInfo.gid)[0]);

    res.r = 1;

    return res;
};

/**
 * 获取群组内的用户id
 * @param gid group id
 */
export const getGroupMembers = (gid: number): GroupMembers => {
    const dbMgr = getEnv().getDbMgr();
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
    const dbMgr = getEnv().getDbMgr();
    const groupInfoBucket = getGroupInfoBucket();
    const groupUserLinkBucket = new Bucket('file', CONSTANT.GROUP_USER_LINK_TABLE, dbMgr);

    const gla = new GroupUserLinkArray();
    const m = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];
    logger.debug('getGroupUserLink gid: ', gid, 'groupInfo: ', m);

    if (m) {
        const guids = m.memberids.map(item => genGuid(gid, item));
        gla.arr = groupUserLinkBucket.get(guids);

        logger.debug('Get group user link: ', gla);

        return gla;
    }
    gla.arr = [];

    return gla;
};

/**
 * 创建群
 * @param uid user id
 * 
 * 
 */
// #[rpc=rpcServer]
export const createGroup = (groupInfo: GroupCreate): GroupInfo => {
    const dbMgr = getEnv().getDbMgr();
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();
    const accountGeneratorBucket = new Bucket('file', CONSTANT.ACCOUNT_GENERATOR_TABLE, dbMgr);

    if (uid !== undefined) {
        const gInfo = new GroupInfo();
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
        gInfo.adminids = [uid];
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

        logger.debug('create group: ', gInfo);

        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug('read group info: ', groupInfoBucket.get(gInfo.gid));
        // 修改创建群的人的联系人列表，把当前群组加进去
        const contactBucket = getContactBucket();
        const contact = contactBucket.get<number, [Contact]>(uid)[0];
        contact.group.push(gInfo.gid);
        contactBucket.put(uid, contact);
        logger.debug('Add self: ', uid, 'to conatact group');
        // 发送一条当前群组创建成功的消息，其实不是必须的
        const groupTopic = `ims/group/msg/${gInfo.gid}`;
        const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
        setMqttTopic(mqttServer, groupTopic, true, true);
        logger.debug('Set mqtt topic for group: ', gInfo.gid, 'with topic name: ', groupTopic);
        // 把创建群的任加入groupUserLink
        const groupUserLinkBucket = new Bucket('file', CONSTANT.GROUP_USER_LINK_TABLE, dbMgr);
        const gulink = new GroupUserLink();
        gulink.groupAlias = '';
        gulink.guid = genGuid(gInfo.gid, uid);
        gulink.hid = '';
        gulink.join_time = Date.now();
        gulink.userAlias = getCurrentUserInfo(uid).name;

        groupUserLinkBucket.put(gulink.guid, gulink);

        return gInfo;
    }
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
        // const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
        // const groupTopic = `ims/group/msg/${gid}`;
        // console.log('删除群主题！！！！！！！！！！！！！！', groupTopic);
        // unsetMqttTopic(mqttServer, groupTopic);
        // console.log('删除群主题！！！！！！！！！！！！！！ok');
        res.r = 1;

        return res;
    }
    res.r = 0;

    return res;

};

/**
 * 修改群名
 * @param gid group id
 * @param groupAlias group alias / new group name
 */
// #[rpc=rpcServer]
export const updateGroupAlias = (gAlias: GroupAlias): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const gid = gAlias.gid;
    const newGroupName = gAlias.groupAlias;
    const uid = getUid();

    const res = new Result();

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];

    if (uid === gInfo.ownerid) {
        gInfo.name = newGroupName;
        groupInfoBucket.put(gid, gInfo);
        logger.debug('After update group name: ', groupInfoBucket.get(gid)[0]);

        res.r = 1;

        return res;
    }
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

const getGroupUserLinkBucket = () => {
    const dbMgr = getEnv().getDbMgr();

    return new Bucket('file', CONSTANT.GROUP_USER_LINK_TABLE, dbMgr);
};

const getGroupInfoBucket = () => {
    const dbMgr = getEnv().getDbMgr();

    return new Bucket('file', CONSTANT.GROUP_INFO_TABLE, dbMgr);
};

const getContactBucket = () => {
    const dbMgr = getEnv().getDbMgr();

    return new Bucket('file', CONSTANT.CONTACT_TABLE, dbMgr);
};

const getCurrentUserInfo = (uid?: number): UserInfo => {
    const currentUid = uid || getUid();
    const dbMgr = getEnv().getDbMgr();
    const userInfoBucket = new Bucket('file', CONSTANT.USER_INFO_TABLE, dbMgr);

    return userInfoBucket.get(currentUid)[0];
};