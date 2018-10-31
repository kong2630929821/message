/**
 * 群组相关的rpc操作
 */
// ================================================================= 导入
import { GroupInfo } from "../db/group.s";
import { Contact } from "../db/user.s"
import { Result } from "./basic.s";
import { GroupCreate, GroupAgree, InviteArray, NotifyAdmin } from "./group.s";

import { GroupHistory, GroupMsg } from "../db/message.s";
import { Bucket } from "../../../utils/db";
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { ServerNode } from '../../../pi_pt/rust/mqtt/server';
import { setMqttTopic, mqttPublish, QoS } from "../../../pi_pt/rust/pi_serv/js_net";
import * as CONSTANT from '../constant';
import { Tr } from "../../../pi_pt/rust/pi_db/mgr";
import { write, read } from "../../../pi_pt/db";
import { Logger } from '../../../utils/logger';
import { BonBuffer } from "../../../pi/util/bon";

const logger = new Logger('GROUP');

// ================================================================= 导出

/**
 * 用户主动申请加入群组
 * @param guid
 */
//#[rpc=rpcServer]
export const applyJoinGroup = (gid: number): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();
    const res = new Result();

    let gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];
    let admins = gInfo.adminids;

    let notify = new NotifyAdmin();
    notify.uid = parseInt(uid);

    let buf = new BonBuffer();
    notify.bonEncode(buf);

    let mqttServer = getEnv().getNativeObject<ServerNode>("mqttServer");
    // notify all admins
    for (let i = 0; i < admins.length; i++) {
        //TODO: persist this message
        mqttPublish(mqttServer, true, QoS.AtMostOnce, admins[i].toString(), buf.getBuffer());
        logger.debug("Notify admin: ", admins[i], "for user: ", uid, "want to join the group");
    }
    res.r = 1;

    return res;
}

/**
 * 用户主动退出群组
 * @param gid group number
 */

//#[rpc=rpcServer]
export const userExitGroup = (gid: number): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const contactBucket = getContactBucket();

    const uid = getUid();
    const res = new Result();

    let gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];
    let index1 = gInfo.memberids.indexOf(parseInt(uid));
    let contact = contactBucket.get<number, [Contact]>(parseInt(uid))[0];
    let index2 = contact.group.indexOf(gid);

    if (index1 > -1) {
        gInfo.memberids.splice(index1, 1);
        groupInfoBucket.put(gid, gInfo);
        logger.debug("user: ", uid, "exit group: ", gid);

        contact.group.splice(index2, 1);
        contactBucket.put(parseInt(uid), contact);
        logger.debug("Remove group: ", gid, "from user's contact");

        res.r = 1;
    } else {
        res.r = 0;
    }

    return res;
}

/**
 * 管理员接受/拒绝用户的加群申请
 * @param agree
 */
//#[rpc=rpcServer]
export const acceptUser = (agree: GroupAgree): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();
    const res = new Result();

    let gInfo = groupInfoBucket.get<number, [GroupInfo]>(agree.gid)[0];
    let admins = gInfo.adminids;
    let owner = gInfo.ownerid;

    const contactBucket = getContactBucket();
    let contact = contactBucket.get<number, [Contact]>(agree.uid)[0];

    if (!(admins.indexOf(parseInt(uid)) > -1 || owner === parseInt(uid))) {
        res.r = 3; // user is not admin or owner
        logger.debug("User: ", uid, "is not amdin or owner");
        return res;
    }

    if(!agree.agree) {
        res.r = 4; // admin refuse user to join
        logger.debug('Admin refuse user: ', agree.uid, "to join in group: ", agree.gid);
        return res;
    }
    if (gInfo.memberids.indexOf(agree.uid) > -1 || gInfo.adminids.indexOf(agree.uid) > -1) {
        res.r = 2; // user has been exist
        logger.debug("User: ", agree.uid, "has been exist");
    } else if (contact === undefined) {
        res.r = -1; // agree.uid is not a registered user
        logger.error("user: ", agree.uid, "is not a registered user");
        return res;
    } else {
        gInfo.memberids.push(agree.uid);
        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug("Accept user: ", agree.uid, "to group: ", agree.gid);
        contact.group.push(agree.gid);
        contactBucket.put(agree.uid, contact);
        logger.debug("Add group: ", agree.gid, "to user's contact: ", contact.group);
        res.r = 1; //successfully add user
    }

    return res;
}

