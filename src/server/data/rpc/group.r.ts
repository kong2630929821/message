/**
 * 群组相关的rpc操作
 */
// ================================================================= 导入
import { GroupInfo, GroupUserLink } from '../db/group.s';
import { Contact } from '../db/user.s';
import { GroupUserLinkArray, Result } from './basic.s';
import { GroupAgree, GroupCreate, GroupMembers, InviteArray, NotifyAdmin } from './group.s';

import { BonBuffer } from '../../../pi/util/bon';
import { read, write } from '../../../pi_pt/db';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { ServerNode } from '../../../pi_pt/rust/mqtt/server';
import { Tr } from '../../../pi_pt/rust/pi_db/mgr';
import { mqttPublish, QoS, setMqttTopic } from '../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../../utils/db';
import { Logger } from '../../../utils/logger';
import * as CONSTANT from '../constant';
import { GroupHistory, GroupMsg } from '../db/message.s';
import { AccountId } from '../db/msgid';

const logger = new Logger('GROUP');

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
    const admins = gInfo.adminids;

    const notify = new NotifyAdmin();
    notify.uid = parseInt(uid,10);

    const buf = new BonBuffer();
    notify.bonEncode(buf);

    const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
    // notify all admins
    for (let i = 0; i < admins.length; i++) {
        // TODO: persist this message
        mqttPublish(mqttServer, true, QoS.AtMostOnce, admins[i].toString(), buf.getBuffer());
        logger.debug('Notify admin: ', admins[i], 'for user: ', uid, 'want to join the group');
    }
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
    const index1 = gInfo.memberids.indexOf(parseInt(uid,10));
    const contact = contactBucket.get<number, [Contact]>(parseInt(uid,10))[0];
    const index2 = contact.group.indexOf(gid);

    if (index1 > -1) {
        gInfo.memberids.splice(index1, 1);
        groupInfoBucket.put(gid, gInfo);
        logger.debug('user: ', uid, 'exit group: ', gid);

        contact.group.splice(index2, 1);
        contactBucket.put(parseInt(uid,10), contact);
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

    if (!(admins.indexOf(parseInt(uid,10)) > -1 || owner === parseInt(uid,10))) {
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
    } else if (contact === undefined) {
        res.r = -1; // agree.uid is not a registered user
        logger.error('user: ', agree.uid, 'is not a registered user');

        return res;
    } else {
        gInfo.memberids.push(agree.uid);
        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug('Accept user: ', agree.uid, 'to group: ', agree.gid);
        contact.group.push(agree.gid);
        contactBucket.put(agree.uid, contact);
        logger.debug('Add group: ', agree.gid, 'to user\'s contact: ', contact.group);

        const groupUserLinkBucket = getGroupUserLinkBucket();
        const gul = new GroupUserLink();
        gul.guid = `${agree.gid}:${agree.uid}`;
        gul.hid = '';
        gul.join_time = Date.now();
        gul.userAlias = '';
        gul.groupAlias = '';

        groupUserLinkBucket.put(gul.guid, gul);
        logger.debug('Add user: ', agree.uid, 'to groupUserLinkBucket');

        res.r = 1; // successfully add user
    }

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
    if (gInfo.memberids.indexOf(parseInt(uid,10)) <= -1) {
        logger.debug('user: ', uid, 'is not a member of this group');
        res.r = 2; // User is not a member of this group
        return res;
    }

    for (let i = 0; i < invites.arr.length; i++) {
        const rid = invites.arr[i].rid;
        const cInfo = contactBucket.get<number, [Contact]>(rid)[0];
        cInfo.applyGroup.push(gid);
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
    if (!agree.agree) {
        logger.debug('User: ', uid, 'don\'t want to join group: ', agree.gid);
        gInfo.gid = -1; // gid = -1 indicate that user don't want to join this group

        return gInfo;
    }

    const cInfo = contactBucket.get<number, [Contact]>(agree.uid)[0];

    if (gInfo.memberids.indexOf(agree.uid) > -1) {
        logger.debug('User: ', agree.uid, 'has been exist');
    } else {
        gInfo.memberids.push(agree.uid);
        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug('User: ', agree.uid, 'agree to join group: ', agree.gid);
        cInfo.group.push(agree.gid);
        logger.debug('Add group: ', agree.gid, 'to user\'s contact: ', cInfo.group);

        const groupUserLinkBucket = getGroupUserLinkBucket();
        const gul = new GroupUserLink();
        gul.guid = `${agree.gid}:${agree.uid}`;
        gul.hid = '';        
        gul.join_time = Date.now();
        gul.userAlias = '';
        gul.groupAlias = '';

        groupUserLinkBucket.put(gul.guid, gul);
        logger.debug('Add user: ', agree.uid, 'to groupUserLinkBucket');
    }

    return gInfo;
};

/**
 * 转移群主
 * @param guid group user id
 */
// #[rpc=rpcServer]
export const setOwner = (guid: string): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    const groupId = guid.split(':')[0];
    const newOwnerId = guid.split(':')[1];
    const res = new Result();

    logger.debug('user logged in with uid: ', uid, 'and you want to chang new owner: ', newOwnerId);
    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(parseInt(groupId,10))[0];
    if (parseInt(uid,10) !== gInfo.ownerid) {
        logger.debug('User: ', uid, 'is not the owner of group: ', gInfo.gid);
        res.r = 0; // not the group owner

        return res;
    }

    gInfo.ownerid = parseInt(newOwnerId,10);
    groupInfoBucket.put(gInfo.gid, gInfo);
    logger.debug('change group: ', groupId, 'owner from: ', gInfo.ownerid, 'to: ', newOwnerId);
    res.r = 1;

    return res;
};

