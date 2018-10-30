/**
 * 聊天操作
 */
// ================================================================= 导入
import { Result } from "./basic.s";
import { AnnounceHistory, UserHistory, GroupHistory, UserMsg, MsgLock, Announcement, GroupMsg } from "../db/message.s";
import { AnnounceSend, GroupSend, UserSend } from "./message.s";

import { mqttPublish, QoS } from "../../../pi_pt/rust/pi_serv/js_net";
import { ServerNode } from "../../../pi_pt/rust/mqtt/server";
import { BonBuffer } from "../../../pi/util/bon";
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Bucket } from "../../../utils/db";
import * as CONSTANT from '../constant';

import {Tr} from "../../../pi_pt/rust/pi_db/mgr";
import { write, read } from "../../../pi_pt/db";
import { GroupInfo } from "../db/group.s";
import { Logger } from "../../../utils/logger";

const logger = new Logger("MESSAGE");


// ================================================================= 导出
/**
 * 发布公告
 * @param announce
 */
//#[rpc=rpcServer]
export const sendAnnouncement = (announce: AnnounceSend): AnnounceHistory => {
    const dbMgr = getEnv().getDbMgr();
    const bkt = new Bucket("file", CONSTANT.ANNOUNCE_HISTORY_TABLE, dbMgr);
    let uid = getUid();
    let groupInfoBucket = getGroupInfoBucket();

    let anmt = new Announcement();
    anmt.cancel = false;
    anmt.msg = announce.msg;
    anmt.mtype = announce.mtype;
    anmt.send = true;
    anmt.time = Date.now();
    anmt.sid = parseInt(uid);

    let ah = new AnnounceHistory();
    ah.aIncId = announce.gid + ":" + "1"; // TODO: ways to generate aIncId
    ah.announce = anmt;

    bkt.put(ah.aIncId, ah);
    logger.debug("Send annoucement: ", anmt, "to group: ", announce.gid);

    let gInfo = groupInfoBucket.get<number, [GroupInfo]>(announce.gid)[0];
    gInfo.annoceid = ah.aIncId;

    return ah;
}

/**
 * 撤销公告
 * @param aIncId
 */
//#[rpc=rpcServer]
export const cancelAnnouncement = (aIncId: string): Result => {
    const dbMgr = getEnv().getDbMgr();
    const bkt = new Bucket("file", CONSTANT.ANNOUNCE_HISTORY_TABLE, dbMgr);

    let v = bkt.get<string, AnnounceHistory>(aIncId);
    if (v[0] !== undefined) {
        v.announce.cancel = true;
    }

    bkt.put(aIncId, v[0]);

    let res = new Result();
    res.r = 1;

    return res;
}

/**
 * 发送群组消息
 * @param message
 */
//#[rpc=rpcServer]
export const sendGroupMessage = (message: GroupSend): GroupHistory => {
    const dbMgr = getEnv().getDbMgr();
    const bkt = new Bucket("file", CONSTANT.GROUP_HISTORY_TABLE, dbMgr);
    const groupInfoBucket = new Bucket("file", CONSTANT.GROUP_INFO_TABLE, dbMgr);

    let session = getEnv().getSession();
    let uid;
    read(dbMgr, (tr: Tr) => {
        uid = session.get(tr, "uid");
    });

    //TODO: what if uid is undefined

    let gh = new GroupHistory();
    let gmsg = new GroupMsg();
    gmsg.msg = message.msg;
    gmsg.mtype = message.mtype;
    gmsg.send = true;
    gmsg.sid = parseInt(uid);
    gmsg.time = message.time;
    gmsg.cancel = false;

    gh.hIncid = message.gid + ":" + "1"; // TODO: generate msg id
    gh.msg = gmsg;

    bkt.put(gh.hIncid, gh);

    let buf = new BonBuffer();
    gmsg.bonEncode(buf);

    let mqttServer = getEnv().getNativeObject<ServerNode>("mqttServer");

    // TODO: how to handle members that doesn't online ?
    let members = groupInfoBucket.get<number, [GroupInfo]>(message.gid)[0].memberids;
    for (let i = 0; i < members.length; i++) {
        logger.debug("Group message sent from:", uid.toString(), "to:", members[i].toString());
        mqttPublish(mqttServer, true, QoS.AtMostOnce, members[i].toString(), buf.getBuffer());
    }

    return gh;
}