/**
 * 群成员邀请其他用户加入群
 * @param invite
 */
//#[rpc=rpcServer]
export const inviteUsers = (invites: InviteArray): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const contactBucket = getContactBucket();
    const uid = getUid();
    let res = new Result();
    let gid = invites.arr[0].gid;

    let gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid)[0];
    if (gInfo.memberids.indexOf(parseInt(uid)) <= -1) {
        logger.debug("user: ", uid, "is not a member of this group");
        res.r = 2; // User is not a member of this group
        return res;
    }

    for (let i = 0; i < invites.arr.length; i++) {
        let rid = invites.arr[i].rid;
        let cInfo = contactBucket.get<number, [Contact]>(rid)[0];
        cInfo.applyGroup.push(gid);
        contactBucket.put(rid, cInfo);
        logger.debug("Invite user: ", rid, "to group: ", gid);
    }

    res.r = 1;
    return res;
}

/**
 * 用户同意加入群组(被动加入)
 * @param agree
 */
//#[rpc=rpcServer]
export const agreeJoinGroup = (agree: GroupAgree): GroupInfo => {
    const groupInfoBucket = getGroupInfoBucket();
    const contactBucket = getContactBucket();
    const uid = getUid();

    let gInfo = groupInfoBucket.get<number, [GroupInfo]>(agree.gid)[0];
    if (!agree.agree) {
        logger.debug("User: ", uid, "don't want to join group: ", agree.gid);
        gInfo.gid = -1; // gid = -1 indicate that user don't want to join this group

        return gInfo;
    }

    let cInfo = contactBucket.get<number, [Contact]>(agree.uid)[0];

    if (gInfo.memberids.indexOf(agree.uid) > -1) {
        logger.debug("User: ", agree.uid, "has been exist");
    } else {
        gInfo.memberids.push(agree.uid);
        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug("User: ", agree.uid, "agree to join group: ", agree.gid);
        cInfo.group.push(agree.gid);
        logger.debug("Add group: ", agree.gid, "to user's contact: ", cInfo.group);
        logger.debug("")
    }

    return gInfo;
}

/**
 * 转移群主
 * @param guid
 */
//#[rpc=rpcServer]
export const setOwner = (guid: string): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    let groupId = guid.split(":")[0];
    let newOwnerId = guid.split(":")[1];
    let res = new Result();

    logger.debug("user logged in with uid: ", uid, "and you want to chang new owner: ", newOwnerId);
    let gInfo = groupInfoBucket.get<number, [GroupInfo]>(parseInt(groupId))[0];
    if (parseInt(uid) !== gInfo.ownerid) {
        logger.debug("User: ", uid, "is not the owner of group: ", gInfo.gid);
        res.r = 0; // not the group owner
        return res;
    }

    gInfo.ownerid = parseInt(newOwnerId);
    groupInfoBucket.put(gInfo.gid, gInfo);
    res.r = 1;

    return res;
}

/**
 * 添加管理员
 * @param guid
 */
//#[rpc=rpcServer]
export const addAdmin = (guid: string): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    let groupId = guid.split(":")[0];
    let addAdminId = guid.split(":")[1];
    let res = new Result();

    let gInfo = groupInfoBucket.get<number, [GroupInfo]>(parseInt(groupId))[0];
    if (gInfo.adminids.indexOf(parseInt(addAdminId)) > -1) {
        res.r = 0;
        logger.debug("User: ", addAdminId, "is already an admin");

        return res;
    }
    logger.debug("user logged in with uid: ", uid, "and you want to add an admin: ", addAdminId);
    gInfo.adminids.push(parseInt(addAdminId));
    groupInfoBucket.put(gInfo.gid, gInfo);
    logger.debug("After add admin: ", gInfo);
    res.r = 1;

    return res;
}

/**
 * 删除管理员
 * @param guid
 */
