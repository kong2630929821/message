/**
 * 用户相关的rpc操作
 */
// ================================================================= 导入
import { BonBuffer } from '../../../../pi/util/bon';
import { getEnv } from '../../../../pi_pt/net/rpc_server';
import { ServerNode } from '../../../../pi_pt/rust/mqtt/server';
import { mqttPublish, QoS } from '../../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../../utils/db';
import { send } from '../../../utils/send';
import { delValueFromArray, genHIncId, genNextMessageIndex, genUserHid, genUuid } from '../../../utils/util';
import { getSession } from '../../rpc/session.r';
import * as CONSTANT from '../constant';
import { MSG_TYPE, MsgLock, UserHistory, UserMsg } from '../db/message.s';
import { Contact, FriendLink, UserFind, UserInfo } from '../db/user.s';
import { Result } from './basic.s';
import { getUid } from './group.r';
import { sendUserMessage } from './message.r';
import { SendMsg, UserSend } from './message.s';
import { FriendAlias, UserAgree } from './user.s';

// ================================================================= 导出
/**
 * 申请添加对方为好友
 * @param uid uid
 */
// #[rpc=rpcServer]
export const applyFriend = (user: string): Result => {
    const dbMgr = getEnv().getDbMgr();
    const sid = getUid();
    // 获取用户UID
    const userFindBucket = new Bucket(CONSTANT.WARE_NAME, UserFind._$info.name, dbMgr);
    const rArr = userFindBucket.get<string[], UserFind[]>([`u:${user}`, `w:${user}`, `p:${user}`]);
    console.log('!!!!!!!!!!!!!!!applyFriend rArr:', rArr);

    let uid;
    rArr.forEach((r) => {
        if (r) {
            return uid = r.uid;
        }
    });
    const result = new Result();
    if (!uid) {
        result.r = -2;  // 添加的好友不存在

        return result;
    }
    console.log('!!!!!!!!!!!uid:', uid);
    if (sid === uid) {
        result.r = -1;  // 不能添加自己为好友

        return result;
    }
    // 取出联系人表
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
    const friendLinkBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.FRIEND_LINK_TABLE, dbMgr);
    const friend1 = friendLinkBucket.get(genUuid(sid, uid))[0];
    const friend2 = friendLinkBucket.get(genUuid(uid, sid))[0];
    console.log('applyFriend friend1: ', friend1, 'friend2: ', friend2);
    if (friend1 && friend2) {
        result.r = 0;   // 已经是好友，不需要重复添加

        return result;
    }
    const SUID = CONSTANT.CUSTOMER_SERVICE;  // 客服账号
    if (user === SUID.toString()) {   // 添加客服为好友，直接添加无需同意
        const friendLink = new FriendLink();
        friendLink.uuid = genUuid(sid, SUID);
        friendLink.alias = '';
        friendLink.hid = genUserHid(sid, SUID);
        friendLinkBucket.put(friendLink.uuid, friendLink);
        friendLink.uuid = genUuid(SUID, sid);
        friendLinkBucket.put(friendLink.uuid, friendLink);

        const curUser = contactBucket.get(sid)[0];
        curUser.friends.push(SUID);
        contactBucket.put(sid, curUser); // 添加好友到当前用户联系人表

        const serUser = contactBucket.get(SUID)[0];
        serUser.friends.push(sid);
        contactBucket.put(SUID,serUser);  // 添加好友到客服联系人表

        // 客服发送的第一条欢迎消息
        sendFirstWelcomeMessage();
        result.r = 1;

        return result;
    }
    // 取出对应的那一个联系人
    const contactInfo = contactBucket.get(uid)[0];
    contactInfo.applyUser.findIndex(item => item === sid) === -1 && contactInfo.applyUser.push(sid);
    contactBucket.put(uid, contactInfo);

    result.r = 1;

    return result;
};
/**
 * 客服发送的第一条欢迎消息
 */
const sendFirstWelcomeMessage = () => {
    const dbMgr = getEnv().getDbMgr();
    const userHistoryBucket = new Bucket('file', CONSTANT.USER_HISTORY_TABLE, dbMgr);
    const msgLockBucket = new Bucket('file', CONSTANT.MSG_LOCK_TABLE, dbMgr);

    const SUID = CONSTANT.CUSTOMER_SERVICE;  // 客服账号
    const sid = getUid();
    const userHistory = new UserHistory();
    const userMsg = new UserMsg();

    userMsg.cancel = false;
    userMsg.msg = '我是好嗨客服，欢迎您使用好嗨，如果您对产品有什么意见或建议可以直接提出，如果建议被采纳，还有奖励哦^_^';
    userMsg.mtype = MSG_TYPE.TXT;
    userMsg.read = false;
    userMsg.send = false;
    userMsg.sid = SUID;
    userMsg.time = Date.now();
    userHistory.msg = userMsg;
    
    const msgLock = new MsgLock();
    msgLock.hid = genUserHid(sid, SUID);
    // 这是一个事务
    msgLockBucket.readAndWrite(msgLock.hid, (mLock) => {
        mLock[0] === undefined ? (msgLock.current = 0) : (msgLock.current = genNextMessageIndex(mLock[0].current));

        return msgLock;
    });
    userHistory.hIncId = genHIncId(msgLock.hid, msgLock.current);
    userHistoryBucket.put(userHistory.hIncId, userHistory);

    // 推送消息ID
    const sendMsg = new SendMsg();
    sendMsg.code = 1;
    sendMsg.last = msgLock.current;
    sendMsg.rid = SUID;
    const buf = new BonBuffer();
    sendMsg.bonEncode(buf);
    const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
    mqttPublish(mqttServer, true, QoS.AtMostOnce, sid.toString(), buf.getBuffer());
    console.log(`from ${SUID} to ${sid}, message is : ${JSON.stringify(sendMsg)}`);
};

