/**
 * 用户相关的rpc操作
 */
// ================================================================= 导入
import { Env } from '../../../../pi/lang/env';
import { BonBuffer } from '../../../../pi/util/bon';
import { mqttPublish, QoS } from '../../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../../utils/db';
import { send } from '../../../utils/send';
import { delValueFromArray, genHIncId, genNextMessageIndex, genUserHid, genUuid } from '../../../utils/util';
import * as CONSTANT from '../constant';
import { MessageReply } from '../db/manager.s';
import { MSG_TYPE, MsgLock, UserHistory, UserHistoryCursor, UserMsg } from '../db/message.s';
import { Contact, FriendLink, OfficialUsers, UserFind, UserInfo, VIP_LEVEL } from '../db/user.s';
import { APPLY_FRIENDS_OVERLIMIT, FRIENDS_NUM_OVERLIMIT } from '../errorNum';
import { Result } from './basic.s';
import { getUid } from './group.r';
import { getUserHistoryCursor, sendUserMessage } from './message.r';
import { SendMsg, UserSend } from './message.s';
import { FriendAlias, SetOfficial, UserAgree, UserChangeInfo, UserInfoList } from './user.s';

declare var env: Env;

// ================================================================= 导出
/**
 * 通过accid wallet_address uid phone匹配对应的uid
 */
// #[rpc=rpcServer]
export const getRealUid = (user:String):number => {
    const userFindBucket = new Bucket(CONSTANT.WARE_NAME, UserFind._$info.name);
    const rArr = userFindBucket.get<string[], UserFind[]>([`u:${user}`, `w:${user}`, `p:${user}`, `a:${user}`]);
    console.log('!!!!!!!!!!!!!!!getRealUid user: ',user,' rArr:', rArr);

    let uid = -1;
    for (const v of rArr) {
        if (v) uid = v.uid;
    }
    console.log('!!!!!!!!!!!!!!!getRealUid uid: ',uid);

    return uid;
};

/**
 * 搜索用户
 */
// #[rpc=rpcServer]
export const searchFriend = (user: string): UserInfoList => {
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME, UserInfo._$info.name);
    const userInfoList = new UserInfoList();
    userInfoList.list = [];
    // 精确查找
    const uid = getRealUid(user);
    if (uid === -1) {
        // 精确查找未找到,通过用户名模糊查找
        const iter = userInfoBucket.iter(null, false);
        do {
            const v = iter.next();
            console.log('!!!!!!!!!!!!v:', v);
            if (!v) break;
            const userInfo: UserInfo = v[1];
            if (userInfo.name.split(user).length > 1) {
                userInfoList.list.push(userInfo);
                continue;
            }
        } while (iter);
    } else {
        const userInfo = userInfoBucket.get<number,UserInfo[]>(uid)[0];
        userInfoList.list.push(userInfo);
    }

    return userInfoList;
};

/**
 * 申请添加对方为好友
 * @param uid uid
 */
