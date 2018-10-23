/**
 * 聊天操作
 */
// ================================================================= 导入
import { Result } from "./basic.s";
import { AnnounceHistory, UserHistory, GroupHistory, HIncId, AIncId, UserMsg, MsgLock } from "../db/message.s";
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

    return
}

/**
 * 撤销公告
 * @param aIncId
 */
//#[rpc=rpcServer]
export const cancelAnnouncement = (aIncId: HIncId): Result => {

    return
}

/**
 * 发送群组消息
 * @param message
 */
//#[rpc=rpcServer]
export const sendGroupMessage = (message: GroupSend): GroupHistory => {

    return
}

/**
 * 撤销群组消息
 * @param hIncId
 */
//#[rpc=rpcServer]
export const cancelGroupMessage = (hIncId: HIncId): Result => {

    return
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
    let hId = new HIncId();

    // TODO: ways to generate hid?
    hId.hid = 100;

    let currentId = msgLockBucket.get(hId.hid);
    if (currentId[0] === undefined) {
        let msgLock = new MsgLock();
        msgLock.hid = hId.hid;
        msgLock.current = 0;
        hId.index = 0;
        msgLockBucket.put(hId.hid, msgLock);
    } else {
        hId.index = currentId[0].current + 1;
        let msgLock = new MsgLock();
        msgLock.hid = hId.hid;
        msgLock.current = hId.index;
        msgLockBucket.put(hId.hid, msgLock);
    }

    let userMsg = new UserMsg();
    userMsg.cancel = false;
    userMsg.msg = message.msg;
    userMsg.mtype = 0;
    userMsg.read = true;
    userMsg.send = true;
    userMsg.sid = 1;
    userMsg.time = Date.now();

    userHistory.hIncid = hId;
    userHistory.msg = userMsg;

    userHistoryBucket.put(hId, userHistory);

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
export const cancelUserMessage = (hIncId: HIncId): Result => {

    return
}