/**
 * 获取客户的基本信息
 * 后端不应该相信前端发送的uid信息，应该自己从会话中获取
 */
// ================================================================= 导入
import { Contact, Uuid, FriendLink, UserInfo, UserCredential, AccountGenerator } from "../db/user.s";
import {LoginReq, LoginReply, GetFriendLinksReq, GetContactReq, Result, UserInfoSet, MessageFragment, AnnouceFragment, UserArray, GroupArray, FriendLinkArray, GroupHistoryArray, UserHistoryArray, AnnounceHistoryArray, GroupUserLinkArray, UserRegister, GetUserInfoReq, GetGroupInfoReq} from "./basic.s";
import {GroupHistory} from "../db/message.s";
import {Guid} from "../db/group.s";

import { Bucket } from "../../../utils/db";
import { getEnv } from '../../../pi_pt/net/rpc_server';

import { setMqttTopic, mqttPublish, QoS } from "../../../pi_pt/rust/pi_serv/js_net";
import { ServerNode } from "../../../pi_pt/rust/mqtt/server";

// const dbMgr = getEnv().getDbMgr();
// const userInfoBucket = new Bucket("file", "user.UserInfo", dbMgr);
// const groupInfoBucket = new Bucket("file", "group.Group", dbMgr);
// const contactBucket = new Bucket("file", "user.Contact", dbMgr);
// const friendLinkBucket = new Bucket("file", "user.FriendLink", dbMgr);

// ================================================================= 导出
/**
 * 用户注册
 * @param registerInfo
 */
//#[rpc=rpcServer]
export const registerUser = (registerInfo:UserRegister):UserInfo => {
    const dbMgr = getEnv().getDbMgr();
    const userInfoBucket = new Bucket("file", "server/data/db/user.UserInfo", dbMgr);
    const userCredentialBucket = new Bucket("file", "server/data/db/user.UserCredential", dbMgr);
    const accountGeneratorBucket = new Bucket("file", "server/data/db/user.AccountGenerator", dbMgr);

    let userInfo = new UserInfo();
    let userCredential = new UserCredential();

    userInfo.name = registerInfo.name;
    userInfo.note = "Talk is cheap, show me the code!";
    userInfo.tel = "13912113456";

    let accountGenerator = new AccountGenerator();
    let nextAccount = accountGeneratorBucket.get("index")[0].nextIndex + 1;
    accountGenerator.nextIndex = nextAccount;
    accountGeneratorBucket.put("index", accountGenerator);

    // FBI warning: if the struct has a field with integer type, you must explicit specify it, wtf
    userInfo.uid = nextAccount;
    userInfo.sex = 1;

    userCredential.uid = userInfo.uid;
    userCredential.passwdHash = registerInfo.passwdHash;

    userInfoBucket.put(userInfo.uid, userInfo);
    // TODO: check potential error
    userCredentialBucket.put(userInfo.uid, userCredential);


    return userInfo;
}

//#[rpc=rpcServer]
export const login = (loginReq: LoginReq): LoginReply => {
    const dbMgr = getEnv().getDbMgr();
    const userCredentialBucket = new Bucket("file", "server/data/db/user.UserCredential", dbMgr);

    let uid = loginReq.uid;
    let passwdHash = loginReq.passwdHash;
    let expectedPasswdHash = userCredentialBucket.get(uid);

    let loginReply = new LoginReply();

    if (expectedPasswdHash[0] === undefined) {
        loginReply.status = 0;
        return loginReply;
    }

    // FIXME: constant time equality check
    if (passwdHash === expectedPasswdHash[0].passwdHash) {
        loginReply.status = 1;
        let mqttServer = getEnv().getNativeObject<ServerNode>("mqttServer");
        let uid = loginReq.uid;
        setMqttTopic(mqttServer, uid.toString(), true, true);
    } else {
        loginReply.status = 0;
    }

    return loginReply;
}


/**
 * 获取用户基本信息
 *
 * @param uid
 */
//#[rpc=rpcServer]
export const getUsersInfo = (getUserInfoReq: GetUserInfoReq):UserArray => {
    const dbMgr = getEnv().getDbMgr();
    const userInfoBucket = new Bucket("file", "server/data/db/user.UserInfo", dbMgr);

    let uids = getUserInfoReq.uids;
    let values:any = userInfoBucket.get(uids);

    //FIXME: check if `values` have undefined element, or will crash
    let res = new UserArray();
    res.arr = values;

    return res;
}

/**
 * 获取群组基本信息
 * @param uid
 */
//#[rpc=rpcServer]
export const getGroupsInfo = (getGroupInfoReq: GetGroupInfoReq):GroupArray => {
    let gids = getGroupInfoReq.gids;
    let values: any = groupInfoBucket.get(gids);

    let res = new GroupArray();
    res.arr = values;

    return res;
}

/**
 * 设置用户基本信息
 * @param param
 */
//#[rpc=rpcServer]
export const setUserInfo = (param:UserInfoSet): Result => {

    return
}


/**
 * 获取联系人信息
 * @param uid
 */
//#[rpc=rpcServer]
export const getContact = (getContactReq: GetContactReq): Contact => {
    let uid = getContactReq.uid;
    let value = contactBucket.get(uid);

    // TODO: fill more fields
    let res = new Contact();

    return res;
}

/**
 * 获取好友别名和历史记录
 * @param uuidArr
 */
//#[rpc=rpcServer]
export const getFriendLinks = (getFriendLinksReq: GetFriendLinksReq): FriendLinkArray => {
    let uuids = getFriendLinksReq.uuid;
    let values: any = friendLinkBucket.get(uuids);

    let res = new FriendLinkArray();
    res.arr = values;

    return res;
}

/**
 * 获取好友别名和历史记录id
 * @param uuidArr
 */
//#[rpc=rpcServer]
export const getGroupUserLinks = (uuidArr: Array<Guid>): GroupUserLinkArray => {

    return
}

/**
 * 获取群组聊天的历史记录
 * @param hid
 */
//#[rpc=rpcServer]
export const getGroupHistory = (param:MessageFragment): GroupHistoryArray => {

    return
}


/**
 * 获取单聊的历史记录
 * @param hid
 */
//#[rpc=rpcServer]
export const getUserHistory = (param:MessageFragment): UserHistoryArray => {

    return
}

/**
 * 获取公告
 * @param param
 */
//#[rpc=rpcServer]
export const getAnnoucement = (param:AnnouceFragment): AnnounceHistoryArray => {
    return
}

