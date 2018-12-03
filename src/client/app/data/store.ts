/**
 * 数据存储
 */

// ============================================ 导入
import { HandlerMap } from '../../../pi/util/event';
import { AddressInfo } from '../../../server/data/db/extra.s';
import { GroupInfo, GroupUserLink } from '../../../server/data/db/group.s';
import { AnnounceHistory, GroupHistory, GroupMsg, MsgLock, UserHistory, UserMsg } from '../../../server/data/db/message.s';
import { AccountGenerator, Contact, FriendLink, GENERATOR_TYPE, UserCredential, UserInfo } from '../../../server/data/db/user.s';
import { getFile, initFileStore, writeFile } from './lcstore';

// ============================================ 导出

/**
 * 根据路径获取数据
 */
export const getStore = (path: string, defaultValue = undefined) => {
    let ret = store;
    for (const key of path.split('/')) {
        if (key in ret) {
            ret = ret[key];
        } else if (ret instanceof Map) {
            ret = ret.get(key);
        } else {
            // 路径中有和store内部不同的键，肯定是bug
            // tslint:disable-next-line:prefer-template
            throw new Error('getStore Failed, path = ' + path);
        }
    }

    return ret || defaultValue;
};

/**
 * 更新store并通知
 */
export const setStore = (path: string, data: any, notified = true) => {
    const path2value = (...args) => {
        let returnValue = <any>store;
        for (let i = 0; i < args[0].length; i++) {
            returnValue = returnValue[args[0][i]];
        }
        
        return returnValue;
    };
    const keyArr = path.split('/');
    // 原有的最后一个键
    const lastKey = keyArr.pop();

    let parent = store;
    for (const key of keyArr) {
        if (key in parent) {
            parent = parent[key];
        } else if (parent instanceof Map) {
            parent = parent.get(key);
        } else {
            // 路径中有和store内部不同的键，肯定是bug
            // tslint:disable-next-line:prefer-template
            throw new Error('setStore Failed, path = ' + path);
        }
    }
    if (parent instanceof Map) {
        parent.set(lastKey, data);
    } else {
        parent[lastKey] = data;
    }    
    /**
     * 写的不好，只能支持普通json和最后一层为map的情况，不支持map嵌套
     */
    if (notified) {
        handlerMap.notify(path, data);
        path = path.substring(0,path.lastIndexOf('/'));
        while (path.length > 0) {
            handlerMap.notify(path, path2value(path.split('/')));
            path = path.substring(0,path.lastIndexOf('/'));
        }        
    }
    
};

/**
 * 注册监听特定的数据
 * @param keyName the name of the key
 * @param cb callback
 */
export const register = (keyName: string, cb: Function): void => {
    handlerMap.add(keyName, <any>cb);
};

/**
 * 取消注册
 * @param keyName the name of the key
 * @param cb callback
 */
export const unregister = (keyName: string, cb: Function): void => {
    handlerMap.remove(keyName, <any>cb);
};

/**
 * store初始化
 */
export const initStore = () => {
    registerDataChange();
    store = {
        uid:null,
        groupInfoMap: new Map(),
        groupUserLinkMap: new Map(),
        userHistoryMap:new Map(),
        groupHistoryMap: new Map(),
        announceHistoryMap: new Map(),
        msgLockMap: new Map(),
        userInfoMap: new Map(),
        userCredentialMap: new Map(), 
        accountGeneratorMap: new Map(),
        friendLinkMap: new Map(),
        contactMap: new Map(),
        addressInfoMap: new Map(),
        userChatMap:new Map(),
        groupChatMap:new Map(),
        lastChat:[]
    };
};

/**
 * 更新当前用户的数据
 */
const initAccount = () => {
    initFileStore().then(() => {
        const uid = getStore('uid');
        if (!uid) return;
        getFile(uid, (value) => {
            if (!value) return;
            store.userHistoryMap = value.userHistoryMap || new Map();
            store.userChatMap = value.userChatMap || new Map();
            store.lastChat = value.lastChat || [];
            store.friendLinkMap = value.friendLinkMap || new Map();
            store.userInfoMap = value.userInfoMap || new Map();
            setStore('lastChat',store.lastChat);
            console.log('store init success',store);
        }, () => {
            console.log('read error');
        });
    });
    
};

/**
 * 注册监听事件
 */
const registerDataChange = () => {
    register('uid',() => {
        initAccount(); // 登陆成功后更新当前用户的历史数据
    });

    register('lastChat',() => {
        accountsChange();  // 新的聊天数据
    });
    
    register('userInfoMap',() => {
        friendChange();  // 好友数据更新
    });

    register('friendLinkMap',() => {
        friendChange();  // 好友数据更新
    });
};

/**
 * 聊天数据变化
 */
const accountsChange = () => {
    const id = getStore('uid');
    getFile(id,(value) => {
        if (!value) {
            value = {};
        }
        value.userHistoryMap = getStore('userHistoryMap'); // 单人聊天历史记录变化
        value.userChatMap = getStore('userChatMap');  // 单人聊天历史记录索引变化
        value.lastChat = getStore('lastChat');  // 最近聊天记录
        writeFile(id,value);
    },() => {
        console.log('read error');
    });
    
};

/**
 * 好友数据变化
 */
const friendChange = () => {
    const id = getStore('uid');
    getFile(id,(value) => {
        if (!value) {
            value = {};
        }
        value.friendLinkMap = getStore('friendLinkMap'); // 好友链接
        value.userInfoMap = getStore('userInfoMap');  // 用户信息
        writeFile(id,value);
    },() => {
        console.log('read error');
    });
};

/**
 * Store的声明
 */
export interface Store {
    uid:number;
    groupInfoMap: Map<number, GroupInfo>;// gid
    groupUserLinkMap: Map<string, GroupUserLink>;// guid
    userHistoryMap: Map<string, UserMsg>;// hidinc
    groupHistoryMap: Map<string, GroupMsg>;// hidinc
    announceHistoryMap: Map<string, AnnounceHistory>;// aidinc
    msgLockMap: Map<number, MsgLock>;// LOCK,前端暂时没用到
    userInfoMap: Map<number, UserInfo>;// uid
    userCredentialMap: Map<number, UserCredential>; // todo,前端暂时没用到
    accountGeneratorMap: Map<string, AccountGenerator>;// todo,前端暂时没用到
    friendLinkMap: Map<string, FriendLink>;// uuid
    contactMap: Map<number, Contact>;// uid
    addressInfoMap: Map<number, AddressInfo>;// uid,暂时没用到
    userChatMap:Map<string, string[]>;// hid,hidinc,递增存储
    groupChatMap:Map<string, string[]>;// hid,hidinc
    lastChat:[number,number,GENERATOR_TYPE][];// gid|uid,time,前端自己生产的数组，每条信息都需要更新该表
    // 其实time没啥意义，不一定是最近发信息的50条，比如有人离线了，很早就发送了信息，他的信息也会出现在这里
}

// ============================================ 本地

// 本质上是主键
type KeyName = MapName;
export type MapName = 'groupInfoMap' | 'groupUserLinkMap' | 'userHistoryMap' | 'groupHistoryMap' | 'announceHistoryMap' | 'msgLockMap' | 'userInfoMap' | 'userCredentialMap' | 'accountGeneratorMap' | 'friendLinkMap' | 'contactMap' | 'addressInfoMap';

export let store:Store;
// ============================================ 可执行
const handlerMap: HandlerMap = new HandlerMap();
initStore();