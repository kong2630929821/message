/**
 * 数据存储
 */

// ============================================ 导入
import { HandlerMap } from '../../../pi/util/event';
import { depCopy } from "../../../utils/util";
import { GroupInfo, GroupUserLink } from "../../../server/data/db/group.s";
import { UserHistory, GroupHistory, AnnounceHistory, MsgLock } from "../../../server/data/db/message.s";
import { UserInfo, UserCredential, AccountGenerator, FriendLink, Contact } from "../../../server/data/db/user.s";
import { AddressInfo } from "../../../server/data/db/extra.s";

// ============================================ 导出

/**
 * 查找特定的值
 * @param keyName 
 * @param id 
 */
export const find = (keyName: KeyName, id?: any): any => {
    if (!id) {
        const value = store[keyName];
        if (!(value instanceof Map)) {
            return <any>value instanceof Object ? depCopy(value) : value;
        }
        const arr = [];
        for (const [, v] of value) {
            arr.push(v);
        }
        return depCopy(arr);
    }
    const value = (<any>store[keyName]).get(id);
    if (value instanceof Map) {
        const result = value.get(id);

        return result && depCopy(result);
    } else {
        return value && depCopy(value);
    }
};

/**
 * 获取原始数据
 * @param keyname 
 */
export const getBorn = (keyname) => {
    return store[keyname];
};

/**
 * 更新store
 * @param keyName 
 * @param data 
 * @param notified 
 */
export const updateStore = (keyName: KeyName, data: any, notified: boolean = true): void => {
    store[keyName] = data;
    if (notified) handlerMap.notify(keyName, [data]);
};

/**
 * 通知更新
 * @param keyName 
 * @param data 
 */
export const notify = (keyName: KeyName, data?: any) => {
    handlerMap.notify(keyName, [data]);
};

/**
 * 注册监听特定的数据
 * @param keyName 
 * @param cb 
 */
export const register = (keyName: KeyName, cb: Function): void => {
    handlerMap.add(keyName, <any>cb);
};

/**
 * 取消注册
 * @param keyName 
 * @param cb 
 */
export const unregister = (keyName: KeyName, cb: Function): void => {
    handlerMap.remove(keyName, <any>cb);
};

/**
 * store初始化
 */
export const initStore = () => {

}

/**
 * Store的声明
 */
export interface Store {
    uid:number,
    groupInfoMap: Map<number, GroupInfo>,//gid
    groupUserLinkMap: Map<string, GroupUserLink>,//guid
    userHistoryMap: Map<string, UserHistory>,//hidinc
    groupHistoryMap: Map<string, GroupHistory>,//hidinc
    announceHistoryMap: Map<string, AnnounceHistory>,//aidinc
    msgLockMap: Map<number, MsgLock>,//LOCK
    userInfoMap: Map<number, UserInfo>,//uid
    userCredentialMap: Map<number, UserCredential>, //todo
    accountGeneratorMap: Map<string, AccountGenerator>,//todo
    friendLinkMap: Map<string, FriendLink>,//uuid
    contactMap: Map<number, Contact>,//uid
    addressInfoMap: Map<number, AddressInfo>//uid
    userChatMap:Map<number, Array<string>>//hid,hidinc,递增存储
    groupChatMap:Map<number, Array<string>>//hid,hidinc
    lastChat:Array<[number,number]>//gid|uid,time,最大50个元素的数组，前端自己生产的数组，每条信息都需要更新该表
}

// ============================================ 本地

// 本质上是主键
type KeyName = MapName;
export type MapName = "groupInfoMap" | "groupUserLinkMap" | "userHistoryMap" | "groupHistoryMap" | "announceHistoryMap" | "msgLockMap" | "userInfoMap" | "userCredentialMap" | "accountGeneratorMap" | "friendLinkMap" | "contactMap" | "addressInfoMap";

const store = <Store>{
    uid:null,
    groupInfoMap: new Map(),
    groupUserLinkMap: new Map(),
    userHistoryMap: new Map(),
    groupHistoryMap: new Map(),
    announceHistoryMap: new Map(),
    msgLockMap: new Map(),
    userInfoMap: new Map(),
    userCredentialMap: new Map(), 
    accountGeneratorMap: new Map(),
    friendLinkMap: new Map(),
    contactMap: new Map(),
    addressInfoMap: new Map()
}
// ============================================ 可执行
const handlerMap: HandlerMap = new HandlerMap();