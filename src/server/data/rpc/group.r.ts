/**
 * 群组相关的rpc操作
 */
// ================================================================= 导入
import {Guid, GroupInfo} from "../db/group.s";
import {Result} from "./basic.s";
import {UserId} from "./user.s";
import {GroupCreate, GroupAgree, Invite} from "./group.s";

// ================================================================= 导出

/**
 * 用户主动申请加入群组
 * @param guid 
 */
//#[rpc]
export const applyJoinGroup = (gid:number): Result => {

    return
}

/**
 * 管理员接受/拒绝用户的加群申请
 * @param agree 
 */
//#[rpc]
export const acceptUser = (agree:GroupAgree): Result => {

    return
}

/**
 * 群成员邀请其他用户加入群
 * @param invite 
 */
//#[rpc]
export const inviteUser = (invite:Invite): Result => {

    return
}

/**
 * 用户同意加入群组
 * @param agree 
 */
//#[rpc]
export const agreeJoinGroup = (agree:GroupAgree): GroupInfo|Result => {

    return
}

/**
 * 转移群主
 * @param guid 
 */
//#[rpc]
export const setOwner = (guid:Guid): Result => {

    return
}

/**
 * 添加管理员
 * @param guid 
 */
//#[rpc]
export const addAdmin = (guid:Guid): Result => {

    return 
}

/**
 * 删除管理员
 * @param guid 
 */
//#[rpc]
export const delAdmin = (guid:Guid): Result => {

    return 
}

/**
 * 剔除用户
 * @param guid 
 */
//#[rpc]
export const delMember = (guid:Guid): Result => {

    return
}

/**
 * 创建群
 * @param uid 
 */
//#[rpc]
export const createGroup = (groupInfo:GroupCreate): GroupInfo|Result => {

    return 
}

/**
 * 解散群
 * @param guid 
 */
//#[rpc]
export const dissolveGroup = (gid:number): Result => {

    return 
}