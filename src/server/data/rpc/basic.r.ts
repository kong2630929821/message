/**
 * 获取客户的基本信息
 */
import {UserInfo, Contact, Uuid, FriendLink} from "../db/user.s";
import {RSBoolean, MessageFragment, AnnouceFragment, UserArray, GroupArray, FriendLinkArray,
  GroupHistoryArray, UserHistoryArray, AnnounceHistoryArray, GroupUserLinkArray} from "./basic.s";
import {GroupHistory} from "../db/message.s";
import {Guid} from "../db/group.s";




/**
 * 获取用户基本信息
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
export const setUsersInfo = (param:UserInfo): RSBoolean => {

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
 * 获取好友别名和历史记录
 * @param uuidArr 
 */
//#[rpc]
export const getGroupUserLinks = (uuidArr: Array<Guid>): GroupUserLinkArray => {

  return
}


/**
 * 申请添加其他用户为好友
 * @param apply 
 */
//#[rpc]
export const applyFriend = (apply:Uuid): RSBoolean => {
  
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
export const getAnnouceMent = (param:AnnouceFragment): AnnounceHistoryArray => {

  return
}

