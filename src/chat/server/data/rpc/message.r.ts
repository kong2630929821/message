/**
 * 聊天操作
 */
// ================================================================= 导入
import { AnnounceHistory, Announcement, GroupHistory, GroupHistoryCursor, GroupMsg, MSG_TYPE, MsgLock, Report, ReportCount, ReportListTab, UserHistory, UserMsg, UserReportKeyTab } from '../db/message.s';
import { Result } from './basic.s';
import { GroupSend, HistoryCursor, ReportArg, SendMsg, TempSend, UserSend } from './message.s';

import { BonBuffer } from '../../../../pi/util/bon';
import { mqttPublish, QoS } from '../../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../../utils/db';
import * as CONSTANT from '../constant';

import { Logger } from '../../../utils/logger';
import { AccountGenerator, Contact, OnlineUsers, UserInfo, VIP_LEVEL } from '../db/user.s';

import { Env } from '../../../../pi/lang/env';
import { genGroupHid, genGuid, genHIncId, genNextMessageIndex, genUserHid, genUuid } from '../../../utils/util';
import { GROUP_STATE, GroupInfo } from '../db/group.s';
import { MessageReply } from '../db/manager.s';
import { NOT_GROUP_OWNNER, NOTIN_SAME_GROUP } from '../errorNum';
import * as http from '../http_client';
import { getUid } from './group.r';
import { getUserPunishing } from './manager.r';
import { sendFirstWelcomeMessage } from './user.r';

declare var env: Env;

const logger = new Logger('MESSAGE');

/**
 * 用户确认读取了的最新消息id
 * @param uid user id
 */
// export const messageReadAck = (cursor: LastReadMessageId): Result => {
//     const dbMgr = getEnv().getDbMgr();
//     const lastReadMessageidBucket = new Bucket('file', CONSTANT.LAST_READ_MESSAGE_ID_TABLE, dbMgr);
//     const sessionUid = getUid();
//     const uid = cursor.mtype.split(':')[1];
//     const res = new Result();
//     if (sessionUid === undefined) {
//         logger.debug('User didn\'t login, can\'t send message read ack');
//         res.r = 0;

//         return res;
//     }

//     if (sessionUid !== parseInt(uid,10)) {
//         logger.debug('inappropriate uid');
//         res.r = 0;

//         return res;
//     }

//     const lrmi = new LastReadMessageId();
//     lrmi.mtype = cursor.mtype;
//     lrmi.msgId = cursor.msgId;

//     lastReadMessageidBucket.put(uid, lrmi);
//     logger.debug('User: ', uid, 'confirm receive message id: ', lrmi.msgId);
//     res.r = 1;

//     return res;
// };

/**
 * 获取单聊消息游标
 */
// #[rpc=rpcServer]
export const getUserHistoryCursor = (uid: number): HistoryCursor => {
    console.log('getuserHistoryCursor uid:', uid);
    const sid = getUid();
    const userHistoryCursorBucket = new Bucket('file', CONSTANT.USER_HISTORY_CURSOR_TABLE);
    const msgLockBucket = new Bucket('file', CONSTANT.MSG_LOCK_TABLE);
    const lastID = msgLockBucket.get(genUserHid(sid, uid))[0];

    const userCursor = userHistoryCursorBucket.get(genUuid(sid, uid))[0];
    const historyCursor = new HistoryCursor();
    // if (!userCursor || !lastID) {
    //     historyCursor.code = -1;
    //     historyCursor.cursor = 0;
    //     historyCursor.last = 0;

    //     return historyCursor;
    // }
    logger.debug('getUserHistoryCursor userCursor', userCursor, lastID);
    historyCursor.code = 1;
    historyCursor.cursor = userCursor ? userCursor.cursor : -1; // 消息ID从0开始，-1表示没有消息
    historyCursor.last = lastID ? lastID.current : 0;
    logger.debug('getUserHistoryCursor historyCursor', historyCursor);

    return historyCursor;
};

