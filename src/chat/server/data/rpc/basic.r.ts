/**
 * 获取客户的基本信息
 * 后端不应该相信前端发送的uid信息，应该自己从会话中获取
 */
// ================================================================= 导入
import { Env } from '../../../../pi/lang/env';
import { Session } from '../../../../pi/net/session';
import { ServerNode } from '../../../../pi_pt/rust/mqtt/server';
import { setMqttTopic } from '../../../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../../../utils/db';
import { genGroupHid, genGuid, genHIncId, genNewIdFromOld, genUserHid, genUuid } from '../../../utils/util';
import { getSession, setSession } from '../../rpc/session.r';
import * as CONSTANT from '../constant';
import { GroupHistory, GroupHistoryCursor, UserHistory, UserHistoryCursor } from '../db/message.s';
import { AccountGenerator, Contact, FriendLink, FrontStoreData, GENERATOR_TYPE, OnlineUsers, OnlineUsersReverseIndex, UserAccount, UserCredential, UserInfo, VIP_LEVEL } from '../db/user.s';
import { AnnouceFragment, AnnouceIds, AnnounceHistoryArray, FriendLinkArray, GetContactReq, GetFriendLinksReq, GetGroupInfoReq, GetUserInfoReq, GroupArray, GroupHistoryArray, GroupHistoryFlag, LoginReq, UserArray, UserHistoryArray, UserHistoryFlag, UserRegister, UserType, UserType_Enum, WalletLoginReq } from './basic.s';
import { createCommNum } from './community.r';
import { CommType } from './community.s';
import { getUid } from './group.r';
import { getUserPunishing } from './manager.r';
import { getRealUid, getSUID, sendFirstWelcomeMessage } from './user.r';

declare var env: Env;

// ================================================================= 导出
/**
 * 用户注册
 * @param registerInfo user info
 */
// #[rpc=rpcServer]
export const registerUser = (registerInfo: UserRegister): UserInfo => {
    console.log('user try to register with: ', registerInfo);
    const userInfoBucket = new Bucket('file', CONSTANT.USER_INFO_TABLE);
    const userCredentialBucket = new Bucket('file', CONSTANT.USER_CREDENTIAL_TABLE);
    const accountGeneratorBucket = new Bucket('file', CONSTANT.ACCOUNT_GENERATOR_TABLE);

    const userInfo = new UserInfo();
    const userCredential = new UserCredential();

    userInfo.name = registerInfo.name;
    userInfo.note = '';
    userInfo.tel = '';
    userInfo.sex = 1;
    userInfo.wallet_addr = '';
    userInfo.acc_id = '';
    userInfo.avatar = '';
    userInfo.level = VIP_LEVEL.VIP0;

    // 这是一个事务
    accountGeneratorBucket.readAndWrite(GENERATOR_TYPE.USER, (items: any[]) => {
        const accountGenerator = new AccountGenerator();
        accountGenerator.index = GENERATOR_TYPE.USER;
        accountGenerator.currentIndex = genNewIdFromOld(items[0].currentIndex);
        userInfo.uid = accountGenerator.currentIndex;

        return accountGenerator;
    });
    // 创建社区个人账号
    userInfo.comm_num = createCommNum(userInfo.uid,userInfo.name,CommType.person);
    console.log('CommType.person: ',CommType.person);
    console.log('registeruser userinfo: ',userInfo);
    userInfoBucket.put(userInfo.uid, userInfo);
    
    userCredential.uid = userInfo.uid;
    userCredential.passwdHash = registerInfo.passwdHash;
    console.log('sucessfully registered user', userInfo);
    userCredentialBucket.put(userInfo.uid, userCredential);

    // write contact info
    const contact = new Contact();
    contact.uid = userInfo.uid;
    contact.applyGroup = [];
    contact.applyUser = [];
    contact.friends = [];
    contact.myGroup = [];
    contact.group = [];
    contact.temp_chat = [];
    contact.blackList = [];

    const contactBucket = new Bucket('file', CONSTANT.CONTACT_TABLE);
    const c = contactBucket.get(userInfo.uid)[0];
    if (c === undefined) {
        const v = contactBucket.put(userInfo.uid, contact);
        if (v) {
            console.log('Create user contact success');
        } else {
            console.error('Create user contact failed');
        }
    }
    
    return userInfo;
};