/**
 * 接受对方为好友
 * @param agree user agree
 */
// #[rpc=rpcServer]
export const acceptFriend = (agree: UserAgree): Result => {
    const _acceptFriend = (sid: number, rid: number, agree: boolean) => {
        const dbMgr = getEnv().getDbMgr();
        const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
        // 获取当前用户的联系人列表
        const sContactInfo = contactBucket.get(sid)[0];
        // 从申请列表中删除当前同意/拒绝的用户
        console.log(`sContactInfo.applyFriend is ${sContactInfo.applyUser}`);

        // 判断对方是否邀请了该用户,如果没有邀请，则直接返回
        if (sContactInfo.applyUser.findIndex(item => item === rid) === -1) {
            const rlt = new Result();
            rlt.r = -1;

            return rlt;
        }

        sContactInfo.applyUser = delValueFromArray(rid, sContactInfo.applyUser);
        // 在对方的列表中添加好友
        const rContactInfo = contactBucket.get(rid)[0];
        rContactInfo.applyUser = delValueFromArray(sid, rContactInfo.applyUser);
        if (agree) {
            
            rContactInfo.friends.findIndex(item => item === sid) === -1 && rContactInfo.friends.push(sid);
            // 在当前用户列表中添加好友
            sContactInfo.friends.findIndex(item => item === rid) === -1 && sContactInfo.friends.push(rid);
            // 分别插入到friendLink中去
            const friendLinkBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.FRIEND_LINK_TABLE, dbMgr);
            const friendLink = new FriendLink();
            friendLink.uuid = genUuid(sid, rid);
            friendLink.alias = '';
            friendLink.hid = genUserHid(sid, rid);
            friendLinkBucket.put(friendLink.uuid, friendLink);
            friendLink.uuid = genUuid(rid, sid);
            friendLinkBucket.put(friendLink.uuid, friendLink);
            contactBucket.put(sid, sContactInfo);
            contactBucket.put(rid, rContactInfo);
            
            // 发布一条添加成功的消息
            const info = new UserSend();
            info.msg = '你们已经成为好友，开始聊天吧';
            info.mtype = MSG_TYPE.ADDUSER;
            info.rid = rid;
            info.time = Date.now();
            sendUserMessage(info);
   
        } else {
            // 拒绝好友
            send(rid, CONSTANT.SEND_REFUSED, '');
        }
        
    };

    _acceptFriend(getUid(), agree.uid, agree.agree);

    const result = new Result();
    result.r = 1;

    return result;
};

/**
 * 删除好友
 * @param uuid uid:uid
 */
// #[rpc=rpcServer]
export const delFriend = (uid: number): Result => {
    const _delFriend = (sid: number, rid: number) => {
        const dbMgr = getEnv().getDbMgr();
        const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
        // 获取当前用户的联系人列表
        const sContactInfo = contactBucket.get(sid)[0];
        // 从好友列表中删除当前用户
        sContactInfo.friends = delValueFromArray(rid, sContactInfo.friends);
        contactBucket.put(sid, sContactInfo);
        // 从friendLink中删除
        const friendLinkBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.FRIEND_LINK_TABLE, dbMgr);
        friendLinkBucket.delete(genUuid(sid, rid));
        console.log('delFriend friendLink ', genUuid(sid, rid));
    };

    _delFriend(getUid(), uid);

    const result = new Result();
    result.r = 1;

    return result;
};

/**
 * 将用户添加到黑名单
 * @param uid user id
 */
export const addToBlackList = (peerUid: number): Result => {
    const dbMgr = getEnv().getDbMgr();
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
    // const session = getEnv().getSession();
    // let uid;
    // read(dbMgr, (tr: Tr) => {
    //     uid = session.get(tr, 'uid');
    // });
    const uid = getSession('uid');
    const result = new Result();
    const contactInfo = contactBucket.get<number, [Contact]>(uid)[0];
    const index = contactInfo.blackList.indexOf(peerUid);
    if (index > -1) {
        console.log('User: ', peerUid, 'has already in blacklist of user: ', uid);
        result.r = 0;

        return result;
    } else {
        contactInfo.blackList.push(peerUid);
        contactBucket.put(uid, contactInfo);
        console.log('Add user: ', peerUid, 'to blacklist of user: ', uid);

        result.r = 1;

        return result;
    }
};

