/**
 * 聊天操作
 */
// ================================================================= 导入
import { AnnounceHistory, Announcement, GroupHistory, GroupMsg, MsgLock, UserHistory, UserHistoryCursor, UserMsg } from '../db/message.s';
import { Result } from './basic.s';
import { AnnounceSend, GroupSend, UserSend } from './message.s';

import { BonBuffer } from '../../../pi/util/bon';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { ServerNode } from '../../../pi_pt/rust/mqtt/server';
import { mqttPublish, QoS } from '../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../../utils/db';
import * as CONSTANT from '../constant';

import { read } from '../../../pi_pt/db';
import { Tr } from '../../../pi_pt/rust/pi_db/mgr';
import { Logger } from '../../../utils/logger';
import { LastReadMessageId, OnlineUsers } from '../db/user.s';

import { genGroupHid, genHIncId, genNextMessageIndex, genUserHid, genUuid } from '../../../utils/util';
import { getUid } from './group.r';

const logger = new Logger('MESSAGE');

/**
 * 用户确认读取了的最新消息id
 * @param uid user id
 */
// #[rpc=rpcServer]
export const messageReadAck = (cursor: LastReadMessageId): Result => {
    const dbMgr = getEnv().getDbMgr();
    const lastReadMessageidBucket = new Bucket('file', CONSTANT.LAST_READ_MESSAGE_ID_TABLE, dbMgr);
    const sessionUid = getUid();
    const uid = cursor.mtype.split(':')[1];
    const res = new Result();
    if (sessionUid === undefined) {
        logger.debug('User didn\'t login, can\'t send message read ack');
        res.r = 0;

        return res;
    }

    if (sessionUid !== parseInt(uid,10)) {
        logger.debug('inappropriate uid');
        res.r = 0;

        return res;
    }

    const lrmi = new LastReadMessageId();
    lrmi.mtype = cursor.mtype;
    lrmi.msgId = cursor.msgId;

    lastReadMessageidBucket.put(uid, lrmi);
    logger.debug('User: ', uid, 'confirm receive message id: ', lrmi.msgId);
    res.r = 1;

    return res;
};

/**
 * 用户获取消息游标
 * @param cursor "10001:0" -> 用户 10001个人对个人消息， "10001:1" -> 用户10001群消息
 */
// #[rpc=rpcServer]
// export const getLastReadMessageId = (cursor: string): LastReadMessageId => {
//     const dbMgr = getEnv().getDbMgr();
//     const uid = getUid();
//     const lastReadMessageidBucket = new Bucket('file', CONSTANT.LAST_READ_MESSAGE_ID_TABLE, dbMgr);
//     const msgId = lastReadMessageidBucket.get(cursor)[0];
//     const res = new LastReadMessageId();

//     if (msgId === undefined) {
//         logger.error('User: ', uid, 'Can\'t get msgId for message type: ', cursor);
//         res.mtype = '';
//         res.msgId = '';

//         return res;
//     }

//     res.mtype = cursor;
//     res.msgId = msgId;
//     logger.debug('User: ', uid, 'get message id: ', msgId);

//     return res;
// };

// ================================================================= 导出
/**
 * 发布公告
 * @param announce AnnounceSend
 */
// #[rpc=rpcServer]
export const sendAnnouncement = (announce: AnnounceSend): AnnounceHistory => {
    const dbMgr = getEnv().getDbMgr();
    const bkt = new Bucket('file', CONSTANT.ANNOUNCE_HISTORY_TABLE, dbMgr);

    const anmt = new Announcement();
    anmt.cancel = false;
    anmt.msg = announce.msg;
    anmt.mtype = announce.mtype;
    anmt.send = true;
    anmt.time = Date.now();
    anmt.sid = getUid();

    const announId = new AnounceMsgId(announce.gid, dbMgr);
    const ah = new AnnounceHistory();
    ah.aIncId = `${announce.gid}:${announId.nextId()}`;
    ah.announce = anmt;

    bkt.put(ah.aIncId, ah);
    logger.debug('Send annoucement: ', anmt, 'to group: ', announce.gid);

    const buf = new BonBuffer();
    announce.bonEncode(buf);
    const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
    const groupAnnounceTopic = `img/group/anounnce/${announce.gid}`;

    mqttPublish(mqttServer, true, QoS.AtMostOnce, groupAnnounceTopic, buf.getBuffer());
    logger.debug('Send group announcement: ', announce.msg, 'to group topic: ', groupAnnounceTopic);

    return ah;
};

