/**
 * 对后端推送的数据做一些处理，然后放入数据库
 */
import { GroupHistory, UserHistory } from '../../../server/data/db/message.s';
import { GENERATOR_TYPE } from '../../../server/data/db/user.s';
import { getHidFromInc } from '../../../utils/util';
import * as store from './store';
/**
 * 更新userHistoryMap/userChatMap,lastChat
 * @param msg UserHistory
 */
export const updateUserMessage = (nextside:number,msg:UserHistory) => {
    store.setStore(`userHistoryMap/${msg.hIncId}`,msg.msg,false);
    const chat = store.getStore(`userChatMap/${getHidFromInc(msg.hIncId)}`, []);
    chat.push(msg.hIncId);
    store.setStore(`userChatMap/${getHidFromInc(msg.hIncId)}`,chat);    
    pushLastChat([nextside, msg.msg.time, GENERATOR_TYPE.USER]);    
};

export const updateGroupMessage = (gid:number,msg:GroupHistory) => {
    store.setStore(`groupHistoryMap/${msg.hIncId}`,msg.msg,false);
    const chat = store.getStore(`groupChatMap/${getHidFromInc(msg.hIncId)}`, []);
    chat.push(msg.hIncId);
    store.setStore(`groupChatMap/${getHidFromInc(msg.hIncId)}`,chat);    
    pushLastChat([gid, msg.msg.time, GENERATOR_TYPE.GROUP]);    
};
/**
 * 
 * @param value  chat 
 */
const pushLastChat = (value:[number,number,GENERATOR_TYPE]) => {
    const lastChat = store.getStore(`lastChat`, []);
    const index = lastChat.findIndex(item => item[0] === value[0] && item[2] === value[2]);
    index > -1 && lastChat.splice(index, 1);    
    lastChat.push(value);
    store.setStore(`lastChat`,lastChat);
};