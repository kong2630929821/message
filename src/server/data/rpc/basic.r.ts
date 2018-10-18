/**
 * 获取客户的基本信息
 * 后端不应该相信前端发送的uid信息，应该自己从会话中获取
 */
// ================================================================= 导入
import {Contact, Uuid, FriendLink, UserInfo} from "../db/user.s";
import {Result, UserInfoSet, MessageFragment, AnnouceFragment, UserArray, GroupArray, FriendLinkArray, GroupHistoryArray, UserHistoryArray, AnnounceHistoryArray, GroupUserLinkArray, UserRegister} from "./basic.s";
import {GroupHistory} from "../db/message.s";
import {Guid} from "../db/group.s";

// ================================================================= 导出
/**
 * 用户注册
 * @param registerInfo
 */
//#[rpc]
export const registerUser = (registerInfo:UserRegister):UserInfo => {

  return
}


/**
 * 获取用户基本信息
 *
 * @param uid
 */
//#[rpc]
export const getUsersInfo = (uidArr: Array<number>):UserArray => {

  return
}

/**
 * 获取群组基本信息
 * @param uid
 */
//#[rpc]
export const getGroupsInfo = (gidArr: Array<number>):GroupArray => {

  return
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
export const getContact = (uid: number): Contact => {

  return
}

/**
 * 获取好友别名和历史记录
 * @param uuidArr
 */
//#[rpc]
export const getFriendLinks = (uuidArr: Array<Uuid>): FriendLinkArray => {

  return
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