/**
 * 撤销公告
 * @param aIncId announce increament id
 */
// #[rpc=rpcServer]
export const cancelAnnouncement = (aIncId: string): Result => {
    const dbMgr = getEnv().getDbMgr();
    const bkt = new Bucket('file', CONSTANT.ANNOUNCE_HISTORY_TABLE, dbMgr);

    const v = bkt.get<string, AnnounceHistory>(aIncId);
    if (v[0] !== undefined) {
        v.announce.cancel = true;
    }

    bkt.put(aIncId, v[0]);

    const res = new Result();
    res.r = 1;

    return res;
};

/**
 * 发送群组消息
 * @param message group send
 */
// #[rpc=rpcServer]
export const sendGroupMessage = (message: GroupSend): GroupHistory => {
    const dbMgr = getEnv().getDbMgr();
    const bkt = new Bucket('file', CONSTANT.GROUP_HISTORY_TABLE, dbMgr);
    const msgLockBucket = new Bucket('file', CONSTANT.MSG_LOCK_TABLE, dbMgr);
    const gInfoBucket = new Bucket('file', CONSTANT.GROUP_INFO_TABLE, dbMgr);
    const gInfo = gInfoBucket.get(message.gid)[0];        

    const gh = new GroupHistory();
    const gmsg = new GroupMsg();
    gmsg.msg = message.msg;
    gmsg.mtype = message.mtype;
    gmsg.send = true;
    gmsg.sid = getUid();
    gmsg.time = message.time;
    gmsg.cancel = false;    
    gh.msg = gmsg;
    // 判断是否是群组成员
    logger.debug(`sid is : ${gmsg.sid}`);
    if (gInfo.memberids.findIndex(id => id === gmsg.sid) === -1) {
        gh.hIncId = CONSTANT.DEFAULT_ERROR_STR;

        return gh;
    }

    const msgLock = new MsgLock();
    msgLock.hid = genGroupHid(message.gid);
    logger.debug(`before read and write`);
    // 这是一个事务
    msgLockBucket.readAndWrite(msgLock.hid,(mLock) => {
        mLock[0] === undefined ? (msgLock.current = 0) : (msgLock.current = genNextMessageIndex(mLock[0].current));

        return msgLock;
    });    
    logger.debug(`after read and write`);
    gh.hIncId = genHIncId(msgLock.hid, msgLock.current);    

    bkt.put(gh.hIncId, gh);

    const buf = new BonBuffer();
    gh.bonEncode(buf);

    const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
    const groupTopic = `ims/group/msg/${ message.gid}`;
    logger.debug(`before publish ,the topic is : ${groupTopic}`);
    // directly send message to group topic
    mqttPublish(mqttServer, true, QoS.AtMostOnce, groupTopic, buf.getBuffer());
    logger.debug('Send group message: ', message.msg, 'to group topic: ', groupTopic);

    return gh;
};

/**
 * 撤销群组消息
 * @param hIncId history increament id
 */
// #[rpc=rpcServer]
export const cancelGroupMessage = (hIncId: string): Result => {
    const dbMgr = getEnv().getDbMgr();
    const bkt = new Bucket('file', CONSTANT.GROUP_HISTORY_TABLE, dbMgr);

    const v = bkt.get<string, GroupHistory>(hIncId);
    if (v !== undefined) {
        v.msg.cancel = true;
    }

    bkt.put(hIncId, v[0]);

    const res = new Result();
    res.r = 1;

    return res;
};

/**
 * 发送单聊消息
 * @param message user send
 */
