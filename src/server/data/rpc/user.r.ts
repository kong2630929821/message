/**
 * 用户相关的rpc操作
 */
// ================================================================= 导入
import {Uuid} from "../db/user.s";
import {Result} from "./basic.s";
import {MemberIdArray} from "./group.s";
import {UserAgree} from "./userAgree.s";


// ================================================================= 导出
/**
 * 申请添加对方为好友
 * @param uuid 
 */
//#[rpc]
export const applyFriend = (uuid:Uuid): Result => {

}

/**
 * 接受对方为好友
 * @param agree 
 */
//#[rpc]
export const acceptFriend = (agree:UserAgree): MemberIdArray|Result => {

}

/**
 * 删除好友
 * @param uuid 
 */
//#[rpc]
export const delFriend = (uuid:Uuid): MemberIdArray|Result => {

}