/**
 * 添加管理员
 * @param guid
 */
// #[rpc=rpcServer]
export const addAdmin = (guid: string): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    const groupId = guid.split(':')[0];
    const addAdminId = guid.split(':')[1];
    const res = new Result();

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(parseInt(groupId,10))[0];
    if (gInfo.adminids.indexOf(parseInt(addAdminId,10)) > -1) {
        res.r = 0;
        logger.debug('User: ', addAdminId, 'is already an admin');

        return res;
    }
    logger.debug('user logged in with uid: ', uid, 'and you want to add an admin: ', addAdminId);
    gInfo.adminids.push(parseInt(addAdminId,10));
    gInfo.memberids.push(parseInt(addAdminId,10));
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

    const groupId = guid.split(':')[0];
    const delAdminId = guid.split(':')[1];
    const res = new Result();

    logger.debug('user logged in with uid: ', uid, 'and you want to delete an admin: ', delAdminId);
    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(parseInt(groupId,10))[0];
    logger.debug('read group info: ', gInfo);
    const members = gInfo.adminids;

    logger.debug('before delete admin memebers: ', gInfo.adminids);
    const index = members.indexOf(parseInt(delAdminId,10));
    if (index > -1) {
        members.splice(index, 1);
        gInfo.adminids = members;
        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug('after delete admin memmber: ', groupInfoBucket.get(gInfo.gid));

        const groupUserLinkBucket = getGroupUserLinkBucket();
        groupUserLinkBucket.delete(guid);
        logger.debug('delete user: ', delAdminId, 'from groupUserLinkBucket');

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
 * @param guid
 */
// #[rpc=rpcServer]
export const delMember = (guid: string): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    const groupId = guid.split(':')[0];
    const delId = guid.split(':')[1];
    const res = new Result();

    logger.debug('user logged in with uid: ', uid, 'and you want to delete a member: ', delId);
    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(parseInt(groupId,10));
    logger.debug('read group info: ', gInfo[0]);
    const members = gInfo[0].memberids;

    logger.debug('before delete memeber: ', gInfo[0].memberids);
    const index = members.indexOf(parseInt(delId,10));
    if (index > -1) {
        members.splice(index, 1);
        const groupUserLinkBucket = getGroupUserLinkBucket();
        groupUserLinkBucket.delete(guid);
        logger.debug('delete user: ', delId, 'from groupUserLinkBucket');
    }

    gInfo[0].memberids = members;
    groupInfoBucket.put(gInfo[0].gid, gInfo[0]);
    logger.debug('after delete memmber: ', groupInfoBucket.get(gInfo[0].gid)[0]);

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
 * @param gid
 */
export const getGroupUserLink = (gid: number): GroupUserLinkArray => {
    const dbMgr = getEnv().getDbMgr();
    const groupInfoBucket = getGroupInfoBucket();
    const groupUserLinkBucket = new Bucket('file', CONSTANT.GROUP_USER_LINK_TABLE, dbMgr);
    const gla = new GroupUserLinkArray();

    const m = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];

    for (let i = 0; i < m.memberids.length; i++) {
        const guid = `${gid}:${m.memberids[i]}`;
        gla.arr.push(groupUserLinkBucket.get(guid)[0]);
    }

    logger.debug('Get group user link: ', gla);

    return gla;
};

