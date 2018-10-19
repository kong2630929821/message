/**
 * 获取客户的基本信息
 * 后端不应该相信前端发送的uid信息，应该自己从会话中获取
 */
// ================================================================= 导入
import {Contact, Uuid, FriendLink, UserInfo} from "../db/user.s";
import {GetFriendLinksReq, GetContactReq, Result, UserInfoSet, MessageFragment, AnnouceFragment, UserArray, GroupArray, FriendLinkArray, GroupHistoryArray, UserHistoryArray, AnnounceHistoryArray, GroupUserLinkArray, UserRegister, GetUserInfoReq, GetGroupInfoReq} from "./basic.s";
import {GroupHistory} from "../db/message.s";
import {Guid} from "../db/group.s";

import { Bucket } from "../../../utils/db";
import { getEnv } from '../../../pi_pt/init/init';

const dbMgr = getEnv().getDbMgr();
const userInfoBucket = new Bucket("file", "user.UserInfo", dbMgr);
const groupInfoBucket = new Bucket("file", "group.Group", dbMgr);
const contactBucket = new Bucket("file", "user.Contact", dbMgr);
const friendLinkBucket = new Bucket("file", "user.FriendLink", dbMgr);

// ================================================================= 导出
/**
 * 用户注册
 * @param registerInfo
 */
//#[rpc]
export const registerUser = (registerInfo:UserRegister):UserInfo => {

  let userInfo = new UserInfo();
  userInfo.name = registerInfo.name;
  userInfo.note = "";
  userInfo.tel = "";
  userInfo.uid = 1000000;

  userInfoBucket.put(userInfo.uid, userInfo);

  return userInfo;
}


/**
 * 获取用户基本信息
 *
 * @param uid
 */
//#[rpc]
export const getUsersInfo = (getUserInfoReq: GetUserInfoReq):UserArray => {
  let uids = getUserInfoReq.uids;
  let values:any = userInfoBucket.get(uids);

  let res = new UserArray();
  res.arr = values;

  return res;
}

/**
 * 获取群组基本信息
 * @param uid
 */
//#[rpc]
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
//#[rpc]
export const setUserInfo = (param:UserInfoSet): Result => {

  return
}


/**
 * 获取联系人信息
 * @param uid
 */
//#[rpc]
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
//#[rpc]
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
//#[rpc]
export const getGroupUserLinks = (uuidArr: Array<Guid>): GroupUserLinkArray => {

  return
}

/**
 * 获取群组聊天的历史记录
 * @param hid
 */
//#[rpc]
export const getGroupHistory = (param:MessageFragment): GroupHistoryArray => {

  return
}


/**
 * 获取单聊的历史记录
 * @param hid
 */
//#[rpc]
export const getUserHistory = (param:MessageFragment): UserHistoryArray => {

  return
}

/**
 * 获取公告
 * @param param
 */
//#[rpc]
export const getAnnoucement = (param:AnnouceFragment): AnnounceHistoryArray => {
  return
}

