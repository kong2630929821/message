/**
 * 对后端推送的数据做一些处理，然后放入数据库
 */
import { UserHistory, UserMsg } from "../../../server/data/db/message.s";
import  * as store from "./store";
/**
 * 更新userHistoryMap/userChatMap,lastChat
 * @param msg 
 */
export const updateUserMessage = (nextside:number,msg:UserHistory) => {
    store.setStore(`userHistoryMap/${msg.hIncid}`,msg.msg,false);
    let chat = store.getStore(`userChatMap/${msg.hIncid.split(':')[0]}`, []);
    chat.push(msg.msg);
    store.setStore(`userChatMap/${msg.hIncid.split(':')[0]}`,chat);    
    pushLastChat([nextside, msg.msg.time]);    
}

/**
 * 
 * @param value 
 */
const pushLastChat = (value:[number,number]) => {
    var lastChat = store.getStore(`lastChat`, []);
    lastChat.splice(lastChat.findIndex(item => item[0] == value[0]), 1)
    lastChat.push(value);
    store.setStore(`lastChat`,lastChat);
}