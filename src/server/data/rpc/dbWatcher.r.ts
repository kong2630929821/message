/**
 * 前端主动监听后端数据库的变化
 */
// ================================================================= 导入
import { GroupInfo, GroupUserLink} from "../db/group.s";
import { UserHistory, GroupHistory, AnnounceHistory, MsgLock} from "../db/message.s";
import { UserInfo, UserCredential, AccountGenerator, FriendLink, Contact } from "../db/user.s";
import { AddressInfo } from "../db/extra.s";
import { ServerNode } from '../../../pi_pt/rust/mqtt/server';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { setMqttTopic } from '../../../pi_pt/rust/pi_serv/js_net';
import { toBonBuffer} from "../../../utils/util";
import { Bucket } from "../../../utils/db";
import * as CONSTANT from '../constant';

// ================================================================= 导出

/**
 * 群组信息
 * @param gid 
 */
//#[rpc=rpcServer]
export const watchGroupInfo = (gid:number): GroupInfo => {
    return watchInfo("gid", gid, GroupInfo, -1);
}

/**
 * 群组中的用户信息
 * @param guid 
 */
//#[rpc=rpcServer]
export const watchGroupUserLink = (guid: string): GroupUserLink => {
    return watchInfo("guid", guid, GroupUserLink, "-1");
}

/**
 * 用户历史记录
 * @param hIncid 
 */
//#[rpc=rpcServer]
export const watchUserHistory = (hIncid: string): UserHistory => {    
    return watchInfo("hIncid", hIncid, UserHistory, "-1");
}

/**
 * 群组历史记录
 * @param hIncid 
 */
//#[rpc=rpcServer]
export const watchGroupHistory = (hIncid: string): GroupHistory => {    
    return watchInfo("hIncid", hIncid, GroupHistory, "-1");
}

/**
 * 所有公告
 * @param aIncId 
 */
//#[rpc=rpcServer]
export const watchAnnounceHistory = (aIncId: string): AnnounceHistory => {
    return watchInfo("aIncId", aIncId, AnnounceHistory, "-1");
}

/**
 * 消息锁
 * @param hid 
 */
//#[rpc=rpcServer]
export const watchMsgLock = (hid: number): MsgLock => {
    return watchInfo("hid", hid, MsgLock, -1);
}

/**
 * 用户本人的基本信息
 * @param uid 
 */
//#[rpc=rpcServer]
export const watchUserInfo = (uid: number): UserInfo => {
    return watchInfo("uid", uid, UserInfo, -1);
}

/**
 * User credential table
 * @param uid 
 */
//#[rpc=rpcServer]
export const watchUserCredential = (uid: number): UserCredential => {
    return watchInfo("uid", uid, UserCredential, -1);
}

/**
 * User account generator
 * @param index 
 */
//#[rpc=rpcServer]
export const watchAccountGenerator = (index: String): AccountGenerator => {
    return watchInfo("index", index, UserCredential, "-1");
}

/**
 * 好友链接信息
 * @param uuid 
 */
//#[rpc=rpcServer]
export const watchFriendLink = (uuid: string): FriendLink => {
    return watchInfo("uuid", uuid, FriendLink, "-1");
}

/**
 * 联系人信息
 * @param uid 
 */
//#[rpc=rpcServer]
export const watchContact = (uid: number): Contact => {
    return watchInfo("uid", uid, Contact, -1);
}

/**
 * 地址信息
 * @param uid 
 */
//#[rpc=rpcServer]
export const watchAddressInfo = (uid: number): AddressInfo => {
    return watchInfo("uid", uid, AddressInfo, -1);
}


// ================================================================= 本地

/**
 * 获取mqttServer
 */
const getMqttServer = () => {
    const mqttServer: ServerNode = getEnv().getNativeObject('mqttServer');
    return mqttServer
}

/**
 * 一个通用的数据库监听器函数
 * @param keyName 
 * @param keyValue 
 * @param tableStruct 
 * @param defaultValue 
 */
export const watchInfo = (keyName:string, keyValue:any, tableStruct:any, keyDefaultValue:any):any => {
    //监听数据库
    const mqttServer = getMqttServer();
    keyValue = toBonBuffer(keyValue);
    setMqttTopic(mqttServer, `${CONSTANT.WARE_NAME}.${tableStruct._$info.name}.${keyValue}`, true, true); 
    //返回当前值
    const dbMgr = getEnv().getDbMgr();
    const infoBucket = new Bucket(CONSTANT.WARE_NAME, tableStruct._$info.name, dbMgr);   
    let info = infoBucket.get(keyValue)[0] || new tableStruct;
    info[keyName] = info[keyName] || keyDefaultValue;
    return info;
}