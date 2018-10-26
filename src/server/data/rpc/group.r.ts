/**
 * 群组相关的rpc操作
 */
// ================================================================= 导入
import { GroupInfo } from "../db/group.s";
import { Result } from "./basic.s";
import { GroupCreate, GroupAgree, Invite } from "./group.s";

// ================================================================= 导出

/**
 * 用户主动申请加入群组
 * @param guid
 */
//#[rpc=rpcServer]
export const applyJoinGroup = (gid: number): Result => {

    return
}

/**
 * 管理员接受/拒绝用户的加群申请
 * @param agree
 */
//#[rpc=rpcServer]
export const acceptUser = (agree: GroupAgree): Result => {

    return
}

/**
 * 群成员邀请其他用户加入群
 * @param invite
 */
//#[rpc=rpcServer]
export const inviteUser = (invite: Invite): Result => {

    return
}

/**
 * 用户同意加入群组
 * @param agree
 */
//#[rpc=rpcServer]
export const agreeJoinGroup = (agree: GroupAgree): GroupInfo => {

    return
}

/**
 * 转移群主
 * @param guid
 */
//#[rpc=rpcServer]
export const setOwner = (guid: string): Result => {

    return
}

/**
 * 添加管理员
 * @param guid
 */
//#[rpc=rpcServer]
export const addAdmin = (guid: string): Result => {

    return
}

/**
 * 删除管理员
 * @param guid
 */
//#[rpc=rpcServer]
export const delAdmin = (guid: string): Result => {

    return
}

/**
 * 剔除用户
 * @param guid
 */
//#[rpc=rpcServer]
export const delMember = (guid: string): Result => {

    return
}

/**
 * 创建群
 * @param uid
 */
//#[rpc=rpcServer]
export const createGroup = (groupInfo: GroupCreate): GroupInfo => {

    return
}

/**
 * 解散群
 * @param guid
 */
//#[rpc=rpcServer]
export const dissolveGroup = (gid: number): Result => {

    return
}