/**
 * 获取群聊消息游标
 */
// #[rpc=rpcServer]
export const getGroupHistoryCursor = (gid: number): HistoryCursor => {
    const sid = getUid();
    const groupHistoryCursorBucket = new Bucket('file', CONSTANT.GROUP_HISTORY_CURSOR_TABLE);
    const msgLockBucket = new Bucket('file', CONSTANT.MSG_LOCK_TABLE);
    const lastID = msgLockBucket.get(genGroupHid(gid))[0];
    const groupCursor = groupHistoryCursorBucket.get(genGuid(gid, sid))[0];
    const historyCursor = new HistoryCursor();
    console.log('!!!!!!!!!!!!!!!!!groupCursor', groupCursor, lastID);
    // if (!groupCursor || !lastID) {
    //     historyCursor.code = -1;
    //     historyCursor.cursor = 0;
    //     historyCursor.last = 0;

    //     return historyCursor;
    // }
    historyCursor.code = 1;
    historyCursor.cursor = groupCursor ? groupCursor.cursor : -1;
    historyCursor.last = lastID ? lastID.current : 0;
    logger.debug('getGroupHistoryCursor groupCursor', groupCursor, lastID);

    logger.debug('getGroupHistoryCursor historyCursor', historyCursor);

    return historyCursor;
};

// ================================================================= 导出
/**
 * 发送群组消息
 * @param message group send
 */
