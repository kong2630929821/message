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

    return
}

/**
 * 添加管理员
 * @param guid
 */
//#[rpc=rpcServer]
export const addAdmin = (guid: string): Result => {

    return
}

/**
 * 删除管理员
 * @param guid
 */
//#[rpc=rpcServer]
export const delAdmin = (guid: string): Result => {

    return
}

/**
 * 剔除用户
 * @param guid
 */
//#[rpc=rpcServer]
export const delMember = (guid: string): Result => {
    const dbMgr = getEnv().getDbMgr();
    const groupInfoBucket = new Bucket("file", CONSTANT.GROUP_INFO_TABLE, dbMgr);

    let delId = guid.split(":")[1];
    let res = new Result();
    let uid;
    let session = getEnv().getSession();
    read(dbMgr, (tr: Tr) => {
        uid = session.get(tr, "uid");
    });
    let gInfo = groupInfoBucket.get<number, GroupInfo>(parseInt(uid));
    let members = gInfo.memberids;
    let admins = gInfo.adminids;

    let isAddmin = false;
    for (let i = 0; i < admins.length; i++) {
        if (admins[i] === uid)
            isAddmin = true;
    }

    // WIP

    let isOwner = gInfo.ownerid === uid;

    if (!isAddmin && !isOwner) {
        logger.error("Don't have right to del user");
        res.r = 0;
        return res;
    }

    return
}

/**
 * 创建群
 * @param uid
 */
//#[rpc=rpcServer]
export const createGroup = (groupInfo: GroupCreate): GroupInfo => {
    const dbMgr = getEnv().getDbMgr();
    const groupInfoBucket = new Bucket("file", CONSTANT.GROUP_INFO_TABLE, dbMgr);

    let gInfo = new GroupInfo();
    gInfo.note = groupInfo.note;
    gInfo.adminids = [1, 2, 3];
    gInfo.annoceid = 1;
    gInfo.create_time = Date.now();
    gInfo.dissolve_time = 0;
    gInfo.gid = 11000;
    gInfo.join_method = 0;
    gInfo.memberids = [4, 5, 6];

    groupInfoBucket.put(gInfo.gid, gInfo);

    return gInfo;
}

/**
 * 解散群
 * @param guid
 */
//#[rpc=rpcServer]
export const dissolveGroup = (gid: number): Result => {

    return
}