//#[rpc=rpcServer]
export const delAdmin = (guid: string): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    let groupId = guid.split(":")[0];
    let delAdminId = guid.split(":")[1];
    let res = new Result();

    logger.debug("user logged in with uid: ", uid, "and you want to delete an admin: ", delAdminId);
    let gInfo = groupInfoBucket.get<number, [GroupInfo]>(parseInt(groupId))[0];
    logger.debug("read group info: ", gInfo);
    let members = gInfo.adminids;

    logger.debug("before delete admin memebers: ", gInfo.adminids);
    let index = members.indexOf(parseInt(delAdminId));
    if (index > -1) {
        members.splice(index, 1);
    }

    gInfo.adminids = members;
    groupInfoBucket.put(gInfo.gid, gInfo);
    logger.debug("after delete admin memmber: ", groupInfoBucket.get(gInfo.gid));

    res.r = 1;

    return res;
}

/**
 * 剔除用户
 * @param guid
 */
//#[rpc=rpcServer]
export const delMember = (guid: string): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    let groupId = guid.split(":")[0];
    let delId = guid.split(":")[1];
    let res = new Result();

    logger.debug("user logged in with uid: ", uid, "and you want to delete a member: ", delId);
    let gInfo = groupInfoBucket.get<number, [GroupInfo]>(parseInt(groupId));
    logger.debug("read group info: ", gInfo[0]);
    let members = gInfo[0].memberids;

    logger.debug("before delete memeber: ", gInfo[0].memberids);
    let index = members.indexOf(parseInt(delId));
    if (index > -1) {
        members.splice(index, 1);
    }

    gInfo[0].memberids = members;
    groupInfoBucket.put(gInfo[0].gid, gInfo[0]);
    logger.debug("after delete memmber: ", groupInfoBucket.get(gInfo[0].gid)[0]);

    res.r = 1;

    return res;
}

/**
 * 创建群
 * @param uid
 */
//#[rpc=rpcServer]
export const createGroup = (groupInfo: GroupCreate): GroupInfo => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    if (uid !== undefined) {
        let gInfo = new GroupInfo();
        gInfo.note = groupInfo.note;
        gInfo.adminids = [];
        gInfo.annoceid = "0:0";
        gInfo.create_time = Date.now();
        gInfo.dissolve_time = 0;
        gInfo.gid = 11111; // TODO: ways to generate group id
        gInfo.join_method = 0;
        gInfo.ownerid = parseInt(uid);
        // TODO: add self to memberids
        gInfo.memberids = [parseInt(uid)]; // add self to member
        gInfo.state = 0;

        logger.debug("create group: ", gInfo);

        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug("read group info: ", groupInfoBucket.get(gInfo.gid));

        let contactBucket = getContactBucket();
        let contact = contactBucket.get<number, [Contact]>(parseInt(uid))[0];
        contact.group.push(gInfo.gid);
        contactBucket.put(parseInt(uid), contact);
        logger.debug("Add self: ", uid, "to conatact group");

        let mqttServer = getEnv().getNativeObject<ServerNode>("mqttServer");
        setMqttTopic(mqttServer, gInfo.gid.toString(), true, true);

        return gInfo;
    }

    // TODO: what if user doesn't login
}

/**
 * 解散群
 * @param guid
 */
//#[rpc=rpcServer]
export const dissolveGroup = (gid: number): Result => {
    const groupInfoBucket = getGroupInfoBucket();
    const uid = getUid();

    let res = new Result();

    let gInfo = groupInfoBucket.get<number, [GroupInfo]>(gid);

    if (parseInt(uid) === gInfo[0].ownerid) {
        gInfo[0].state = 1;
        groupInfoBucket.put(gid, gInfo[0]);
        logger.debug("After group dissovled: ", groupInfoBucket.get(gid)[0]);

        res.r = 1;

        return res;
    }

    // TODO: delete group topic
}

// ============ helpers =================

const getGroupInfoBucket = () => {
    const dbMgr = getEnv().getDbMgr();
    const groupInfoBucket = new Bucket("file", CONSTANT.GROUP_INFO_TABLE, dbMgr);

    return groupInfoBucket
}

const getContactBucket = () => {
    const dbMgr = getEnv().getDbMgr();
    const contactBucket = new Bucket("file", CONSTANT.CONTACT_TABLE, dbMgr);

    return contactBucket;
}

const getUid = () => {
    const dbMgr = getEnv().getDbMgr();
    let session = getEnv().getSession();
    let uid;
    read(dbMgr, (tr: Tr) => {
        uid = session.get(tr, "uid");
    });

    return uid;
}