// #[rpc=rpcServer]
export const applyFriend = (user: string): Result => {
    const sid = getUid();
    const result = new Result();
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE);
    const curUser = contactBucket.get<number, [Contact]>(sid)[0];
    const friendsNumLimit = get_friends_limit(sid); // 当前用户的好友上限
    // 当前用户好友数量达到上限，则申请失败
    if (curUser.friends.length >= friendsNumLimit) {
        result.r = FRIENDS_NUM_OVERLIMIT;

        return result;
    }
    
    // 获取用户UID
    const uid = getRealUid(user);
    if (uid === CONSTANT.DEFAULT_ERROR_NUMBER) {
        result.r = -2;  // 添加的好友不存在

        return result;
    }
    console.log('!!!!!!!!!!!uid:', uid);
    if (sid === uid) {
        result.r = -1;  // 不能添加自己为好友

        return result;
    }

    // 当前用户的黑名单中是否有uid
    if (curUser.blackList.findIndex(item => item === uid) > -1) {
        removeFromBlackList(uid);  // 从黑名单中移出
    }
    
    // 取出联系人表
    const friendLinkBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.FRIEND_LINK_TABLE);
    const friend1 = friendLinkBucket.get(genUuid(sid, uid))[0];
    const friend2 = friendLinkBucket.get(genUuid(uid, sid))[0];
    console.log('applyFriend friend1: ', friend1, 'friend2: ', friend2);
    if (friend1 && friend2) {
        result.r = 0;   // 已经是好友，不需要重复添加

        return result;
    }
    const friendsNumLimit1 = get_friends_limit(uid); // 添加的好友的好友上限
    const friendContact = contactBucket.get<number, [Contact]>(uid)[0]; // 对方的联系人列表
    // 对方的好友数量到达上限
    if (friendContact.friends.length >= friendsNumLimit1) {
        result.r = APPLY_FRIENDS_OVERLIMIT;

        return result;
    }
    // 判断对方是否是官方账号
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME,UserInfo._$info.name);
    const userinfo = userInfoBucket.get(uid)[0];  // 对方的用户信息
    console.log('========================applyFriend userinfo: ',userinfo);
    if (userinfo.level === VIP_LEVEL.VIP5) { // 官方账号无需同意直接添加
       
        const friendLink = new FriendLink();
        friendLink.uuid = genUuid(sid, uid);
        friendLink.alias = '';
        friendLink.hid = genUserHid(sid, uid);
        friendLinkBucket.put(friendLink.uuid, friendLink);
        friendLink.uuid = genUuid(uid, sid);
        friendLinkBucket.put(friendLink.uuid, friendLink);
    
        curUser.friends.findIndex(item => item === uid) === -1 && curUser.friends.push(uid);
        contactBucket.put(sid, curUser); // 添加官方账号到当前用户联系人表
    
        friendContact.friends.findIndex(item => item === sid) && friendContact.friends.push(sid);
        contactBucket.put(uid,friendContact);  // 添加当前用户到官方账号联系人表

        const officialBucket = new Bucket('file',OfficialUsers._$info.name);
        const official = officialBucket.get<string,OfficialUsers>(CONSTANT.CHAT_APPID)[0]; // 好嗨客服账号
        console.log('send msg!!!!!!!!!!official', JSON.stringify(official));
        // 其他客服发送的第一条欢迎消息
        if (official && official.uids && official.uids[0] !== uid) {
            console.log('send msg!!!!!!!!!!');
            // 获取自动回复消息
            const messageReplyBucket = new Bucket(CONSTANT.WARE_NAME, MessageReply._$info.name);
            const msgReply = messageReplyBucket.get<string, MessageReply>(CONSTANT.MESSAGE_TYPE_WELCOME)[0];
            console.log('send msg!!!!!!!!!!', msgReply.msg);
            const sendMsg = msgReply.msg ? msgReply.msg : `您好，我是${userinfo.name}，很高兴为您服务`;
            console.log('send msg!!!!!!!!!!', sendMsg);
            sendFirstWelcomeMessage(sendMsg, uid);
        } 
        
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
export const sendFirstWelcomeMessage = (helloMsg:string,uid:number) => {
    const userHistoryBucket = new Bucket('file', CONSTANT.USER_HISTORY_TABLE);
    const msgLockBucket = new Bucket('file', CONSTANT.MSG_LOCK_TABLE);

    const sid = getUid();
    const userHistory = new UserHistory();
    const userMsg = new UserMsg();

    userMsg.cancel = false;
    userMsg.msg = helloMsg;
    userMsg.mtype = MSG_TYPE.TXT;
    userMsg.read = false;
    userMsg.send = true;
    userMsg.sid = uid;
    userMsg.time = Date.now();
    userHistory.msg = userMsg;
    console.log('===============================sendFirstWelcomeMessage userMsg: ',userMsg);
    
    const msgLock = new MsgLock();
    msgLock.hid = genUserHid(sid, uid);
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
    sendMsg.rid = uid;
    const buf = new BonBuffer();
    sendMsg.bonEncode(buf);
    const mqttServer = env.get('mqttServer');
    mqttPublish(mqttServer, true, QoS.AtMostOnce, `${sid}_sendMsg`, buf.getBuffer());
    console.log(`from ${uid} to ${sid}, message is : ${JSON.stringify(sendMsg)}`,`${sid}_sendMsg`);
};

/**
 * 接受对方为好友
 * @param agree user agree
 */
// #[rpc=rpcServer]
export const acceptFriend = (agree: UserAgree): Result => {
    const result = new Result();
    const sid = getUid(); 
    const rid = agree.uid;
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE);
    
    // 获取当前用户的联系人列表
    const sContactInfo = contactBucket.get(sid)[0];
    console.log(`sContactInfo.applyFriend is ${sContactInfo.applyUser}`);
    // 判断当前用户的好友是否达到上限
    const friendsNumLimit = get_friends_limit(sid); // 当前用户的好友上限
    // 当前用户好友数量达到上限，则申请失败
    if (sContactInfo.friends.length >= friendsNumLimit) {
        result.r = FRIENDS_NUM_OVERLIMIT;
            
        return result;
    }
    // 判断对方是否邀请了该用户,如果没有邀请，则直接返回
    if (sContactInfo.applyUser.findIndex(item => item === rid) === -1) {
        result.r = -1;
            
        return result;
    }

    // 从申请列表中删除当前同意/拒绝的用户
    sContactInfo.applyUser = delValueFromArray(rid, sContactInfo.applyUser);
    // 在对方的列表中添加好友
    const rContactInfo = contactBucket.get(rid)[0];
    rContactInfo.applyUser = delValueFromArray(sid, rContactInfo.applyUser);
    
    if (agree.agree) {
        rContactInfo.friends.findIndex(item => item === sid) === -1 && rContactInfo.friends.push(sid);
        // 在当前用户列表中添加好友
        sContactInfo.friends.findIndex(item => item === rid) === -1 && sContactInfo.friends.push(rid);
        // 分别插入到friendLink中去
        const friendLinkBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.FRIEND_LINK_TABLE);
        const friendLink = new FriendLink();
        friendLink.uuid = genUuid(sid, rid);
        friendLink.alias = '';
        friendLink.hid = genUserHid(sid, rid);
        friendLinkBucket.put(friendLink.uuid, friendLink);
        friendLink.uuid = genUuid(rid, sid);
        friendLinkBucket.put(friendLink.uuid, friendLink);
        
    } else {
        // 拒绝好友
        send(rid, CONSTANT.SEND_REFUSED, sid.toString());
    }
    contactBucket.put(sid, sContactInfo);
    contactBucket.put(rid, rContactInfo);
    if (agree) {
        // 发布一条添加成功的消息
        const info = new UserSend();
        info.msg = '你们已经成为好友，开始聊天吧';
        info.mtype = MSG_TYPE.ADDUSER;
        info.rid = rid;
        info.time = Date.now();
        sendUserMessage(info);
    }
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
        const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE);
        // 获取当前用户的联系人列表
        const sContactInfo = contactBucket.get(sid)[0];
        // 从好友列表中删除当前用户
        sContactInfo.friends = delValueFromArray(rid, sContactInfo.friends);
        contactBucket.put(sid, sContactInfo);
        // 从friendLink中删除
        const friendLinkBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.FRIEND_LINK_TABLE);
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
// #[rpc=rpcServer]
export const addToBlackList = (peerUid: number): Result => {
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE);
    const uid = getUid();
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
// #[rpc=rpcServer]
export const removeFromBlackList = (peerUid: number): Result => {
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE);
    const uid = getUid();
    const result = new Result();
    const contactInfo = contactBucket.get<number, [Contact]>(uid)[0];
    const index = contactInfo.blackList.indexOf(peerUid);
    if (index > -1) {
        contactInfo.blackList.splice(index, 1);
        contactBucket.put(uid, contactInfo);
        console.log('Remove user: ', peerUid, 'from blacklist of user: ', uid);
        
        const last = getUserHistoryCursor(peerUid).last;  // 最新一条消息
        const userHistoryCursorBucket = new Bucket(CONSTANT.WARE_NAME,UserHistoryCursor._$info.name);
        let userCursor  = userHistoryCursorBucket.get(genUuid(uid,peerUid))[0];
        if (!userCursor) {
            userCursor = new UserHistoryCursor();
            userCursor.uuid = genUuid(uid, peerUid);
            userCursor.cursor = -1;
        } else {
            userCursor.cursor = last;
        }
        userHistoryCursorBucket.put(userCursor.uuid,userCursor);  // 更新当前用户的游标到最新
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
    const friendLinkBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.FRIEND_LINK_TABLE);
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE);
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
export const changeUserInfo = (userChange: UserChangeInfo): UserInfo => {
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.USER_INFO_TABLE);
    const userFindBucket = new Bucket(CONSTANT.WARE_NAME, UserFind._$info.name);
    const sid = getUid();
    const oldUserinfo = userInfoBucket.get<number, UserInfo[]>(sid)[0];
    console.log('!!!!!!!!!!!!!!!!!changeUserInfo!!oldUserinfo:', oldUserinfo);
    const SUID = getSUID(); // 好嗨客服账号
    if (sid !== SUID && userChange.name.indexOf('好嗨客服') > -1) {
        const res = new UserInfo();
        res.uid = 0;  // 名字中不能含有 '好嗨客服'

        return res;
    }
    const uidFind = userFindBucket.get<string, UserFind[]>(`u:${sid}`)[0];
    console.log('!!!!!!!!!!!!!!!!!changeUserInfo uidFind', uidFind);
    // 添加用户ID查询用户
    if (!uidFind) {
        const newUidFind = new UserFind();
        newUidFind.user = `u:${sid}`;
        newUidFind.uid = sid;
        console.log('!!!!!!!!!!!!!!!!!changeUserInfo newUidFind', newUidFind);
        userFindBucket.put(newUidFind.user, newUidFind);
    }
    // 添加手机查找用户
    if (userChange.tel && oldUserinfo.tel !== userChange.tel) {
        const phoneFind = new UserFind();
        phoneFind.user = `p:${userChange.tel}`;
        phoneFind.uid = sid;
        userFindBucket.put(phoneFind.user, phoneFind);
    }
    // 添加钱包地址查询用户
    if (userChange.wallet_addr && oldUserinfo.wallet_addr !== userChange.wallet_addr) {
        const walletFind = new UserFind();
        walletFind.user = `w:${userChange.wallet_addr}`;
        walletFind.uid = sid;
        userFindBucket.put(walletFind.user, walletFind);
    }
    // 添加acc_id查找用户
    if (userChange.acc_id && oldUserinfo.acc_id !== userChange.acc_id) {
        const acc_idFind = new UserFind();
        acc_idFind.user = `a:${userChange.acc_id}`;
        acc_idFind.uid = sid;
        console.log('!!!!!!!!!!!!!!!!!changeUserInfo acc_idFind', acc_idFind);
        userFindBucket.put(acc_idFind.user, acc_idFind);
    }
    const newUser = new UserInfo();
    newUser.uid = sid;
    newUser.name = userChange.name;
    newUser.avatar = userChange.avatar;
    newUser.sex = userChange.sex;
    newUser.tel = userChange.tel;
    newUser.note = userChange.note;
    newUser.wallet_addr = userChange.wallet_addr;
    newUser.acc_id = userChange.acc_id;
    newUser.level = oldUserinfo.level;
    newUser.comm_num = oldUserinfo.comm_num;
    console.log('!!!!!!!!!!!!!!!!!changeUserInfo newUser',newUser);
    if (userInfoBucket.put(sid, newUser)) {
        return newUser;
    }
    newUser.uid = 0;

    return newUser;
};

