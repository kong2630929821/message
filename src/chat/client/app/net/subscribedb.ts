/**
 * 订阅后端数据库,也是通过mqtt方式实现的
 */

// ================================================================= 导入
import { BonBuffer } from '../../../../pi/util/bon';
import { ab2hex } from '../../../../pi/util/util';
import { DEFAULT_ERROR_NUMBER, DEFAULT_ERROR_STR, WARE_NAME } from '../../../server/data/constant';
import { AddressInfo } from '../../../server/data/db/extra.s';
import { GroupInfo, GroupUserLink } from '../../../server/data/db/group.s';
import { AnnounceHistory, GroupHistory, MsgLock, UserHistory } from '../../../server/data/db/message.s';
import { AccountGenerator, Contact, FriendLink, UserCredential, UserInfo } from '../../../server/data/db/user.s';
import { watchAccountGenerator, watchAddressInfo, watchAnnounceHistory, watchContact,watchFriendLink, watchGroupHistory, watchGroupInfo, watchGroupUserLink,watchMsgLock, watchUserCredential, watchUserHistory, watchUserInfo } from '../../../server/data/rpc/dbWatcher.p';
import * as store from '../data/store';
import { clientRpcFunc, subscribe, unSubscribe } from './init';

// ================================================================= 导出

/**
 * 群组信息
 * @param gid group id
 */
export const subscribeGroupInfo = (gid: number,cb) => {
    subscribeTable(watchGroupInfo,'gid',gid,DEFAULT_ERROR_NUMBER,GroupInfo,'groupInfoMap',cb);
};
/**
 * 取消订阅群组信息
 * @param gid group id
 */
export const unSubscribeGroupInfo = (gid: number) => {
    unSubscribeTable(gid,GroupInfo);
};

/**
 * 群组中的用户信息
 * @param guid group user id
 */
export const subscribeGroupUserLink = (guid: string,cb) => {
    subscribeTable(watchGroupUserLink,'guid',guid,DEFAULT_ERROR_STR,GroupUserLink,'groupUserLinkMap',cb);    
};

/**
 * 用户历史记录
 * @param hIncId history increament id
 */
export const subscribeUserHistory = (hIncId: string,cb) => {
    subscribeTable(watchUserHistory,'hIncId',hIncId,DEFAULT_ERROR_STR,UserHistory,'userHistoryMap',cb);
};

/**
 * 群组历史记录
 * @param hIncId history increament id
 */
export const subscribeGroupHistory = (hIncId: string,cb) => {
    subscribeTable(watchGroupHistory,'hIncId',hIncId,DEFAULT_ERROR_STR,GroupHistory,'groupHistoryMap',cb);
};

/**
 * 所有公告
 * @param aIncId Announce increament id
 */
export const subscribeAnnounceHistory = (aIncId: string,cb) => {
    subscribeTable(watchAnnounceHistory,'aIncId',aIncId,DEFAULT_ERROR_STR,AnnounceHistory,'announceHistoryMap',cb);
};

/**
 * 消息锁
 * @param hid history increament id
 */
export const subscribeMsgLock = (hid: string, cb) => {
    subscribeTable(watchMsgLock,'hid',hid,DEFAULT_ERROR_NUMBER,MsgLock,'msgLockMap',cb);    
};

/**
 * 用户本人的基本信息
 * @param uid user id
 */
export const subscribeUserInfo = (uid: number, cb) => {
    subscribeTable(watchUserInfo,'uid',uid,DEFAULT_ERROR_NUMBER,UserInfo,'userInfoMap',cb);        
};

/**
 * 取消订阅用户本人的基本信息
 * @param uid user id
 */
export const unSubscribeUserInfo = (uid: number) => {
    unSubscribeTable(uid,UserInfo);        
};

/**
 * User credential table
 * @param uid user id
 */
export const subscribeUserCredential = (uid: number, cb) => {
    subscribeTable(watchUserCredential,'uid',uid,DEFAULT_ERROR_NUMBER,UserCredential,'userCredentialMap',cb);        
};

/**
 * User account generator
 * @param index index
 */
export const subscribeAccountGenerator = (index: String,cb) => {
    subscribeTable(watchAccountGenerator,'index',index,DEFAULT_ERROR_STR,AccountGenerator,'accountGeneratorMap',cb);            
};

/**
 * 好友链接信息
 * @param uuid user:user
 */
export const subscribeFriendLink = (uuid: string, cb) => {
    subscribeTable(watchFriendLink,'uuid',uuid,DEFAULT_ERROR_STR,FriendLink,'friendLinkMap',cb);            
};

/**
 * 联系人信息
 * @param uid uid
 */
export const subscribeContact = (uid: number, cb, diffcb) => {
    subscribeTable(watchContact,'uid',uid,DEFAULT_ERROR_NUMBER,Contact,'contactMap',cb, diffcb);            
};

/**
 * 地址信息
 * @param uid uid
 */
export const subscribeAddressInfo = (uid: number, cb) => {
    subscribeTable(watchAddressInfo,'uid',uid,DEFAULT_ERROR_NUMBER,AddressInfo,'addressInfoMap',cb);    
};

// ================================================================= 本地

/**
 * 一个通用的订阅数据结构
 * @param method method Name
 * @param keyName key Name
 * @param keyValue value 
 * @param defaultKeyValue default value 
 * @param struct struct 
 * @param mapName map Name
 * @param cb callback
 * @param beforeStoreCb 在修改数据库之前先调用这个函数，专门用户新旧数据的比较
 */
const subscribeTable = (method:string, keyName:string, keyValue:any, defaultKeyValue:any, struct:any, mapName:store.MapName, cb:(r:any) => void, beforeStoreCb?:(r:any) => void) => {
    clientRpcFunc(method, keyValue, (r: any) => {
        updateMap(r);
        const bonKeyValue = ab2hex(new BonBuffer().write(keyValue).getBuffer());
        subscribe(`${WARE_NAME}.${struct._$info.name}.${bonKeyValue}`, struct, (r: any) => {
            updateMap(r);
        });
    });    

    const updateMap = (r:any) => {
        beforeStoreCb && beforeStoreCb(r);
        store.setStore(`${mapName}/${keyValue}`,r);
        cb && cb(r);
    };
};

/**
 * 一个通用的取消订阅数据结构
 * @param keyValue value 
 * @param struct struct 
 */
const unSubscribeTable = (keyValue:any, struct:any) => {
    const bonKeyValue = ab2hex(new BonBuffer().write(keyValue).getBuffer());
    const topic =  `file.${struct._$info.name}.${bonKeyValue}`;
    unSubscribe(topic);
};