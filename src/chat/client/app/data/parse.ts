/**
 * 对后端推送的数据做一些处理，然后放入数据库
 */
import { AnnounceHistory, GroupHistory, GroupMsg, MSG_TYPE, UserHistory, UserMsg } from '../../../server/data/db/message.s';
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
    // const index = chat.indexOf(msg.hIncId);
    // if (index < 0) {
    chat.push(msg.hIncId);
    store.setStore(`userChatMap/${getHidFromhIncId(msg.hIncId)}`,chat);    
    // }

    if (msg.msg.mtype === MSG_TYPE.RECALL) { // 撤回消息内容本身是消息ID
        const reHincId = msg.msg.msg;
        const userhistory = store.getStore(`userHistoryMap/${reHincId}`,new UserMsg());
        userhistory.cancel = true;
        store.setStore(`userHistoryMap/${reHincId}`,userhistory);
    }
    pushLastChat([nextside, msg.msg.time, GENERATOR_TYPE.USER]);   
};

export const updateGroupMessage = (gid:number,msg:GroupHistory) => {
    if (msg.msg.mtype === MSG_TYPE.NOTICE || msg.msg.mtype === MSG_TYPE.RENOTICE) {
        const annouce = new AnnounceHistory();
        annouce.aIncId = msg.hIncId;
        annouce.announce = msg.msg;
        store.setStore(`announceHistoryMap/${msg.hIncId}`,annouce);
    } 
    store.setStore(`groupHistoryMap/${msg.hIncId}`,msg.msg);
    const chat = store.getStore(`groupChatMap/${getHidFromhIncId(msg.hIncId)}`, []);
    const index = chat.indexOf(msg.hIncId);
    if (index < 0) {
        chat.push(msg.hIncId);
        store.setStore(`groupChatMap/${getHidFromhIncId(msg.hIncId)}`,chat);    
    }
    if (msg.msg.mtype === MSG_TYPE.RECALL) { // 撤回消息内容本身是消息ID
        const reHincId = msg.msg.msg;
        const grouphistory = store.getStore(`groupHistoryMap/${reHincId}`,new GroupMsg());
        grouphistory.cancel = true;
        store.setStore(`groupHistoryMap/${reHincId}`,grouphistory);
    }
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