/**
 * 设置官方账号 rpc
 */
// #[rpc=rpcServer]
export const set_gmAccount = (setUser:SetOfficial): Result => {
    return setOfficialAccount(setUser.accId,setUser.appId);
};

/**
 * 设置官方账号 rpc
 */
// #[rpc=rpcServer]
export const testDB = (uid: number): string => {
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE);
    const contact = contactBucket.get<number, [Contact]>(uid)[0];
    if (!contact) return '';

    return JSON.stringify(contact);
};

/**
 * 设置官方账号
 */
export const setOfficialAccount = (accId:string,appId:string): Result => {
    const result = new Result();
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME, UserInfo._$info.name); 
    const officialBucket = new Bucket(CONSTANT.WARE_NAME, OfficialUsers._$info.name);
    const uid = getRealUid(accId);  // 通过accid找到对应的uid
    const userinfo = userInfoBucket.get<number, UserInfo>(uid)[0];
    let official = officialBucket.get(appId)[0];
    console.log('==============================set_gmAccount appId:',appId,'uid: ',uid);
    
    if (!userinfo) {
        result.r = CONSTANT.DEFAULT_ERROR_NUMBER;

        return result;
    }
    if (official && official.uids) {
        official.uids.push(uid);
    } else {
        official = new OfficialUsers();
        official.appId = appId;
        official.uids = [uid];
    }
    console.log('==============================set_gmAccount official:',official);
    officialBucket.put(official.appId,official);
    userinfo.level = VIP_LEVEL.VIP5;
    userInfoBucket.put(uid, userinfo);
    result.r = CONSTANT.RESULT_SUCCESS;
    console.log('==============================set_gmAccount result:',JSON.stringify(result));

    return result;
};

