/**
 * 群组相关的rpc操作
 */
// ================================================================= 导入
import { GroupInfo } from "../db/group.s";
import { Result } from "./basic.s";
import { GroupCreate, GroupAgree, InviteArray } from "./group.s";

import { GroupHistory, GroupMsg } from "../db/message.s";
import { Bucket } from "../../../utils/db";
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { ServerNode } from '../../../pi_pt/rust/mqtt/server';
import { setMqttTopic, mqttPublish, QoS } from "../../../pi_pt/rust/pi_serv/js_net";
import * as CONSTANT from '../constant';
import { Tr } from "../../../pi_pt/rust/pi_db/mgr";
import { write, read } from "../../../pi_pt/db";
import { Logger } from '../../../utils/logger';

const logger = new Logger('GROUP');

// ================================================================= 导出

/**
 * 用户主动申请加入群组
 * @param guid
 */
//#[rpc=rpcServer]
export const applyJoinGroup = (gid: number): Result => {

    return
}

/**
 * 管理员接受/拒绝用户的加群申请
 * @param agree
 */
//#[rpc=rpcServer]
export const acceptUser = (agree: GroupAgree): Result => {

    return
}

/**
 * 群成员邀请其他用户加入群
 * @param invite
 */
//#[rpc=rpcServer]
export const inviteUsers = (invites: InviteArray): Result => {

    return
}

/**
 * 用户同意加入群组
 * @param agree
 */
//#[rpc=rpcServer]
export const agreeJoinGroup = (agree: GroupAgree): GroupInfo => {

    return
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
    logger.debug("read group info: ", gInfo);

    gInfo.ownerid = parseInt(newOwnerId);
    groupInfoBucket.put(gInfo[0].gid, gInfo);
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

    logger.debug("user logged in with uid: ", uid, "and you want to add an admin: ", addAdminId);
    let gInfo = groupInfoBucket.get<number, [GroupInfo]>(parseInt(groupId))[0];
    logger.debug("read group info: ", gInfo);

    gInfo[0].adminids.push(parseInt(addAdminId));
    groupInfoBucket.put(gInfo.gid, gInfo);
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
    let members = gInfo[0].adminids;

    logger.debug("before delete admin memebers: ", gInfo[0].adminids);
    let index = members.indexOf(parseInt(delAdminId));
    if (index > -1) {
        members.splice(index, 1);
    }

    gInfo[0].adminids = members;
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
        gInfo.annoceid = 1;
        gInfo.create_time = Date.now();
        gInfo.dissolve_time = 0;
        gInfo.gid = 11111; // TODO: ways to generate group id
        gInfo.join_method = 0;
        gInfo.ownerid = parseInt(uid);
        gInfo.memberids = [10001, 10002, 10003];
        gInfo.state = 0;

        logger.debug("create group: ", gInfo);

        groupInfoBucket.put(gInfo.gid, gInfo);
        logger.debug("read group info: ", groupInfoBucket.get(gInfo.gid));

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

const getUid = () => {
    const dbMgr = getEnv().getDbMgr();
    let session = getEnv().getSession();
    let uid;
    read(dbMgr, (tr: Tr) => {
        uid = session.get(tr, "uid");
    });

    return uid;
}