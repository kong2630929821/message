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

// ================================================================= 导出

/**
 * 群组信息
 * @param gid 
 */
export const subscribeGroupInfo = (gid: number) => {
    clientRpcFunc(watchGroupInfo, gid, (r: GroupInfo) => {
        //updateStore                        
    })
    let key = toBonBuffer(gid);
    subscribe(`${WARE_NAME}.${GroupInfo._$info.name}.${key}`, GroupInfo, (r: GroupInfo) => {
        //updateStore
    })
    return
}

/**
 * 群组中的用户信息
 * @param guid 
 */
export const subscribeGroupUserLink = (guid: string) => {
    clientRpcFunc(watchGroupInfo, guid, (r: GroupUserLink) => {
        //updateStore                        
    })
    let key = toBonBuffer(guid);
    subscribe(`${WARE_NAME}.${GroupUserLink._$info.name}.${key}`, GroupUserLink, (r: GroupUserLink) => {
        //updateStore
    })
    return
}

/**
 * 用户历史记录
 * @param hIncid 
 */
export const subscribeUserHistory = (hIncid: string) => {
    clientRpcFunc(watchGroupInfo, hIncid, (r: UserHistory) => {
        //updateStore                        
    })
    let key = toBonBuffer(hIncid);
    subscribe(`${WARE_NAME}.${UserHistory._$info.name}.${key}`, UserHistory, (r: UserHistory) => {
        //updateStore
    })
    return
}

/**
 * 群组历史记录
 * @param hIncid 
 */
export const subscribeGroupHistory = (hIncid: string) => {
    clientRpcFunc(watchGroupInfo, hIncid, (r: GroupHistory) => {
        //updateStore                        
    })
    let key = toBonBuffer(hIncid);
    subscribe(`${WARE_NAME}.${GroupHistory._$info.name}.${key}`, GroupHistory, (r: GroupHistory) => {
        //updateStore
    })
    return
}

/**
 * 所有公告
 * @param aIncId 
 */
export const subscribeAnnounceHistory = (aIncId: string) => {
    clientRpcFunc(watchGroupInfo, aIncId, (r: AnnounceHistory) => {
        //updateStore                        
    })
    let key = toBonBuffer(aIncId);
    subscribe(`${WARE_NAME}.${AnnounceHistory._$info.name}.${key}`, AnnounceHistory, (r: AnnounceHistory) => {
        //updateStore
    })
    return
}

/**
 * 消息锁
 * @param hid 
 */
export const subscribeMsgLock = (hid: number) => {
    clientRpcFunc(watchGroupInfo, hid, (r: MsgLock) => {
        //updateStore                        
    })
    let key = toBonBuffer(hid);
    subscribe(`${WARE_NAME}.${MsgLock._$info.name}.${key}`, MsgLock, (r: MsgLock) => {
        //updateStore
    })
    return
}

/**
 * 用户本人的基本信息
 * @param uid 
 */
export const subscribeUserInfo = (uid: number) => {
    clientRpcFunc(watchGroupInfo, uid, (r: UserInfo) => {
        //updateStore                        
    })
    let key = toBonBuffer(uid);
    subscribe(`${WARE_NAME}.${UserInfo._$info.name}.${key}`, UserInfo, (r: UserInfo) => {
        //updateStore
    })
    return
}

/**
 * User credential table
 * @param uid 
 */
export const subscribeUserCredential = (uid: number) => {
    clientRpcFunc(watchGroupInfo, uid, (r: UserCredential) => {
        //updateStore                        
    })
    let key = toBonBuffer(uid);
    subscribe(`${WARE_NAME}.${UserCredential._$info.name}.${key}`, UserCredential, (r: UserCredential) => {
        //updateStore
    })
    return
}

/**
 * User account generator
 * @param index 
 */
export const subscribeAccountGenerator = (index: String) => {
    clientRpcFunc(watchGroupInfo, index, (r: AccountGenerator) => {
        //updateStore                        
    })
    let key = toBonBuffer(index);
    subscribe(`${WARE_NAME}.${AccountGenerator._$info.name}.${key}`, AccountGenerator, (r: AccountGenerator) => {
        //updateStore
    })
    return
}

/**
 * 好友链接信息
 * @param uuid 
 */
export const subscribeFriendLink = (uuid: string) => {
    clientRpcFunc(watchGroupInfo, uuid, (r: FriendLink) => {
        //updateStore                        
    })
    let key = toBonBuffer(uuid);
    subscribe(`${WARE_NAME}.${FriendLink._$info.name}.${key}`, FriendLink, (r: FriendLink) => {
        //updateStore
    })
    return
}

/**
 * 联系人信息
 * @param uid 
 */
export const subscribeContact = (uid: number) => {
    clientRpcFunc(watchGroupInfo, uid, (r: Contact) => {
        //updateStore                        
    })
    let key = toBonBuffer(uid);
    subscribe(`${WARE_NAME}.${Contact._$info.name}.${key}`, Contact, (r: Contact) => {
        //updateStore
    })
    return
}

/**
 * 地址信息
 * @param uid 
 */
export const subscribeAddressInfo = (uid: number) => {
    clientRpcFunc(watchGroupInfo, uid, (r: AddressInfo) => {
        //updateStore                        
    })
    let key = toBonBuffer(uid);
    subscribe(`${WARE_NAME}.${AddressInfo._$info.name}.${key}`, AddressInfo, (r: AddressInfo) => {
        //updateStore
    })
    return
}