/**
 * 将用户移除黑名单
 * @param uid user id
 */

export const removeFromBlackList = (peerUid: number): Result => {
    const dbMgr = getEnv().getDbMgr();
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
    // const session = getEnv().getSession();
    // let uid;
    // read(dbMgr, (tr: Tr) => {
    //     uid = session.get(tr, 'uid');
    // });
    const uid = getSession('uid');
    const result = new Result();
    const contactInfo = contactBucket.get<number, [Contact]>(uid)[0];
    const index = contactInfo.blackList.indexOf(peerUid);
    if (index > -1) {
        contactInfo.blackList.splice(index, 1);
        contactBucket.put(uid, contactInfo);
        console.log('Remove user: ', peerUid, 'from blacklist of user: ', uid);
        result.r = 1;

        return result;
    } else {
        console.log('User: ', peerUid, 'is not banned by user: ', uid);
        result.r = 0;

        return result;
    }
};

/**
 * 修改好友别名
 * @param rid user id
 * @param alias user alias
 */
// #[rpc=rpcServer]
export const changeFriendAlias = (friendAlias: FriendAlias): Result => {
    const dbMgr = getEnv().getDbMgr();
    const friendLinkBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.FRIEND_LINK_TABLE, dbMgr);
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
    const sid = getUid();
    const uuid = genUuid(sid, friendAlias.rid);
    const result = new Result();
    const contactInfo = contactBucket.get(sid)[0];
    const index = contactInfo.friends.indexOf(friendAlias.rid);
    // 判断rid是否是当前用户的好友
    if (index > -1) {
        const friend = friendLinkBucket.get(uuid)[0];
        friend.alias = friendAlias.alias;
        friendLinkBucket.put(uuid, friend);
        result.r = 1;
    } else {
        console.log('user: ', friendAlias.rid, ' is not your friend');
        result.r = 0;
    }

    return result;
};

/**
 * 修改当前用户的基础信息
 * @param userinfo user info
 */
// #[rpc=rpcServer]
export const changeUserInfo = (userinfo: UserInfo): UserInfo => {
    const dbMgr = getEnv().getDbMgr();
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.USER_INFO_TABLE, dbMgr);
    const userFindBucket = new Bucket(CONSTANT.WARE_NAME, UserFind._$info.name, dbMgr);
    const sid = getUid();
    const oldUserinfo = userInfoBucket.get<number, UserInfo[]>(sid)[0];
    console.log('!!!!!!!!!!!!!!!!!changeUserInfo!!oldUserinfo:', oldUserinfo);
    if (userinfo.uid !== CONSTANT.CUSTOMER_SERVICE && userinfo.name.indexOf('好嗨客服') > -1) {
        const res = new UserInfo();
        res.uid = 0;  // 名字中不能含有 '好嗨客服'

        return res;
    }
    // 添加手机查找用户
    if (!(oldUserinfo.tel === userinfo.tel) && !(userinfo.tel === '')) {
        const phoneFind = new UserFind();
        phoneFind.user = `p:${userinfo.tel}`;
        phoneFind.uid = sid;
        console.log('!!!!!!!!!!!!!!!!!add phone!1212121', phoneFind);
        userFindBucket.put(phoneFind.user, phoneFind);
    }
    console.log('!!!!!!!!!!!!!!!!!changeUserInfo!!1111111111111');
    // 添加钱包地址查询用户
    if (!(oldUserinfo.wallet_addr === userinfo.wallet_addr) && !(userinfo.wallet_addr === '')) {
        const walletFind = new UserFind();
        walletFind.user = `w:${userinfo.wallet_addr}`;
        walletFind.uid = sid;
        userFindBucket.put(walletFind.user, walletFind);
    }
    const uidFind = userFindBucket.get<string, UserFind[]>(`u:${sid}`)[0];
    console.log('!!!!!!!!!!!!!!!!!changeUserInfo!!22222222222', uidFind);
    // 添加用户ID查询用户
    if (!uidFind) {
        const newUidFind = new UserFind();
        newUidFind.user = `u:${sid}`;
        newUidFind.uid = sid;
        console.log('!!!!!!!!!!!!!!!!!changeUserInfo!!232233', newUidFind);
        userFindBucket.put(newUidFind.user, newUidFind);
    }
    console.log('!!!!!!!!!!!!!!!!!changeUserInfo!!333333333333333333');
    let newUser = new UserInfo();
    if (userinfo.uid === sid) {
        userInfoBucket.put(sid, userinfo);
        newUser = userinfo;
    } else {
        console.log('curUser: ', sid, ' changeUser: ', userinfo);
        newUser.uid = -1; // 不能修改其他的人的信息
    }

    return newUser;
};

// ================================================================= 本地
