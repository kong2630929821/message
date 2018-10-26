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



// ================================================================= 导出
/**
 * 发布公告
 * @param announce
 */
//#[rpc=rpcServer]
export const sendAnnouncement = (announce: AnnounceSend): AnnounceHistory => {
    const dbMgr = getEnv().getDbMgr();
    const bkt = new Bucket("file", "server/data/db/message.AnnounceHistory", dbMgr);

    let anmt = new Announcement();
    anmt.cancel = false;
    anmt.msg = announce.msg;
    anmt.mtype = 1;
    anmt.send = true;
    anmt.time = Date.now();
    anmt.sid = 0; // announce里面哪里知道发送者id是哪个？？？

    let ah = new AnnounceHistory();
    ah.aIncId = announce.gid + ":" + "1";
    ah.announce = anmt;

    bkt.put(ah.aIncId, ah);

    // TODO: publish message

    return ah;
}

/**
 * 撤销公告
 * @param aIncId
 */
//#[rpc=rpcServer]
export const cancelAnnouncement = (aIncId: string): Result => {
    const dbMgr = getEnv().getDbMgr();
    const bkt = new Bucket("file", "server/data/db/message.AnnounceHistory", dbMgr);

    let v = bkt.get<string, AnnounceHistory>(aIncId);
    if (v !== undefined) {
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
    const bkt = new Bucket("file", "server/data/db/message.GroupHistory", dbMgr);

    let gh = new GroupHistory();
    let gmsg = new GroupMsg();
    gmsg.msg = message.msg;
    gmsg.mtype = 0;
    gmsg.send = true;
    gmsg.sid = 0; // ??????
    gmsg.time = Date.now();
    gmsg.cancel = false;

    gh.hIncid = message.gid + ":" + "1"; // ?????
    gh.msg = gmsg;

    bkt.put(gh.hIncid, gh);

    // TODO: publish message

    return gh;
}

/**
 * 撤销群组消息
 * @param hIncId
 */
//#[rpc=rpcServer]
export const cancelGroupMessage = (hIncId: string): Result => {
    const dbMgr = getEnv().getDbMgr();
    const bkt = new Bucket("file", "server/data/db/message.GroupHistory", dbMgr);

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
    const userHistoryBucket = new Bucket("file", "server/data/db/message.UserHistory", dbMgr);
    const msgLockBucket = new Bucket("file", "server/data/db/message.MsgLock", dbMgr);

    let userHistory = new UserHistory();

    // TODO: ways to generate hid?
    let hid = 10001;
    let curId = 0;
    let mLock = msgLockBucket.get(hid);
    console.log('msgLock:', mLock);
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
    userMsg.sid = 1;
    userMsg.time = Date.now();

    userHistory.hIncid = hid.toString() + ":" + curId;
    userHistory.msg = userMsg;

    userHistoryBucket.put(userHistory.hIncid, userHistory);

    let buf = new BonBuffer();
    message.bonEncode(buf);

    let mqttServer = getEnv().getNativeObject<ServerNode>("mqttServer");
    mqttPublish(mqttServer, true, QoS.AtMostOnce, message.rid.toString(), buf.getBuffer());

    return userHistory;
}

/**
 * 撤销群组消息
 * @param hIncId
 */
//#[rpc=rpcServer]
export const cancelUserMessage = (hIncId: string): Result => {
    const dbMgr = getEnv().getDbMgr();
    const bkt = new Bucket("file", "server/data/db/message.UserHistory", dbMgr);

    let v = bkt.get<string, UserHistory>(hIncId);
    if (v !== undefined) {
        v.msg.cancel = true;
    }

    bkt.put(hIncId, v[0]);

    let res = new Result();
    res.r = 1;

    return res;
}