/**
 * 撤销群组消息
 * @param hIncId
 */
//#[rpc=rpcServer]
export const cancelGroupMessage = (hIncId: string): Result => {
    const dbMgr = getEnv().getDbMgr();
    const bkt = new Bucket("file", CONSTANT.GROUP_HISTORY_TABLE, dbMgr);

    let v = bkt.get<string, GroupHistory>(hIncId);
    if (v !== undefined) {
        v.msg.cancel = true;
    }

    bkt.put(hIncId, v[0]);

    let res = new Result();
    res.r = 1;

    return res;
}

/**
 * 发送单聊消息
 * @param message
 */
//#[rpc=rpcServer]
export const sendUserMessage = (message: UserSend): UserHistory => {
    const dbMgr = getEnv().getDbMgr();
    const userHistoryBucket = new Bucket("file", CONSTANT.USER_HISTORY_TABLE, dbMgr);
    const msgLockBucket = new Bucket("file", CONSTANT.MSG_LOCK_TABLE, dbMgr);

    let sid;
    let session = getEnv().getSession();
    read(dbMgr, (tr: Tr) => {
        sid = session.get(tr, "uid");
        if (sid === undefined) {
            sid = -1;
        }
        console.log('read uid for this session: ', sid);
    });

    let userHistory = new UserHistory();

    // TODO: ways to generate hid?
    let hid = 10001;
    let curId = 0;
    let mLock = msgLockBucket.get(hid);
    logger.debug("msgLock:", mLock);
    if (mLock[0] === undefined) {
        let msgLock = new MsgLock();
        msgLock.hid = hid
        msgLock.current = 0;
        msgLockBucket.put(hid, msgLock);
    } else {
        let msgLock = new MsgLock();
        msgLock.hid = hid;
        msgLock.current = mLock[0].current + 1;
        curId =  msgLock.current;
        msgLockBucket.put(hid, msgLock);
    }

    let userMsg = new UserMsg();
    userMsg.cancel = false;
    userMsg.msg = message.msg;
    userMsg.mtype = 0;
    userMsg.read = true;
    userMsg.send = true;
    userMsg.sid = sid;
    userMsg.time = Date.now();

    userHistory.hIncid = hid.toString() + ":" + curId;
    userHistory.msg = userMsg;

    userHistoryBucket.put(userHistory.hIncid, userHistory);

    let buf = new BonBuffer();
    userMsg.bonEncode(buf);

    let mqttServer = getEnv().getNativeObject<ServerNode>("mqttServer");
    mqttPublish(mqttServer, true, QoS.AtMostOnce, message.rid.toString(), buf.getBuffer());
    logger.debug("User message sent from: ", sid.toString(), "to: ", message.rid.toString());

    return userHistory;
}

/**
 * 撤销群组消息
 * @param hIncId
 */
//#[rpc=rpcServer]
export const cancelUserMessage = (hIncId: string): Result => {
    const dbMgr = getEnv().getDbMgr();
    const bkt = new Bucket("file", CONSTANT.USER_HISTORY_TABLE, dbMgr);

    let v = bkt.get<string, UserHistory>(hIncId);
    if (v[0] !== undefined) {
        v.msg.cancel = true;
    }

    bkt.put(hIncId, v[0]);

    let res = new Result();
    res.r = 1;

    return res;
}

// ----------------- helpers ------------------
const getUid = () => {
    const dbMgr = getEnv().getDbMgr();
    let session = getEnv().getSession();
    let uid;
    read(dbMgr, (tr: Tr) => {
        uid = session.get(tr, "uid");
    });

    return uid;
}

const getGroupInfoBucket = () => {
    const dbMgr = getEnv().getDbMgr();
    const groupInfoBucket = new Bucket("file", CONSTANT.GROUP_INFO_TABLE, dbMgr);

    return groupInfoBucket;
}