// #[rpc=rpcServer]
export const sendUserMessage = (message: UserSend): UserHistory => {
    const dbMgr = getEnv().getDbMgr();
    const userHistoryBucket = new Bucket('file', CONSTANT.USER_HISTORY_TABLE, dbMgr);
    const msgLockBucket = new Bucket('file', CONSTANT.MSG_LOCK_TABLE, dbMgr);

    let sid;
    const session = getEnv().getSession();
    read(dbMgr, (tr: Tr) => {
        sid = session.get(tr, 'uid');
        if (sid === undefined) {
            sid = -1;
        }
        console.log('read uid for this session: ', sid);
    });
    const userHistory = new UserHistory();
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
    // 获取对方联系人列表
    const sContactInfo = contactBucket.get(message.rid)[0];
    // 判断当前用户是否在对方的好友列表中
    
    const userMsg = new UserMsg();
    userMsg.cancel = false;
    userMsg.msg = message.msg;
    userMsg.mtype = 0;
    userMsg.read = false;
    userMsg.send = false;
    userMsg.sid = sid;
    userMsg.time = Date.now();
    userHistory.msg = userMsg;
    // logger.debug(`friends is : ${JSON.stringify(sContactInfo.friends)}, sid is : ${sid}`);
    if (sContactInfo.friends.findIndex(item => item === parseInt(sid,10)) === -1) {
        userHistory.hIncId =  CONSTANT.DEFAULT_ERROR_STR;

        return userHistory;
    }
    
    sid = parseInt(sid,10);    
    const msgLock = new MsgLock();
    msgLock.hid = genUserHid(sid, message.rid);
    // 这是一个事务
    logger.debug('before readAndWrite');
    msgLockBucket.readAndWrite(msgLock.hid,(mLock) => {
        mLock[0] === undefined ? (msgLock.current = 0) : (msgLock.current = genNextMessageIndex(mLock[0].current));
        logger.debug('readAndWrite...');

        return msgLock;
    });
    logger.debug('after readAndWrite');
    userHistory.hIncId =  genHIncId(msgLock.hid, msgLock.current);
    
    userHistoryBucket.put(userHistory.hIncId, userHistory);
    logger.debug('Persist user history message to DB: ', userHistory);

    const buf = new BonBuffer();
    userHistory.bonEncode(buf);

    const userHistoryCursorBucket = new Bucket('file',CONSTANT.USER_HISTORY_CURSOR_TABLE,dbMgr);
    let sidHistoryCursor = userHistoryCursorBucket.get(genUuid(sid,message.rid))[0];
    let ridHistoryCursor = userHistoryCursorBucket.get(genUuid(message.rid,sid))[0];
    
    // 游标表中是否有该用户的记录
    if (sidHistoryCursor) { 
        sidHistoryCursor.cursor = msgLock.current; // 发送者的游标一定在变化
    } else {
        sidHistoryCursor = new UserHistoryCursor();
        sidHistoryCursor.uuid = genUuid(sid,message.rid);
        sidHistoryCursor.cursor = msgLock.current;
    }
    
    logger.debug('sendUserMessage sidHistoryCursor: ', sidHistoryCursor);
    userHistoryCursorBucket.put(genUuid(sid,message.rid),sidHistoryCursor);

    // 游标表中是否有该用户的记录
    if (!ridHistoryCursor) {
        ridHistoryCursor = new UserHistoryCursor();
        ridHistoryCursor.uuid = genUuid(message.rid,sid);
        ridHistoryCursor.cursor = 0;
    }
    // 对方是否在线，不在线则不推送消息
    const res = isUserOnline(message.rid);
    if (res.r === 1) {
        const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
        mqttPublish(mqttServer, true, QoS.AtMostOnce, message.rid.toString(), buf.getBuffer());
        logger.debug(`from ${sid} to ${message.rid}, message is : ${JSON.stringify(userHistory)}`);
        
        ridHistoryCursor.cursor = msgLock.current;
    } 

    userHistoryCursorBucket.put(genUuid(message.rid,sid),ridHistoryCursor); // 接收者在线则游标会变化，否则不变化
    logger.debug('sendUserMessage ridHistoryCursor: ', ridHistoryCursor);

    return userHistory;
};

/**
 * 撤销群组消息
 * @param hIncId history Increament Id
 */
// #[rpc=rpcServer]
export const cancelUserMessage = (hIncId: string): Result => {
    const dbMgr = getEnv().getDbMgr();
    const bkt = new Bucket('file', CONSTANT.USER_HISTORY_TABLE, dbMgr);

    const v = bkt.get<string, UserHistory>(hIncId);
    if (v[0] !== undefined) {
        v.msg.cancel = true;
    }

    bkt.put(hIncId, v[0]);

    const res = new Result();
    res.r = 1;

    return res;
};

/**
 * 判断用户是否在线
 * @param uid 用户ID
 */
// #[rpc=rpcServer]
export const isUserOnline = (uid: number): Result => {
    const dbMgr = getEnv().getDbMgr();

    const res = new Result();
    const bucket = new Bucket('memory', CONSTANT.ONLINE_USERS_TABLE, dbMgr);
    const onlineUser = bucket.get<number, [OnlineUsers]>(uid)[0];
    if (onlineUser !== undefined && onlineUser.sessionId !== -1) {
        logger.debug('User: ', uid, 'on line');
        res.r = 1; // on line;

        return res;
    } else {
        logger.debug('User: ', uid, 'off line');
        res.r = 0; // off online

        return res;
    }
};

// ----------------- helpers ------------------