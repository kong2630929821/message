/**
 * 聊天操作
 */
// ================================================================= 导入
import {Result, MemberIdArray} from "./basic.s";
import {AnnounceHistory,UserHistory, GroupHistory, HIncId, AIncId} from "../db/message.s";
import {AnnounceSend, GroupSend, UserSend} from "./message.s";



// ================================================================= 导出
/**
 * 发布公告
 * @param announce 
 */
//#[rpc]
export const sendAnnouncement = (announce:AnnounceSend): AnnounceHistory|Result => {

    return
}

/**
 * 撤销公告
 * @param aIncId 
 */
//#[rpc]
export const cancelAnnouncement = (aIncId:HIncId): Result => {
    
    return
}

/**
 * 发送群组消息
 * @param message 
 */
//#[rpc]
export const sendGroupMessage = (message:GroupSend): GroupHistory|Result => {

    return
}

/**
 * 撤销群组消息
 * @param hIncId 
 */
//#[rpc]
export const cancelGroupMessage = (hIncId:HIncId): Result => {

    return 
}

/**
 * 发送单聊消息
 * @param message 
 */
//#[rpc]
export const sendUserMessage = (message:UserSend): UserHistory|Result => {

    return 
}

/**
 * 撤销群组消息
 * @param hIncId 
 */
//#[rpc]
export const cancelUserMessage = (hIncId:HIncId): Result => {

    return
}