// #[rpc=rpcServer]
// tslint:disable-next-line:max-func-body-length
export const sendGroupMessage = (message: GroupSend): GroupHistory => {
    logger.debug(`!!!!!!!!!!sendGroupMessage message: ${message}`);
    const groupHistoryBucket = new Bucket('file', CONSTANT.GROUP_HISTORY_TABLE);
    const msgLockBucket = new Bucket('file', CONSTANT.MSG_LOCK_TABLE);
    const gInfoBucket = new Bucket('file', CONSTANT.GROUP_INFO_TABLE);
    const gInfo = gInfoBucket.get<number, GroupInfo>(message.gid)[0];

    const gh = new GroupHistory();
    const gmsg = new GroupMsg();
    // 过滤敏感词汇
    if (message.mtype === MSG_TYPE.TXT) {
        message.msg = filterWords(message.msg);
    }
    gmsg.msg = message.msg;
    gmsg.mtype = message.mtype;
    gmsg.send = true;
    gmsg.sid = getUid();
    gmsg.time = Date.now(); // 发送时间由服务器设置
    gmsg.cancel = false;
    gh.msg = gmsg;
    // 判断是否是群组成员
    logger.debug(`sid is : ${gmsg.sid}`);
    if (gInfo.memberids.findIndex(id => id === gmsg.sid) === -1) {
        gh.hIncId = CONSTANT.DEFAULT_ERROR_STR;

        return gh;
    }
    // 判断群是否解散
    if (gInfo.state === GROUP_STATE.DISSOLVE) {
        gh.hIncId = CONSTANT.DEFAULT_ERROR_STR;

        return gh;
    }

    // 如果有禁言则不能发消息
    const punishList = getUserPunishing(`${CONSTANT.REPORT_PERSON}%${getUid()}`, CONSTANT.BAN_MESAAGE);
    if (punishList.list.length > 0) {
        gh.hIncId = JSON.stringify(punishList);

        return gh;
    }

    logger.debug(`before read and write`);

    // 消息撤回
    if (message.mtype === MSG_TYPE.RECALL) {
        // 需要撤回的消息key
        const recallKey = message.msg;
        // 获取撤回消息的基础信息
        const v = groupHistoryBucket.get<string, GroupHistory>(recallKey)[0];
        logger.debug('sendGroupMessage grouphistory begin v:', v);
        // TODO 判断撤回时间
        if (v !== undefined) {
            v.msg.cancel = true;
            // v.msg.mtype = MSG_TYPE.RECALL;
            groupHistoryBucket.put(recallKey, v);
            logger.debug('sendGroupMessage grouphistory v:', v);

            // // 发布消息通知
            // const buf = new BonBuffer();
            // v.bonEncode(buf);

            // const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
            // const groupTopic = `ims/group/msg/${message.gid}`;
            // logger.debug(`before publish ,the topic is : ${groupTopic}`);
            // // directly send message to group topic
            // mqttPublish(mqttServer, true, QoS.AtMostOnce, groupTopic, buf.getBuffer());

            // return v;
        } else {
            gh.hIncId = CONSTANT.DEFAULT_ERROR_STR;
            logger.debug('sendGroupMessage grouphistory gh:', gh);

            return gh;
        }

    }

    // 公告消息撤回
    if (message.mtype === MSG_TYPE.RENOTICE) {
        // 群主才能发送公告和撤销公告
        if (getUid() !== gInfo.ownerid) {
            gh.hIncId = CONSTANT.DEFAULT_ERROR_STR;

            return gh;
        }
        // 需要撤回的消息key
        const recallKey = message.msg;
        const noticeBucket = new Bucket('file', CONSTANT.ANNOUNCE_HISTORY_TABLE);
        // 获取撤回消息的基础信息
        const v = noticeBucket.get<string, AnnounceHistory>(recallKey)[0];
        logger.debug('sendGroupMessage AnnounceHistory', v);
        // TODO 判断撤回时间
        if (v !== undefined) {
            v.announce.cancel = true;
            noticeBucket.put(recallKey, v);

        } else {
            gh.hIncId = CONSTANT.DEFAULT_ERROR_STR;
            logger.debug('sendGroupMessage grouphistory gh:', gh);

            return gh;
        }

    }

    // 生成消息ID
    const msgLock = new MsgLock();
    msgLock.hid = genGroupHid(message.gid);
    // 这是一个事务
    msgLockBucket.readAndWrite(msgLock.hid, (mLock) => {
        mLock[0] === undefined ? (msgLock.current = 0) : (msgLock.current = genNextMessageIndex(mLock[0].current));

        return msgLock;
    });
    logger.debug(`after read and write`);
    gh.hIncId = genHIncId(msgLock.hid, msgLock.current);

    // 公告消息
    if (message.mtype === MSG_TYPE.NOTICE) {
        // 群主才能发送公告和撤销公告
        if (getUid() !== gInfo.ownerid) {
            gh.hIncId = CONSTANT.DEFAULT_ERROR_STR;

            return gh;
        }
        // 公告数据存储
        const noticeBucket = new Bucket('file', CONSTANT.ANNOUNCE_HISTORY_TABLE);
        const ah = new AnnounceHistory();
        const anmt = new Announcement();
        anmt.cancel = false;
        anmt.msg = message.msg;
        anmt.mtype = message.mtype;
        anmt.send = true;
        anmt.time = Date.now();
        anmt.sid = getUid();
        ah.announce = anmt;

        // 公告key使用群聊消息key
        ah.aIncId = genHIncId(msgLock.hid, msgLock.current);
        noticeBucket.put(ah.aIncId, ah);
        logger.debug('sendGroupMessage annoucement: ', ah, 'to group: ', message.gid);
        gInfo.annoceids.push(gh.hIncId);
        gInfoBucket.put(message.gid, gInfo);
    }
    groupHistoryBucket.put(gh.hIncId, gh);
    // 移动游标表
    // moveGroupCursor(message.gid, msgLock.current);

    // const buf = new BonBuffer();
    // gh.bonEncode(buf);

    const sendMsg = new SendMsg();
    sendMsg.code = 1;
    sendMsg.last = msgLock.current;
    sendMsg.rid = gmsg.sid;
    const buf = new BonBuffer();
    sendMsg.bonEncode(buf);

    const mqttServer = env.get('mqttServer');
    const groupTopic = `ims/group/msg/${message.gid}`;
    logger.debug(`before publish ,the topic is : ${groupTopic}`);
    // directly send message to group topic
    mqttPublish(mqttServer, true, QoS.AtMostOnce, groupTopic, buf.getBuffer());
    logger.debug('Send group message: ', message.msg, 'to group topic: ', groupTopic);

    return gh;
};