/**
 * 登陆
 */
// #[rpc=rpcServer]
// tslint:disable-next-line:max-func-body-length
export const login = (user: UserType): UserInfo => {
    console.log('user try to login with uid: ', user);
    const userInfoBucket = new Bucket('file', CONSTANT.USER_INFO_TABLE);
    const userCredentialBucket = new Bucket('file', CONSTANT.USER_CREDENTIAL_TABLE);
    console.log('1111111111111111111111111');
    let loginReq = new LoginReq();
    let userInfo = new UserInfo();
    let SUID = null; // 好嗨客服uid
    if (user.enum_type === UserType_Enum.WALLET) {
        const walletLoginReq = <WalletLoginReq>user.value;
        const openid = walletLoginReq.openid;
        const sign = walletLoginReq.sign;
        // TODO 验证签名
        const userAccountBucket = new Bucket('file', CONSTANT.USER_ACCOUNT_TABLE);
        const v = userAccountBucket.get(openid)[0];
        if (!v) {
            // 注册用户
            console.log('2222222222222222222222');
            const reguser = new UserRegister();
            reguser.passwdHash = openid;
            reguser.name = '';
            const userinfo = registerUser(reguser);
            console.log('!!!!!!!!!!!!!!!registerUser',userinfo);
            const userAcc = new UserAccount();
            userAcc.user = openid;
            userAcc.uid = userinfo.uid;
            userAccountBucket.put(openid, userAcc);
            loginReq.uid = userinfo.uid;
            SUID = getSUID();
            
        } else {
            loginReq.uid = v.uid;
        }
    } else if (user.enum_type === UserType_Enum.DEF) {
        loginReq = <LoginReq>user.value;
        const passwdHash = loginReq.passwdHash;
        const expectedPasswdHash = userCredentialBucket.get(loginReq.uid);
        // 判断密码是否正确
        // user doesn't exist
        if ((expectedPasswdHash[0] === undefined) || (passwdHash !== expectedPasswdHash[0].passwdHash)) {
            userInfo.uid = -1;
            userInfo.sex = 0;
            console.log('user does not exist: ', loginReq.uid);

            return userInfo;
        }
    }
    // 被封禁则无法登陆
    const punishList = getUserPunishing(`${CONSTANT.REPORT_PERSON}%${loginReq.uid}`, CONSTANT.BAN_MESAAGE);
    if (punishList.list.length > 0) {
        userInfo.note = 'ban_account';

        return userInfo;
    }
    console.log('3333333333333333333333');
    // FIXME: constant time equality check
    userInfo = userInfoBucket.get(loginReq.uid)[0];
    const mqttServer:ServerNode = env.get('mqttServer');
    setMqttTopic(mqttServer, loginReq.uid.toString(), true, true);  // 用户信息变化的主题
    setMqttTopic(mqttServer, `${loginReq.uid}_sendMsg`, true, true);  // 接收消息的主题
    
    // 后端统一推送消息topic
    setMqttTopic(mqttServer, `send/${loginReq.uid.toString()}`, true, true);
    console.log('4444444444444444444444444444444444');

    // save session
    // write(dbMgr, (tr: Tr) => {
    //     session.set(tr, 'uid', loginReq.uid.toString());
    //     logger.info('set session value of uid: ', loginReq.uid.toString());
    // });
    setSession('uid', loginReq.uid.toString(), loginReq.uid.toString());

    // TODO: debug purpose
    // read(dbMgr, (tr: Tr) => {
    //     const v = session.get(tr, 'uid');
    //     console.log('read session value of uid: ', v);
    //     console.log('user login session id: ', session.getId());
    // });
    const v = getSession('uid');
    console.log('read session value of uid: ', v);

    const onlineUsersBucket = new Bucket('memory', CONSTANT.ONLINE_USERS_TABLE);
    const onlineUsersReverseIndexBucket = new Bucket('memory', CONSTANT.ONLINE_USERS_REVERSE_INDEX_TABLE);
    console.log('555555555555555555555555555');
    const session:Session = env.get('session');
    const online = new OnlineUsers();
    online.uid = loginReq.uid;
    online.sessionId = session.getId();
    onlineUsersBucket.put(online.uid, online);

    console.log('Add user: ', loginReq.uid, 'to online users bucket with sessionId: ', online.sessionId);
    console.log('66666666666666666666666666666666666');
    const onlineReverse = new OnlineUsersReverseIndex();
    onlineReverse.sessionId = session.getId();
    onlineReverse.uid = loginReq.uid;
    onlineUsersReverseIndexBucket.put(onlineReverse.sessionId, onlineReverse);

    if (SUID && userInfo.uid !== SUID) { // 好嗨客服发送第一条欢迎消息
        sendFirstWelcomeMessage('我是好嗨客服，欢迎您使用好嗨，如果您对产品有什么意见或建议可以直接提出，如果建议被采纳，还有奖励哦^_^', SUID); 
    }

    return userInfo;
};

