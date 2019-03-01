/**
 * 对后端推送的数据做一些处理，然后放入数据库
 */
import { Announcement, GroupHistory, GroupMsg, MSG_TYPE, UserHistory, UserMsg } from '../../../server/data/db/message.s';
import { GENERATOR_TYPE } from '../../../server/data/db/user.s';
import { genGroupHid, genUserHid, getHidFromhIncId } from '../../../utils/util';
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
        store.setStore(`announceHistoryMap/${msg.hIncId}`,msg.msg);
        if (msg.msg.mtype === MSG_TYPE.RENOTICE) { // 撤回公告
            const renotice = store.getStore(`announceHistoryMap/${msg.msg.msg}`,new Announcement());
            renotice.cancel = true;
            store.setStore(`announceHistoryMap/${msg.msg.msg}`,renotice);
        }
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
    const setting = store.getStore('setting',{ msgTop:[] });
    
    let topFg;  // 消息是否置顶
    let topLen;  // 置顶消息个数
    if (value[2] === GENERATOR_TYPE.USER) {  // 单聊消息
        const sid = store.getStore('uid');
        const hid = genUserHid(sid,value[0]);
        topFg = setting.msgTop.findIndex(item => item === hid) > -1;
        topLen = setting.msgTop.length;
        
    } else {  // 群聊消息
        const hid = genGroupHid(value[0]);
        topFg = setting.msgTop.findIndex(item => item === hid) > -1;
        topLen = setting.msgTop.length;
        
    }
    // 置顶消息不改变位置，不置顶消息放到置顶消息后
    if (!topFg) { 
        index > -1 && lastChat.splice(index, 1);  
        lastChat.splice(topLen, 0, value);
    } 
    store.setStore(`lastChat`,lastChat);
};