/**
 * 群聊游标移动
 */
export const moveGroupCursor = (gid: number, current: number) => {
    const groupHistoryCursorBucket = new Bucket('file', CONSTANT.GROUP_HISTORY_CURSOR_TABLE);
    const gInfoBucket = new Bucket('file', CONSTANT.GROUP_INFO_TABLE);
    const gInfo = gInfoBucket.get(gid)[0];

    // 群组中的所有成员都是接收者，包括发送者
    gInfo.memberids.forEach(elem => {
        const guid = genGuid(gid, elem);
        let ridGroupCursor = groupHistoryCursorBucket.get(guid)[0];
        logger.debug('sendGroupMessage moveGroupCursor begin guid', guid, 'ridGroupCursor: ', ridGroupCursor);

        // 游标表中是否有该用户的记录
        if (!ridGroupCursor) {
            ridGroupCursor = new GroupHistoryCursor();
            ridGroupCursor.guid = guid;
            ridGroupCursor.cursor = -1;
        }
        // 用户是否在线，在线则更新游标
        const res = isUserOnline(elem);
        if (res.r === 1) {
            ridGroupCursor.cursor = current;
        }

        logger.debug('sendGroupMessage moveGroupCursor guid', guid, 'ridGroupCursor: ', ridGroupCursor);
        groupHistoryCursorBucket.put(guid, ridGroupCursor);
    });

};


/**
 * 非好友发送单聊消息（关注用户发送消息）
 * @param message user send
 */
// #[rpc=rpcServer]
export const sendUserMessageAll = (message: UserSend): UserHistory => {
    console.log('sendUserMessageAll!!!!!!!!!!!', message);
    const sid = getUid();
    const userHistory = new UserHistory();
    // 过滤敏感词汇
    if (message.mtype === MSG_TYPE.TXT) {
        message.msg = filterWords(message.msg);
    }

    const userMsg = new UserMsg();
    userMsg.cancel = false;
    userMsg.msg = message.msg;
    userMsg.mtype = message.mtype;
    userMsg.read = false;
    userMsg.send = true;
    userMsg.sid = sid;
    userMsg.time = Date.now();
    userHistory.msg = userMsg;
    
    // 如果有禁言则不能发消息
    const punishList = getUserPunishing(`${CONSTANT.REPORT_PERSON}%${sid}`, CONSTANT.BAN_MESAAGE);
    if (punishList.list.length > 0) {
        userHistory.hIncId = JSON.stringify(punishList);

        return userHistory;
    }

    // 发送消息
    sendMessage(message, userHistory);

    return userHistory;
};

/**
 * 发送单聊消息
 * @param message user send
 */
