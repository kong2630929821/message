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
import { LastReadMessageId } from "../db/user.s"
import { Logger } from "../../../utils/logger";

import { GroupMsgId, P2PMsgId, AnounceMsgId } from "../db/msgid";

const logger = new Logger("MESSAGE");

/**
 * 用户确认读取了的最新消息id
 * @param uid
 */
//#[rpc=rpcServer]
export const messageReadAck = (cursor: LastReadMessageId): Result => {
    const dbMgr = getEnv().getDbMgr();
    const lastReadMessageidBucket = new Bucket("file", CONSTANT.LAST_READ_MESSAGE_ID_TABLE, dbMgr);
    let sessionUid = getUid();
    let uid = cursor.mtype.split(":")[1];
    let res = new Result();
    if (sessionUid === undefined) {
        logger.debug("User didn't login, can't send message read ack");
        res.r = 0;
        return res;
    }

    if (sessionUid !== uid) {
        logger.debug("inappropriate uid");
        res.r = 0;
        return res;
    }

    let lrmi = new LastReadMessageId();
    lrmi.mtype = cursor.mtype;
    lrmi.msgId = cursor.msgId;

    lastReadMessageidBucket.put(uid, lrmi);
    logger.debug("User: ", uid, "confirm receive message id: ", lrmi.msgId);
    res.r = 1;

    return res;
}

/**
 * 用户获取消息游标
 * @param cursor "10001:0" -> 用户 10001个人对个人消息， "10001:1" -> 用户10001群消息
 */
//#[rpc=rpcServer]
export const getLastReadMessageId = (cursor: string): LastReadMessageId => {
    const dbMgr = getEnv().getDbMgr();
    let uid = getUid();
    const lastReadMessageidBucket = new Bucket("file", CONSTANT.LAST_READ_MESSAGE_ID_TABLE, dbMgr);
    let msgId = lastReadMessageidBucket.get(cursor)[0];
    let res = new LastReadMessageId();

    if (msgId === undefined) {
        logger.error("User: ", uid, "Can't get msgId for message type: ", cursor);
        res.mtype = "";
        res.msgId = "";

        return res;
    }

    res.mtype = cursor;
    res.msgId = msgId;
    logger.debug("User: ", uid, "get message id: ", msgId);

    return res;
}


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

    let announId = new AnounceMsgId(announce.gid, dbMgr);
    let ah = new AnnounceHistory();
    ah.aIncId = announce.gid + ":" + announId.nextId();
    ah.announce = anmt;

    bkt.put(ah.aIncId, ah);
    logger.debug("Send annoucement: ", anmt, "to group: ", announce.gid);

    let gInfo = groupInfoBucket.get<number, [GroupInfo]>(announce.gid)[0];
    gInfo.annoceid = ah.aIncId;

    let buf = new BonBuffer();
    announce.bonEncode(buf);
    let mqttServer = getEnv().getNativeObject<ServerNode>("mqttServer");
    let groupAnnounceTopic = "img/group/anounnce/" + announce.gid;

    mqttPublish(mqttServer, true, QoS.AtMostOnce, groupAnnounceTopic, buf.getBuffer());
    logger.debug("Send group announcement: ", announce.msg, "to group topic: ", groupAnnounceTopic);

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

    let groupMsgId = new GroupMsgId(message.gid, dbMgr);

    gh.hIncid = message.gid + ":" + groupMsgId.nextId();
    gh.msg = gmsg;

    bkt.put(gh.hIncid, gh);

    let buf = new BonBuffer();
    gmsg.bonEncode(buf);

    let mqttServer = getEnv().getNativeObject<ServerNode>("mqttServer");
    let groupTopic = "ims/group/msg/" + message.gid;

    // directly send message to group topic
    mqttPublish(mqttServer, true, QoS.AtMostOnce, groupTopic, buf.getBuffer());
    logger.debug("Send group message: ", message.msg, "to group topic: ", groupTopic);

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
    sid = parseInt(sid);
    let hid = message.rid;
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
    logger.debug("Persist user history message to DB: ", userHistory);

    let buf = new BonBuffer();
    // userMsg.bonEncode(buf);
    userHistory.bonEncode(buf);    

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