/**
 * 初始化store
 */
import { UserHistory, UserHistoryCursor } from '../../../server/data/db/message.s';
import { GENERATOR_TYPE, UserInfo } from '../../../server/data/db/user.s';
import { getUserHistory } from '../../../server/data/rpc/basic.p';
import { UserHistoryArray, UserHistoryFlag } from '../../../server/data/rpc/basic.s';
import { getUserHistoryCursor } from '../../../server/data/rpc/message.p';
import { genHIncId, genUserHid } from '../../../utils/util';
import { clientRpcFunc } from '../net/init';
import { getFile, initFileStore, writeFile } from './lcstore';
import { updateUserMessage } from './parse';
import * as store from './store';

/**
 * 更新当前用户的本地数据
 */
export const initAccount = () => {
    initFileStore().then(() => {
        const sid = store.getStore('uid');
        if (!sid) return;
        getFile(sid, (value) => {
            if (!value) return;
            store.setStore('userHistoryMap',value.userHistoryMap || new Map(), false);
            store.setStore('userChatMap',value.userChatMap || new Map(), false);
            store.setStore('friendLinkMap',value.friendLinkMap || new Map(), false);
            store.setStore('userInfoMap',value.userInfoMap || new Map(), false);
            store.setStore('lastChat',value.lastChat || []);

            console.log('store init success',store);
        }, () => {
            console.log('read error');
        });
    });
    
};

/**
 * 请求所有好友发的消息历史记录
 */
export const getFriendHistory = (elem:UserInfo) => {
    const sid = store.getStore('uid');
    const hid = genUserHid(sid,elem.uid);
    if (sid === elem.uid) return;

    const userflag = new UserHistoryFlag();
    userflag.rid = elem.uid;
    const hIncIdArr = store.getStore(`userChatMap/${hid}`,[]);
    userflag.hIncId = hIncIdArr && hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
    
    const lastRead = {
        msgId:userflag.hIncId,
        msgType:GENERATOR_TYPE.USER
    };
    if (!userflag.hIncId) {  // 如果本地没有记录，则请求后端存的游标
        clientRpcFunc(getUserHistoryCursor,elem.uid,(r:UserHistoryCursor) => {
            if (r) {
                lastRead.msgId = genHIncId(hid,r.cursor);
                store.setStore(`lastRead/${elem.uid}`,lastRead); // 异步请求，必须在回调函数中赋值
                // console.error('uid: ',elem.uid,'lastread ',lastRead);
            }
        });
    } else {
        store.setStore(`lastRead/${elem.uid}`,lastRead);
    } 
    
    clientRpcFunc(getUserHistory,userflag,(r:UserHistoryArray) => {
        // console.error('uuid: ',elem.uid,'initStore getFriendHistory',r);
        if (r.newMess > 0) {
            r.arr.forEach(element => {
                updateUserMessage(userflag.rid,element);
            });
        }
    });
        
};

/**
 * 聊天数据变化
 */
export const accountsChange = () => {
    const id = store.getStore('uid');
    getFile(id,(value) => {
        if (!value) {
            value = {};
        }
        value.userHistoryMap = store.getStore('userHistoryMap'); // 单人聊天历史记录变化
        value.userChatMap = store.getStore('userChatMap');  // 单人聊天历史记录索引变化
        value.lastChat = store.getStore('lastChat');  // 最近聊天记录
        writeFile(id,value);
    },() => {
        console.log('read error');
    });
    
};

/**
 * 好友数据变化
 */
export const friendChange = () => {
    const id = store.getStore('uid');
    getFile(id,(value) => {
        if (!value) {
            value = {};
        }
        value.friendLinkMap = store.getStore('friendLinkMap'); // 好友链接
        value.userInfoMap = store.getStore('userInfoMap');  // 用户信息
        writeFile(id,value);
    },() => {
        console.log('read error');
    });
};