// #[rpc=rpcServer]
export const sendUserMessage = (message: UserSend): UserHistory => {
    console.log('sendMsg!!!!!!!!!!!', message);
    const sid = getUid();
    const userHistory = new UserHistory();
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE);
    // 过滤敏感词汇
    if (message.mtype === MSG_TYPE.TXT) {
        message.msg = filterWords(message.msg);
    }

    // 获取对方联系人列表
    const sContactInfo = contactBucket.get(message.rid)[0];
    const userMsg = new UserMsg();
    userMsg.cancel = false;
    userMsg.msg = message.msg;
    userMsg.mtype = message.mtype;
    userMsg.read = false;
    userMsg.send = true;
    userMsg.sid = sid;
    userMsg.time = Date.now();
    userHistory.msg = userMsg;
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME,UserInfo._$info.name);
    const sUser = userInfoBucket.get<number,UserInfo>(sid)[0];  // 当前用户的userinfo
    const rUser = userInfoBucket.get(message.rid)[0];  // 接收消息的用户的userinfo
    
    if (sUser.level !== VIP_LEVEL.VIP5 && rUser.level !== VIP_LEVEL.VIP5) {  // 消息双方都不是客服
        // 判断当前用户是否在对方的好友列表中
        if (sContactInfo.friends.findIndex(item => item === sid) === -1) {
            userHistory.hIncId = CONSTANT.DEFAULT_ERROR_STR;
        
            console.log('not friend!!!!!!!!!!!',userHistory);

            return userHistory;
        }
    }

    // 如果有禁言则不能发消息
    const punishList = getUserPunishing(`${CONSTANT.REPORT_PERSON}%${sid}`, CONSTANT.BAN_MESAAGE);
    if (punishList.list.length > 0) {
        userHistory.hIncId = JSON.stringify(punishList);

        return userHistory;
    }

    // 发送消息
    sendMessage(message, userHistory);

    return userHistory;
};

/**
 * 发送临时聊天单聊消息
 * @param message user send
 */
// #[rpc=rpcServer]
export const sendTempMessage = (message: TempSend): UserHistory => {
    console.log('sendMsg!!!!!!!!!!!', message);
    // 过滤敏感词汇
    if (message.mtype === MSG_TYPE.TXT) {
        message.msg = filterWords(message.msg);
    }

    const sid = getUid();
    const userHistory = new UserHistory();
    const userMsg = new UserMsg();
    userMsg.cancel = false;
    userMsg.msg = message.msg;
    userMsg.mtype = message.mtype;
    userMsg.read = false;
    userMsg.send = true;
    userMsg.sid = sid;
    userMsg.time = Date.now();
    userHistory.msg = userMsg;
    // 参数中有gid，则是群内临时聊天
    const groupInfoBucket = new Bucket('file', GroupInfo._$info.name);
    const gInfo = groupInfoBucket.get<number, [GroupInfo]>(message.gid)[0];

    // 判断双方是否在同一个群
    if (!((gInfo.memberids.indexOf(sid) > -1) && (gInfo.memberids.indexOf(message.rid) > -1))) {
        userHistory.hIncId = NOTIN_SAME_GROUP.toString();

        return userHistory;
    }

    // 判断双方是否有一方是群主
    if (!(gInfo.ownerid === sid || gInfo.ownerid === message.rid)) {
        userHistory.hIncId = NOT_GROUP_OWNNER.toString();

        return userHistory;
    }

    // 如果有禁言则不能发消息
    const punishList = getUserPunishing(`${CONSTANT.REPORT_PERSON}%${sid}`, CONSTANT.BAN_MESAAGE);
    if (punishList.list.length > 0) {
        userHistory.hIncId = JSON.stringify(punishList);

        return userHistory;
    }

    // 发送消息
    sendMessage(message, userHistory, message.gid);

    return userHistory;
};

/**
 * 过滤敏感词
 * access_token 有效期一个月
 * @param mess 需要处理的文本
 */
const filterWords = (mess:string) => {
    console.log('filterWords!!!!!!!!!!!! mess:', mess);
    const url = `https://aip.baidubce.com/rest/2.0/antispam/v2/spam?access_token=24.3ec956c07be3a5c2612f543d66b6db42.2592000.1567081205.282335-15546570`;
    const client = http.createClient();
    http.addHeader(client, 'content-type', 'application/x-www-form-urlencoded');
    const r = http.formPost(client, url, 'content', mess);
    console.log('filterWords!!!!!!!!!!!! mess:', mess,' r:', r);
    if (r.ok) {
        const res = JSON.parse(r.ok);
        if (res.result && res.result.spam > 0) {
            console.log('filterWords!!!!!!!!!!!! res:', res.result);
            const list = res.result.reject.concat(res.result.review);
            for (const i of list) {
                for (const j of i.hit) {
                    while (mess.indexOf(j) > -1) {
                        mess = mess.replace(j,'*');
                    }
                    console.log('filterWords j:', j,' mess:',mess);
                }
            }
        } 
    } 
    console.log('!!!!!!!!!!!!!!!!!!filterWords!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',mess);

    return mess;

};