// /**
//  * 客服账号首次登陆创建一个官方群组
//  */
// const createServiceGroup = (uid:number) => {
//     const contactBucket = new Bucket('file',Contact._$info.name);
//     const contact = contactBucket.get<number,Contact>(uid)[0];
//     if (contact && contact.myGroup.length === 0) {
//         const group = new GroupCreate();
//         group.name = '官方群组1';
//         group.avatar = '';
//         group.note = '';
//         group.need_agree = false;
//         createGroup(group);
//     }
// };

/**
 * 获取用户基本信息
 *
 * @param uid user id
 */
// #[rpc=rpcServer]
export const getUsersInfo = (getUserInfoReq: GetUserInfoReq): UserArray => {
    const userInfoBucket = new Bucket('file', CONSTANT.USER_INFO_TABLE);

    const uids = getUserInfoReq.uids;
    if (uids.length === 0) {
        const accIds = getUserInfoReq.acc_ids;
        for (const v of accIds) {
            const uid = getRealUid(v);
            uids.push(uid);
        }
        console.log('!!!!!!!!!!!!!!!getUsersInfo accIds: ', accIds,'uids: ',uids);
        
    }
    const values = [];
    for (const v of uids) {
        const user = userInfoBucket.get(v)[0];
        user && values.push(user);
    }
    const res = new UserArray();
    res.arr = values;
    console.log('!!!!!!!!!!!!!!getUsersInfo UserArray',res);

    return res;
};

/**
 * 获取群组基本信息
 * @param uid user id
 */
// #[rpc=rpcServer]
export const getGroupsInfo = (getGroupInfoReq: GetGroupInfoReq): GroupArray => {
    const groupInfoBucket = new Bucket('file', CONSTANT.GROUP_INFO_TABLE);

    const groupList = [];
    for (const v of getGroupInfoReq.gids) {
        const ginfo = groupInfoBucket.get(v)[0];
        ginfo && groupList.push(ginfo);
    }

    const res = new GroupArray();
    res.arr = groupList;

    return res;
};

/**
 * 获取联系人信息
 * @param uid user id 
 */
// #[rpc=rpcServer]
export const getContact = (getContactReq: GetContactReq): Contact => {
    const contactBucket = new Bucket('file', CONSTANT.CONTACT_TABLE);

    const uid = getContactReq.uid;
    const value = contactBucket.get<number, Contact>(uid);

    return value[0];
};

/**
 * 获取好友别名
 * @param uuidArr userid:userid
 */
// #[rpc=rpcServer]
export const getFriendLinks = (getFriendLinksReq: GetFriendLinksReq): FriendLinkArray => {
    const friendLinkBucket = new Bucket('file', CONSTANT.FRIEND_LINK_TABLE);

    const friendLinkArray = new FriendLinkArray();
    console.log(`uuid is : ${JSON.stringify(getFriendLinksReq.uuid)}`);
    const friendList = [];
    for (const v of getFriendLinksReq.uuid) {
        const friend = friendLinkBucket.get<string, FriendLink>(v)[0];
        friend && friendList.push(friend);
    }
    
    console.log(`friendLinkArray is : ${JSON.stringify(friendList)}`);
    friendLinkArray.arr = friendList;

    return friendLinkArray;
};

/**
 * 获取群组聊天的历史记录
 */
