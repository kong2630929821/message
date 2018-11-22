/**
 * 对后端推送的数据做一些处理，然后放入数据库
 */
import { UserHistory } from '../../../server/data/db/message.s';
import * as store from './store';
/**
 * 更新userHistoryMap/userChatMap,lastChat
 * @param msg UserHistory
 */
export const updateUserMessage = (nextside:number,msg:UserHistory) => {
    store.setStore(`userHistoryMap/${msg.hIncId}`,msg.msg,false);
    const chat = store.getStore(`userChatMap/${msg.hIncId.split(':')[0]}`, []);
    chat.push(msg.hIncId);
    store.setStore(`userChatMap/${msg.hIncId.split(':')[0]}`,chat);    
    pushLastChat([nextside, msg.msg.time]);    
};

/**
 * 
 * @param value  chat 
 */
const pushLastChat = (value:[number,number]) => {
    const lastChat = store.getStore(`lastChat`, []);
    const index = lastChat.findIndex(item => item[0] === value[0]);
    index > -1 && lastChat.splice(index, 1);    
    lastChat.push(value);
    store.setStore(`lastChat`,lastChat);
};