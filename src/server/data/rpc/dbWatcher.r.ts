/**
 * 前端主动监听后端数据库的变化
 */
// ================================================================= 导入
import {GroupInfo, GroupUserLink, Guid} from "../db/group.s";
import {UserHistory, GroupHistory, AnnounceHistory, MsgLock, HIncId, AIncId} from "../db/message.s";
import {UserInfo, UserCredential, AccountGenerator, FriendLink, Contact, Uuid} from "../db/user.s";
import {AddressInfo} from "../db/extra.s";

// ================================================================= 导出

/**
 * 群组信息
 * @param gid 
 */
//#[rpc]
 export const watchGroupInfo = (gid:number):GroupInfo => {
     return
 }

 /**
  * 群组中的用户信息
  * @param guid 
  */
  //#[rpc]
 export const watchGroupUserLink = (guid:Guid):GroupUserLink => {
    return
}

/**
 * 用户历史记录
 * @param hIncid 
 */
//#[rpc]
export const watchUserHistory = (hIncid: HIncId):UserHistory => {
    return
}

/**
 * 群组历史记录
 * @param hIncid 
 */
//#[rpc]
export const watchGroupHistory = (hIncid: HIncId):GroupHistory => {
    return
}

/**
 * 所有公告
 * @param aIncId 
 */
//#[rpc]
export const watchAnnounceHistory = (aIncId: AIncId):AnnounceHistory => {
    return
}

/**
 * 消息锁
 * @param hid 
 */
//#[rpc]
export const watchMsgLock = (hid:number):MsgLock => {
    return
}

/**
 * 用户本人的基本信息
 * @param uid 
 */
//#[rpc]
export const watchUserInfo = (uid:number):UserInfo => {
    return
}

/**
 * User credential table
 * @param uid 
 */
//#[rpc]
export const watchUserCredential = (uid:number):UserCredential => {
    return
}

/**
 * User account generator
 * @param index 
 */
//#[rpc]
export const watchAccountGenerator = (index:String):AccountGenerator => {
    return
}

/**
 * 好友链接信息
 * @param uuid 
 */
//#[rpc]
export const watchFriendLink = (uuid: Uuid):FriendLink => {
    return
}

/**
 * 联系人信息
 * @param uid 
 */
//#[rpc]
export const watchContact = (uid:number):Contact => {
    return
}

/**
 * 地址信息
 * @param uid 
 */
//#[rpc]
export const watchAddressInfo = (uid:number):AddressInfo => {
    return
}