// #[rpc=rpcServer]
export const getGroupHistory = (param: GroupHistoryFlag): GroupHistoryArray => {
    const sid = getUid();
    const start = param.start;
    const end = param.end;
    if (end < start)  {

        throw new Error(`param error start:${start} end:${end}`);
    }
    const groupHistoryBucket = new Bucket('file', CONSTANT.GROUP_HISTORY_TABLE);
    const groupHistorycursorBucket = new Bucket('file', CONSTANT.GROUP_HISTORY_CURSOR_TABLE);

    const hid = genGroupHid(param.gid); 
    const groupHistoryArray = new GroupHistoryArray();
    groupHistoryArray.arr = [];
    groupHistoryArray.newMess = 0;

    // let fg = 1;
    // let index = -1;
    let groupCursor = groupHistorycursorBucket.get<string, GroupHistoryCursor>(genGuid(param.gid, sid))[0];
    // console.log(`getGroupHistory begin index:${index}, groupHistorycursor: ${JSON.stringify(groupCursor)}`);

    // if (param.hIncId) {  // 如果本地有记录则取本地记录
    //     index = getIndexFromHIncId(param.hIncId);

    // } else if (groupCursor) { // 如果本地没有记录且cursor存在则从cursor中获取，否则从0开始
    //     index = groupCursor.cursor;
    // }

    const mess = [];
    for (let id = start; id <= end; id++) {
        const hIncId = genHIncId(hid, id);
        const v = groupHistoryBucket.get<string, GroupHistory>(hIncId)[0];
        if (v) {
            mess.push(v);
        }
    }
    
    console.log('getGroupHistory mess:',mess);
    
    // while (fg === 1) {
    //     index++;
    //     const oneMess = groupHistoryBucket.get<string, UserHistory>(genHIncId(hid, index))[0];
    //     console.log('getGroupHistory oneMess: ', oneMess);
    //     if (oneMess) {
    //         groupHistoryArray.arr.push(oneMess);
    //     } else {
    //         fg = 0;
    //     }
    // }

    groupHistoryArray.arr = mess;
    // 游标表中是否有该用户的记录
    if (!groupCursor) {

        groupCursor = new GroupHistoryCursor();
        groupCursor.guid = genGuid(param.gid, sid);
        groupCursor.cursor = -1;
    }
    if (end > groupCursor.cursor) {
        groupHistoryArray.newMess = end - groupCursor.cursor;
        groupCursor.cursor = end;
    }
    groupHistorycursorBucket.put(groupCursor.guid, groupCursor);
    // console.log(`getGroupHistory index:${index}, groupHistorycursor: ${JSON.stringify(groupCursor)}`);

    console.log('getGroupHistory rid: ', param.gid, 'history: ', groupHistoryArray);

    return groupHistoryArray;
};

/**
 * 获取单聊的消息记录
 */
// #[rpc=rpcServer]
export const getUserHistory = (param: UserHistoryFlag): UserHistoryArray => {
    console.log('getUserHistory param', param);
    const start = param.start;
    const end = param.end;
    if (end < start) {

        throw new Error(`param error start:${start} end:${end}`);
    }
    const sid = getUid();
    const userHistoryBucket = new Bucket('file', CONSTANT.USER_HISTORY_TABLE);
    const userHistoryCursorBucket = new Bucket('file', CONSTANT.USER_HISTORY_CURSOR_TABLE);
    const hid = genUserHid(sid, param.rid);
    const userHistoryArray = new UserHistoryArray();
    userHistoryArray.arr = [];
    userHistoryArray.newMess = 0;

    // let fg = 1;
    // let index = -1;
    let userCursor = userHistoryCursorBucket.get<string, UserHistoryCursor>(genUuid(sid, param.rid))[0];
    // console.log(`getUserHistory begin index:${index}, userHistoryCursor: ${JSON.stringify(userCursor)}`);

    // if (param.hIncId) {  // 如果本地有记录则取本地记录
    //     index = getIndexFromHIncId(param.hIncId);

    // } else if (userCursor) { // 如果本地没有记录且cursor存在则从cursor中获取，否则从0开始
    //     index = userCursor.cursor;
    // }
    const mess = [];
    for (let id = start; id <= end; id++) {
        const hIncId = genHIncId(hid, id);
        const v = userHistoryBucket.get<string, UserHistory>(hIncId)[0];
        if (v) {
            mess.push(v);
        }
    }

    console.log('getuserhistory mess: ',mess);
    // while (fg === 1) {
    //     index++;
    //     const oneMess = userHistoryBucket.get<string, UserHistory>(genHIncId(hid, index))[0];
    //     console.log('getUserHistory oneMess: ', oneMess);
    //     if (oneMess) {
    //         userHistoryArray.arr.push(oneMess);
    //     } else {
    //         fg = 0;
    //     }
    // }
    userHistoryArray.arr = mess;
    // 游标表中是否有该用户的记录
    if (!userCursor) {

        userCursor = new UserHistoryCursor();
        userCursor.uuid = genUuid(sid, param.rid);
        userCursor.cursor = -1;
    }
    if (end > userCursor.cursor) {
        userHistoryArray.newMess = end - userCursor.cursor;
        userCursor.cursor = end;
    }
    // userCursor.cursor = index - 1;
    userHistoryCursorBucket.put(userCursor.uuid, userCursor);
    // console.log(`getUserHistory index:${index}, userHistoryCursor: ${JSON.stringify(userCursor)}`);

    // userHistoryArray.newMess = userHistoryArray.arr.length;
    console.log('getUserHistory rid: ', param.rid, 'history: ', userHistoryArray);

    return userHistoryArray;
};

