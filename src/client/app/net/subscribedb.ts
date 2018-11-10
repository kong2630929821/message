/**
 * 订阅后端数据库,也是通过mqtt方式实现的
 */

// ================================================================= 导入
import { watchGroupInfo, watchGroupUserLink, watchUserHistory, watchGroupHistory } from "../../../server/data/rpc/dbWatcher.p"
import { watchAnnounceHistory, watchMsgLock, watchUserInfo, watchUserCredential } from "../../../server/data/rpc/dbWatcher.p"
import { watchAccountGenerator, watchFriendLink, watchContact, watchAddressInfo } from "../../../server/data/rpc/dbWatcher.p"
import { GroupInfo, GroupUserLink} from "../../../server/data/db/group.s";
import { UserHistory, GroupHistory, AnnounceHistory, MsgLock} from "../../../server/data/db/message.s";
import { UserInfo, UserCredential, AccountGenerator, FriendLink, Contact } from "../../../server/data/db/user.s";
import { AddressInfo } from "../../../server/data/db/extra.s";
import { clientRpcFunc, subscribe } from "./init";
import { toBonBuffer } from "../../../utils/util";
import { WARE_NAME } from "../../../server/data/constant";
import * as store from "../data/store";
import { ab2hex } from '../../../pi/util/util';
import { BonBuffer } from '../../../pi/util/bon';

// ================================================================= 导出

/**
 * 群组信息
 * @param gid 
 */
export const subscribeGroupInfo = (gid: number,cb) => {
    subscribeTable(watchGroupInfo,"gid",gid,-1,GroupInfo,"groupInfoMap",cb)
}

/**
 * 群组中的用户信息
 * @param guid 
 */
export const subscribeGroupUserLink = (guid: string,cb) => {
    subscribeTable(watchGroupUserLink,"guid",guid,"-1",GroupUserLink,"groupUserLinkMap",cb)    
}

/**
 * 用户历史记录
 * @param hIncid 
 */
export const subscribeUserHistory = (hIncid: string,cb) => {
    subscribeTable(watchUserHistory,"hIncid",hIncid,"-1",UserHistory,"userHistoryMap",cb)
}

/**
 * 群组历史记录
 * @param hIncid 
 */
export const subscribeGroupHistory = (hIncid: string,cb) => {
    subscribeTable(watchGroupHistory,"hIncid",hIncid,"-1",GroupHistory,"groupHistoryMap",cb)
}

/**
 * 所有公告
 * @param aIncId 
 */
export const subscribeAnnounceHistory = (aIncId: string,cb) => {
    subscribeTable(watchAnnounceHistory,"aIncId",aIncId,"-1",AnnounceHistory,"announceHistoryMap",cb)
}

/**
 * 消息锁
 * @param hid 
 */
export const subscribeMsgLock = (hid: number, cb) => {
    subscribeTable(watchMsgLock,"hid",hid,-1,MsgLock,"msgLockMap",cb)    
}

/**
 * 用户本人的基本信息
 * @param uid 
 */
export const subscribeUserInfo = (uid: number, cb) => {
    subscribeTable(watchUserInfo,"uid",uid,-1,UserInfo,"userInfoMap",cb)        
}

/**
 * User credential table
 * @param uid 
 */
export const subscribeUserCredential = (uid: number, cb) => {
    subscribeTable(watchUserCredential,"uid",uid,-1,UserCredential,"userCredentialMap",cb)        
}

/**
 * User account generator
 * @param index 
 */
export const subscribeAccountGenerator = (index: String,cb) => {
    subscribeTable(watchAccountGenerator,"index",index,"-1",AccountGenerator,"accountGeneratorMap",cb)            
}

/**
 * 好友链接信息
 * @param uuid 
 */
export const subscribeFriendLink = (uuid: string, cb) => {
    subscribeTable(watchFriendLink,"uuid",uuid,"-1",FriendLink,"friendLinkMap",cb)            
}

/**
 * 联系人信息
 * @param uid 
 */
export const subscribeContact = (uid: number, cb) => {
    subscribeTable(watchContact,"uid",uid,-1,Contact,"contactMap",cb)            
}

/**
 * 地址信息
 * @param uid 
 */
export const subscribeAddressInfo = (uid: number, cb) => {
    subscribeTable(watchAddressInfo,"uid",uid,-1,AddressInfo,"addressInfoMap",cb)    
}


// ================================================================= 本地

/**
 * 一个通用的订阅数据结构
 * @param method 
 * @param keyName 
 * @param keyValue 
 * @param defaultKeyValue 
 * @param struct 
 * @param mapName 
 * @param cb 
 */
const subscribeTable = (method:string, keyName:string, keyValue:any, defaultKeyValue:any, struct:any, mapName:store.MapName, cb:(r)=>void) => {
    clientRpcFunc(method, keyValue, (r: any) => {
        updateMap(r);
        const bonKeyValue = ab2hex(new BonBuffer().write(keyValue).getBuffer());
        subscribe(`${WARE_NAME}.${struct._$info.name}.${bonKeyValue}`, struct, (r: any) => {
            updateMap(r);
        })
    })    

    const updateMap = (r:any) => {
        store.setStore(`${mapName}/${keyValue}`,r)
        cb&&cb(r);
    }
}