/**
 * 创建群
 * @param uid user id
 */
// #[rpc=rpcServer]
export const createGroup = (groupInfo: GroupCreate): GroupInfo => {
    const dbMgr = getEnv().getDbMgr();
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();
    const idGen = new AccountId(dbMgr);

    if (uid !== undefined) {
        const gInfo = new GroupInfo();
        gInfo.note = groupInfo.note;
        gInfo.adminids = [parseInt(uid,10)];
        gInfo.annoceid = '0:0';
        gInfo.create_time = Date.now();
        gInfo.dissolve_time = 0;
        gInfo.gid = idGen.nextGroupId();
        gInfo.join_method = 0;
        gInfo.ownerid = parseInt(uid,10);
        // TODO: add self to memberids
        gInfo.memberids = [parseInt(uid,10)]; // add self to member
        gInfo.state = 0;

        logger.debug('create group: ', gInfo);

        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug('read group info: ', groupInfoBucket.get(gInfo.gid));

        const contactBucket = getContactBucket();
        const contact = contactBucket.get<number, [Contact]>(parseInt(uid,10))[0];
        contact.group.push(gInfo.gid);
        contactBucket.put(parseInt(uid,10), contact);
        logger.debug('Add self: ', uid, 'to conatact group');

        const groupTopic = `ims/group/msg/${gInfo.gid}`;
        const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
        setMqttTopic(mqttServer, groupTopic, true, true);
        logger.debug('Set mqtt topic for group: ', gInfo.gid, 'with topic name: ', groupTopic);

        const groupUserLinkBucket = new Bucket('file', CONSTANT.GROUP_USER_LINK_TABLE, dbMgr);
        const gulink = new GroupUserLink();
        gulink.groupAlias = '';
        gulink.guid = `${gInfo.gid}:${uid}`;
        gulink.hid = '';
        gulink.join_time = Date.now();
        gulink.userAlias = '';

        groupUserLinkBucket.put(gulink.guid, gulink);

        return gInfo;
    }
};

/**
 * 解散群
 * @param guid
 */
// #[rpc=rpcServer]
export const dissolveGroup = (gid: number): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    const res = new Result();

    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid);

    if (parseInt(uid,10) === gInfo[0].ownerid) {
        gInfo[0].state = 1;
        groupInfoBucket.put(gid, gInfo[0]);
        logger.debug('After group dissovled: ', groupInfoBucket.get(gid)[0]);

        res.r = 1;

        return res;
    }

    // TODO: delete group topic
};

// ============ helpers =================

const getGroupUserLinkBucket = () => {
    const dbMgr = getEnv().getDbMgr();

    return new Bucket('file', CONSTANT.GROUP_USER_LINK_TABLE, dbMgr);
};

const getGroupInfoBucket = () => {
    const dbMgr = getEnv().getDbMgr();

    return  new Bucket('file', CONSTANT.GROUP_INFO_TABLE, dbMgr);
};

const getContactBucket = () => {
    const dbMgr = getEnv().getDbMgr();

    return new Bucket('file', CONSTANT.CONTACT_TABLE, dbMgr);
};

const getUid = () => {
    const dbMgr = getEnv().getDbMgr();
    const session = getEnv().getSession();
    let uid;
    read(dbMgr, (tr: Tr) => {
        uid = session.get(tr, 'uid');
    });

    return uid;
};