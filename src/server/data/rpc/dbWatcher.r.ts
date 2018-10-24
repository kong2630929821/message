/**
 * 前端主动监听后端数据库的变化
 */
// ================================================================= 导入
import { GroupInfo, GroupUserLink, Guid } from "../db/group.s";
import { UserHistory, GroupHistory, AnnounceHistory, MsgLock, HIncId, AIncId } from "../db/message.s";
import { UserInfo, UserCredential, AccountGenerator, FriendLink, Contact, Uuid } from "../db/user.s";
import { AddressInfo } from "../db/extra.s";
import { ServerNode } from '../../../pi_pt/rust/mqtt/server';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { setMqttTopic } from '../../../pi_pt/rust/pi_serv/js_net';
import { WARE_NAME } from "../../data/constant"
import { toBonBuffer} from "../../../utils/util";

// ================================================================= 导出

/**
 * 群组信息
 * @param gid 
 */
//#[rpc]
export const watchGroupInfo = (gid: number): GroupInfo => {
    const mqttServer = getMqttServer();
    let key = toBonBuffer(gid);
    setMqttTopic(mqttServer, `${WARE_NAME}.${GroupInfo._$info.name}.${key}`, true, true);    
    return
}

/**
 * 群组中的用户信息
 * @param guid 
 */
//#[rpc]
export const watchGroupUserLink = (guid: Guid): GroupUserLink => {
    const mqttServer = getMqttServer();
    let key = toBonBuffer(guid);
    setMqttTopic(mqttServer, `${WARE_NAME}.${GroupUserLink._$info.name}.${key}`, true, true);
    return
}

/**
 * 用户历史记录
 * @param hIncid 
 */
//#[rpc]
export const watchUserHistory = (hIncid: HIncId): UserHistory => {
    const mqttServer = getMqttServer();
    let key = toBonBuffer(hIncid);
    setMqttTopic(mqttServer, `${WARE_NAME}.${UserHistory._$info.name}.${key}`, true, true);
    return
}

/**
 * 群组历史记录
 * @param hIncid 
 */
//#[rpc]
export const watchGroupHistory = (hIncid: HIncId): GroupHistory => {
    const mqttServer = getMqttServer();
    let key = toBonBuffer(hIncid);
    setMqttTopic(mqttServer, `${WARE_NAME}.${GroupHistory._$info.name}.${key}`, true, true);
    return
}

/**
 * 所有公告
 * @param aIncId 
 */
//#[rpc]
export const watchAnnounceHistory = (aIncId: AIncId): AnnounceHistory => {
    const mqttServer = getMqttServer();
    let key = toBonBuffer(aIncId);
    setMqttTopic(mqttServer, `${WARE_NAME}.${AnnounceHistory._$info.name}.${key}`, true, true);
    return
}

/**
 * 消息锁
 * @param hid 
 */
//#[rpc]
export const watchMsgLock = (hid: number): MsgLock => {
    const mqttServer = getMqttServer();
    let key = toBonBuffer(hid);
    setMqttTopic(mqttServer, `${WARE_NAME}.${MsgLock._$info.name}.${key}`, true, true);
    return
}

/**
 * 用户本人的基本信息
 * @param uid 
 */
//#[rpc]
export const watchUserInfo = (uid: number): UserInfo => {
    const mqttServer = getMqttServer();
    let key = toBonBuffer(uid);
    setMqttTopic(mqttServer, `${WARE_NAME}.${UserInfo._$info.name}.${key}`, true, true);
    return
}

/**
 * User credential table
 * @param uid 
 */
//#[rpc]
export const watchUserCredential = (uid: number): UserCredential => {
    const mqttServer = getMqttServer();
    let key = toBonBuffer(uid);
    setMqttTopic(mqttServer, `${WARE_NAME}.${UserCredential._$info.name}.${key}`, true, true);
    return
}

/**
 * User account generator
 * @param index 
 */
//#[rpc]
export const watchAccountGenerator = (index: String): AccountGenerator => {
    const mqttServer = getMqttServer();
    let key = toBonBuffer(index);
    setMqttTopic(mqttServer, `${WARE_NAME}.${AccountGenerator._$info.name}.${key}`, true, true);
    return
}

/**
 * 好友链接信息
 * @param uuid 
 */
//#[rpc]
export const watchFriendLink = (uuid: Uuid): FriendLink => {
    const mqttServer = getMqttServer();
    let key = toBonBuffer(uuid);
    setMqttTopic(mqttServer, `${WARE_NAME}.${FriendLink._$info.name}.${key}`, true, true);
    return
}

/**
 * 联系人信息
 * @param uid 
 */
//#[rpc]
export const watchContact = (uid: number): Contact => {
    const mqttServer = getMqttServer();
    let key = toBonBuffer(uid);
    setMqttTopic(mqttServer, `${WARE_NAME}.${Contact._$info.name}.${key}`, true, true);
    return
}

/**
 * 地址信息
 * @param uid 
 */
//#[rpc]
export const watchAddressInfo = (uid: number): AddressInfo => {
    const mqttServer = getMqttServer();
    let key = toBonBuffer(uid);
    setMqttTopic(mqttServer, `${WARE_NAME}.${AddressInfo._$info.name}.${key}`, true, true);
    return
}


// ================================================================= 本地

/**
 * 获取mqttServer
 */
const getMqttServer = () => {
    const mqttServer: ServerNode = getEnv().getNativeObject('mqttServer');
    return mqttServer
}

