/**
 * 对后端推送的数据做一些处理，然后放入数据库
 */
import { GroupHistory, MSG_TYPE, UserHistory } from '../../../server/data/db/message.s';
import { GENERATOR_TYPE } from '../../../server/data/db/user.s';
import { getHidFromhIncId } from '../../../utils/util';
import * as store from './store';
/**
 * 更新userHistoryMap/userChatMap,lastChat
 * @param msg UserHistory
 */
export const updateUserMessage = (nextside:number,msg:UserHistory) => {
    store.setStore(`userHistoryMap/${msg.hIncId}`,msg.msg);
    const chat = store.getStore(`userChatMap/${getHidFromhIncId(msg.hIncId)}`, []);
    chat.push(msg.hIncId);
    store.setStore(`userChatMap/${getHidFromhIncId(msg.hIncId)}`,chat);    
    pushLastChat([nextside, msg.msg.time, GENERATOR_TYPE.USER]);    
};

export const updateGroupMessage = (gid:number,msg:GroupHistory) => {
    // if (msg.msg.mtype === MSG_TYPE.NOTICE) {
    //     return ;
    // }
    store.setStore(`groupHistoryMap/${msg.hIncId}`,msg.msg);
    const chat = store.getStore(`groupChatMap/${getHidFromhIncId(msg.hIncId)}`, []);
    chat.push(msg.hIncId);
    store.setStore(`groupChatMap/${getHidFromhIncId(msg.hIncId)}`,chat);    
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
    lastChat.unshift(value); // 向前压入数组中
    store.setStore(`lastChat`,lastChat);
};