/**
 * 获取公告
 * @param param AnnouceFragment
 */
// #[rpc=rpcServer]
export const getAnnoucement = (param: AnnouceFragment): AnnounceHistoryArray => {
    const announceHistoryBucket = new Bucket('file', CONSTANT.ANNOUNCE_HISTORY_TABLE);

    const announceHistory = new AnnounceHistoryArray();

    // we don't use param.order there, because `iter` is not bidirectional
    const aid = param.aid;
    // tslint:disable-next-line:no-reserved-keywords
    const from = param.from;
    const size = param.size;

    const keyPrefix = `${aid}:`;
    const value = announceHistoryBucket.get(keyPrefix + from);

    if (value[0] !== undefined) {
        for (let i = from; i < from + size; i++) {
            const v = announceHistoryBucket.get(keyPrefix + i);
            if (v[0] !== undefined) {
                announceHistory.arr.push(v[0]);
            } else {
                break;
            }
        }
    }

    return announceHistory;
};

/**
 * 获取公告信息
 * @param param AnnouceIds
 */
// #[rpc=rpcServer]
export const getAnnoucements = (param: AnnouceIds): AnnounceHistoryArray => {
    const announceHistoryBucket = new Bucket('file', CONSTANT.ANNOUNCE_HISTORY_TABLE);

    const announceHistory = new AnnounceHistoryArray();

    const aids = param.arr;

    announceHistory.arr = announceHistoryBucket.get(aids);
    console.log('getAnnoucements announceHistory', announceHistory);

    return announceHistory;
};

/**
 * 前端需要存储的内容
 */
// #[rpc=rpcServer]
export const setData = (param:string):FrontStoreData => {
    console.log('setData param: ',param);
    const storeBucket = new Bucket('file',CONSTANT.FRONT_STORE_DATA);
    const uid = getUid();
    let store = storeBucket.get<number,FrontStoreData>(uid)[0];
    if (!store) {
        store = new FrontStoreData();
        store.uid = uid;
    } 
    store.value = param;
    storeBucket.put(uid,store);
    console.log('setData store: ',store);

    return store;
};

/**
 * 获取前端存储的内容
 */
// #[rpc=rpcServer]
export const getData = (uid:number):FrontStoreData => {
    const storeBucket = new Bucket('file',CONSTANT.FRONT_STORE_DATA);
    const sid = getUid();
    console.log('getData uid: ',uid,'sid: ',sid);
    if (sid !== uid) {
        return new FrontStoreData();
    }
    let store = storeBucket.get<number,FrontStoreData>(sid)[0];
    if (!store) {
        store = new FrontStoreData();
        store.uid = sid;
        store.value = '';
    }
    console.log('getData store: ',store);

    return store;
};

// ================================================================= 本地
export const getUserInfoById = (uid: number): UserInfo => {
    const userInfoBucket = new Bucket('file', CONSTANT.USER_INFO_TABLE);
    
    return userInfoBucket.get<number,UserInfo[]>(uid)[0];
};