/**
 * 获取好嗨客服uid
 */
export const getSUID = () => {
    const officialBucket = new Bucket('file',OfficialUsers._$info.name);
    const official = officialBucket.get<string,OfficialUsers>(CONSTANT.CHAT_APPID)[0]; // 好嗨客服账号
    console.log('=======================haohai official: ',official);
    if (official && official.uids) {

        return official.uids[0];
    }

    return null;
};

// /**
//  * 获取客服账号
//  * @param get_gmAccount uid
//  */
// // #[rpc=rpcServer]
// export const get_gmAccount = (uid:number): UserLevel[] => {
//     console.log('==========================get_gmAccount',uid);
//     if (uid !== getUid()) return;

//     const levelBucket = new Bucket(CONSTANT.WARE_NAME, UserLevel._$info.name); 
//     const res = [];   
//     const iter = levelBucket.iter(null);
//     console.log('==========================get_gmAccount',iter);
//     let item;
//     do {
//         item = iter.next();        
//         console.log('==========================get_gmAccount',item,res);
//         if (item && item[1].level === VIP_LEVEL.VIP5) {
//             res.push(item[1]);
//         }

//     }while (item);
   
//     return res;
// };

// ================================================================= 本地

// 获取好友上限
export const get_friends_limit = (uid: number): number => {
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME, UserInfo._$info.name); 
    const userinfo = userInfoBucket.get<number, [UserInfo]>(uid)[0];
    let friendsNumLimit: number;
    switch (userinfo.level) {
        case VIP_LEVEL.VIP0:
            friendsNumLimit = CONSTANT.VIP0_FRIENDS_LIMIT;
            break;
        case VIP_LEVEL.VIP5:
            friendsNumLimit = CONSTANT.VIP5_FRIENDS_LIMIT;
            break;
        default:
            friendsNumLimit = CONSTANT.VIP0_FRIENDS_LIMIT;
    }

    return friendsNumLimit;
};