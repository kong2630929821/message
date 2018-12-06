/**
 * 初始化store
 */
import { FriendLink, GENERATOR_TYPE, LastReadMsgId } from '../../../server/data/db/user.s';
import { getUserHistory } from '../../../server/data/rpc/basic.p';
import { UserHistoryArray, UserHistoryFlag } from '../../../server/data/rpc/basic.s';
import { getUidFromUuid } from '../../../utils/util';
import { clientRpcFunc } from '../net/init';
import { getFile, initFileStore, writeFile } from './lcstore';
import { updateUserMessage } from './parse';
import * as store from './store';

/**
 * 更新当前用户的本地数据
 */
export const initAccount = () => {
    initFileStore().then(() => {
        const uid = store.getStore('uid');
        if (!uid) return;
        getFile(uid, (value) => {
            if (!value) return;
            store.setStore('userHistoryMap',value.userHistoryMap || new Map(), false);
            store.setStore('userChatMap',value.userChatMap || new Map(), false);
            store.setStore('friendLinkMap',value.friendLinkMap || new Map(), false);
            store.setStore('userInfoMap',value.userInfoMap || new Map(), false);
            store.setStore('lastChat',value.lastChat || []);

            store.getStore('friendLinkMap',new Map()).forEach((elem:FriendLink) => {
                getFriendHistory(elem);
            });
            console.log('store init success',store);
        }, () => {
            console.log('read error');
        });
    });
    
};

/**
 * 请求所有好友发的消息历史记录
 */
export const getFriendHistory = (elem:FriendLink) => {
    
    const userflag = new UserHistoryFlag();
    userflag.rid = getUidFromUuid(elem.uuid);
    const hIncIdArr = store.getStore('userChatMap',new Map()).get(elem.hid);
    userflag.hIncId = hIncIdArr && hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : '0';
    
    const lastRead = new LastReadMsgId();
    lastRead.msgId = userflag.hIncId;
    lastRead.msgType = GENERATOR_TYPE.USER;
    store.setStore(`lastRead/${userflag.rid}`,lastRead);
    clientRpcFunc(getUserHistory,userflag,(r:UserHistoryArray) => {
        console.error('initStore getFriendHistory》》》》》',r);
        r.arr.forEach(element => {
            updateUserMessage(userflag.rid,element);
        });
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