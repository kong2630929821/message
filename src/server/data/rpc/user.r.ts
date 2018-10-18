/**
 * 用户相关的rpc操作
 */
// ================================================================= 导入
import {Uuid} from "../db/user.s";
import {Result} from "./basic.s";
import {UserAgree} from "./userAgree.s";


// ================================================================= 导出
/**
 * 申请添加对方为好友
 * @param uuid 
 */
//#[rpc]
export const applyFriend = (uid:number): Result => {

}

/**
 * 接受对方为好友
 * @param agree 
 */
//#[rpc]
export const acceptFriend = (agree:UserAgree): Result => {

}

/**
 * 删除好友
 * @param uuid 
 */
//#[rpc]
export const delFriend = (uid:number): Result => {

}

//修改密码TODO