/**
 * 判断用户是否在线
 * @param uid 用户ID
 */
// #[rpc=rpcServer]
export const isUserOnline = (uid: number): Result => {

    const res = new Result();
    const bucket = new Bucket('memory', CONSTANT.ONLINE_USERS_TABLE);
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

/**
 * 举报
 */
// #[rpc=rpcServer]
export const report = (arg: ReportArg): number => {
    const reportBucket = new Bucket(CONSTANT.WARE_NAME, Report._$info.name);
    const reportCountBucket = new Bucket(CONSTANT.WARE_NAME, ReportCount._$info.name);
    const reportListTabBucket = new Bucket(CONSTANT.WARE_NAME, ReportListTab._$info.name);
    const userReportKeyTabBucket = new Bucket(CONSTANT.WARE_NAME, UserReportKeyTab._$info.name);
    const uid = getUid();
    // 添加举报记录
    const report = new Report();
    report.id = getIndexId('report');
    report.key = arg.key;
    report.report_type = arg.report_type;
    report.reason = arg.reason;
    report.evidence = arg.evidence;
    report.ruid = uid;
    report.time = Date.now().toString(); 
    report.handle_time = '0';
    report.punish_id = 0;
    reportBucket.put(report.id, report);
    // 添加被举报人统计信息
    let reportCount = reportCountBucket.get<string, ReportCount[]>(report.key)[0];
    if (!reportCount) {
        reportCount = new ReportCount();
        reportCount.key = report.key;
        reportCount.report = [];
        reportCount.handled_reported = [];
        reportCount.not_handled_reported = [];
        reportCount.reported = [];
    }
    reportCount.reported.unshift(report.id);
    reportCount.not_handled_reported.unshift(report.id);
    reportCountBucket.put(reportCount.key, reportCount);
    let userReportKey = userReportKeyTabBucket.get<number, UserReportKeyTab[]>(arg.reported_uid)[0];
    if (!userReportKey) {
        userReportKey = new UserReportKeyTab();
        userReportKey.uid = arg.reported_uid;
        userReportKey.key_list = [];
    }
    userReportKey.key_list.push(report.id);
    userReportKeyTabBucket.put(arg.reported_uid, userReportKey);
    // 添加举报人统计信息
    let reportCount1 = reportCountBucket.get<string, ReportCount[]>(`${CONSTANT.REPORT_PERSON}%${uid}`)[0];
    if (!reportCount1) {
        reportCount1 = new ReportCount();
        reportCount1.key = `${CONSTANT.REPORT_PERSON}%${uid}`;
        reportCount1.report = [];
        reportCount1.handled_reported = [];
        reportCount1.not_handled_reported = [];
        reportCount1.reported = [];
    }
    reportCount1.report.unshift(report.id);
    reportCountBucket.put(reportCount1.key, reportCount1);
    // 添加举报列表索引
    let reportListTab = reportListTabBucket.get<number, ReportListTab[]>(arg.report_type)[0];
    if (!reportListTab) {
        reportListTab = new ReportListTab();
        reportListTab.report_type = arg.report_type;
        reportListTab.key_list = [];
    }
    reportListTab.key_list.unshift(arg.key);
    reportListTabBucket.put(arg.report_type, reportListTab);

    return report.id;
};

// ----------------- helpers ------------------

export const sendMessage = (message: UserSend, userHistory: UserHistory, gid?: number): UserHistory => {
    const userHistoryBucket = new Bucket('file', CONSTANT.USER_HISTORY_TABLE);
    const msgLockBucket = new Bucket('file', CONSTANT.MSG_LOCK_TABLE);

    const sid = getUid();
    // 消息撤回
    if (message.mtype === MSG_TYPE.RECALL) {
        // 需要撤回的消息key
        const recallKey = message.msg;
        // 获取撤回消息的基础信息
        const v = userHistoryBucket.get<string, UserHistory>(recallKey)[0];
        // TODO 判断撤回时间
        if (v !== undefined) {
            v.msg.cancel = true;   // 撤回该条消息，但是该消息本身不是一条撤回标记
            // v.msg.mtype = MSG_TYPE.RECALL;
            userHistoryBucket.put(recallKey, v);

        } else {  // 错误的撤回请求
            userHistory.hIncId = CONSTANT.DEFAULT_ERROR_STR;

            return userHistory;
        }
    }
    
    const msgLock = new MsgLock();
    msgLock.hid = genUserHid(sid, message.rid);
    // 这是一个事务
    logger.debug('before readAndWrite');
    msgLockBucket.readAndWrite(msgLock.hid, (mLock) => {
        mLock[0] === undefined ? (msgLock.current = 0) : (msgLock.current = genNextMessageIndex(mLock[0].current));
        logger.debug('readAndWrite...');

        return msgLock;
    });
    logger.debug('after readAndWrite');
    userHistory.hIncId = genHIncId(msgLock.hid, msgLock.current);

    userHistoryBucket.put(userHistory.hIncId, userHistory);
    logger.debug('Persist user history message to DB: ', userHistory);
    
    // 判断是否在对方的黑名单，只保存不推送
    const contactBucket = new Bucket(CONSTANT.WARE_NAME,Contact._$info.name);
    const sContactInfo = contactBucket.get(message.rid)[0];
    if (sContactInfo.blackList.findIndex(item => item === sid) > -1) {
        userHistory.msg.send = false;
        console.log(`blacklist person!!!!!!!!!!!${JSON.stringify(userHistory)}`);
    }
    userHistoryBucket.put(userHistory.hIncId, userHistory);
    logger.debug('Persist user history message to DB: ', userHistory);

    if (userHistory.msg.send) {  // 消息未被阻止则推送，黑名单中不推送
        // 推送消息ID
        const sendMsg = new SendMsg();
        sendMsg.code = 1;
        sendMsg.last = msgLock.current;
        sendMsg.rid = sid;
        if (gid) sendMsg.gid = gid;
        const buf = new BonBuffer();
        sendMsg.bonEncode(buf);
        const mqttServer = env.get('mqttServer');
        mqttPublish(mqttServer, true, QoS.AtMostOnce, `${message.rid}_sendMsg`, buf.getBuffer());
        logger.debug(`from ${sid} to ${message.rid}, message is : ${JSON.stringify(sendMsg)}`,`${message.rid}_sendMsg`);}

    // 举报用户
    if (message.mtype === MSG_TYPE.COMPLAINT) {
        // 获取自动回复消息
        const messageReplyBucket = new Bucket(CONSTANT.WARE_NAME, MessageReply._$info.name);
        const msgReply = messageReplyBucket.get<string, MessageReply>(CONSTANT.MESSAGE_TYPE_NOTICE)[0];
        const sendMsg = msgReply.msg ? msgReply.msg : '收到您的举报，好嗨将会尽快核实并给予处理';
        sendFirstWelcomeMessage(sendMsg, message.rid);
    }
};

// 自增id
export const getIndexId = (name: string) : number => {
    const indexBucket = new Bucket(CONSTANT.WARE_NAME, AccountGenerator._$info.name);
    let accountGenerator = indexBucket.get<string, AccountGenerator[]>(name)[0];
    if (!accountGenerator) {
        accountGenerator = new AccountGenerator();
        accountGenerator.index = name;
        accountGenerator.currentIndex = 0;
    }
    accountGenerator.currentIndex += 1;
    indexBucket.put(name, accountGenerator);

    return accountGenerator.currentIndex;
};