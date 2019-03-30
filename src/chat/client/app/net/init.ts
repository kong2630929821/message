/**
 * RPC， 远程方法调用
 * 采用 mqtt上定义的每会话的$req和$resp主题，来发送请求和接受响应
 * 建立网络响应客户端的
 */
declare var pi_modules;

// ================================================ 导入
import { chatLogicIp, chatLogicPort } from '../../../../app/ipConfig';
import { setReconnectingState } from '../../../../app/net/reconnect';
import { popNewMessage } from '../../../../app/utils/tools';
import { Client } from '../../../../pi/net/mqtt_c';
import { Struct, StructMgr } from '../../../../pi/struct/struct_mgr';
import { BonBuffer } from '../../../../pi/util/bon';
import { GroupUserLink } from '../../../server/data/db/group.s';
import { Contact, FriendLink, UserInfo } from '../../../server/data/db/user.s';
import { getFriendLinks, getGroupsInfo } from '../../../server/data/rpc/basic.p';
import { FriendLinkArray, GetFriendLinksReq, GetGroupInfoReq, GroupArray, GroupUserLinkArray } from '../../../server/data/rpc/basic.s';
import { getGroupUserLink } from '../../../server/data/rpc/group.p';
import { SendMsg } from '../../../server/data/rpc/message.s';
import { genUuid, getGidFromGuid } from '../../../utils/util';
import * as store from '../data/store';
import { AutoLoginMgr, UserType } from '../logic/autologin';
import { exitGroup } from '../logic/logic';
import * as subscribedb from '../net/subscribedb';
import { walletSignIn } from './init_1';
import { initPush } from './receive';
import { getFriendHistory, getMyGroupHistory } from './rpc';

// ================================================ 导出

/**
 * 客户端初始化
 */
export const initClient = (openId) => {
    if (!rootClient) {
        mqtt = new AutoLoginMgr(chatLogicIp, chatLogicPort);
        // mqtt = new AutoLoginMgr('192.168.9.29', port);
        rootClient = mqtt.connection(() => {
            walletSignIn(openId);
            setReconnectingState('chat',false);
            store.setStore('offLine',false);
        },() => {
            setReconnectingState('chat',false);
            store.setStore('offLine',true);
            store.setStore('isLogin',false);
        });
    }
    initPush();
};

// 登录
export const login = (userType: UserType, user: string, pwd: string, cb: (r: UserInfo) => void) => {
    mqtt.login(userType, user, pwd, cb);
};

/**
 * rpc 调用
 * @param name  method name
 * @param req request
 * @param callback  callback
 * @param timeout  timeout
 */
export const clientRpcFunc = (name: string, req: any, callback: Function, timeout: number = 2000) => {
    if (!clientRpc) {
        if (mqtt && mqtt.getState()) {
            clientRpc = mqtt.getRpc();
        } else {
            return;
        }
    }
    if (mqtt && !mqtt.getState()) {
        popNewMessage(`网络连接中！！！！`);

        return;
    }
    clientRpc(name, req, (r: Struct) => {
        if (!r) {
            popNewMessage(`${name} 失败了，返回结果 ${r}`);
        } else {
            return callback(r);
        }
    }, timeout);
};

/**
 * 注册了所有可以rpc调用的结构体
 * @param fileMap file map
 */
export const registerRpcStruct = (fileMap) => {
    if (!(<any>self).__mgr) {
        (<any>self).__mgr = new StructMgr();
    }
    for (const k in fileMap) {
        if (!k.endsWith('.s.js')) {
            continue;
        }
        const filePath = k.slice(0, k.length - pi_modules.butil.exports.fileSuffix(k).length - 1);
        const exp = pi_modules[filePath] && pi_modules[filePath].exports;
        for (const kk in exp) {
            if (Struct.isPrototypeOf(exp[kk]) && exp[kk]._$info && exp[kk]._$info.name) {
                if (!(<any>self).__mgr.lookup(exp[kk]._$info.name_hash)) {
                    (<any>self).__mgr.register(exp[kk]._$info.name_hash, exp[kk], exp[kk]._$info.name);
                }
            }
        }
    }
};

/**
 * 订阅主题
 * @param platerTopic topic
 * @param cb callback
 */
export const subscribe = (platerTopic: string, returnStruct: any, cb: Function, subMgr: boolean = true) => {
    if (!rootClient) return;
    const option = {
        qos: 0,
        onSuccess: () => {
            console.log('subsuccess!===============================', platerTopic);
        },
        onFailure: (e) => {
            console.log('subfail!=============================== ', e);
        }
    };
    rootClient.onMessage((topic: string, payload: Uint8Array) => {
        if (topic === platerTopic) {
            const o = new BonBuffer(payload).readBonCode(returnStruct);
            cb(o);
            console.log('listen db success!', o);
        }
    });

    rootClient.subscribe(platerTopic, option); // 订阅主题
    subMgr && mqtt.subMgr.update(platerTopic, returnStruct, cb);
};

/**
 * 取消订阅主题
 * @param platerTopic topic
 * @param cb callback
 */
export const unSubscribe = (platerTopic: string) => {
    if (!rootClient) return;

    rootClient.unsubscribe(platerTopic); // 订阅主题
    mqtt.subMgr.del(platerTopic);
};

// ===================================登陆相关

/**
 * 登录成功获取各种数据表的变化
 * @param uid user id
 */
export const init = (uid: number) => {
    subscribedb.subscribeContact(uid, (r: Contact) => {
        if (r && r.uid === uid) {
            updateUsers(r, uid);
        }
    }, (r: Contact) => {
        if (r && r.uid === uid) {
            updateGroup(r, uid);
        }
    });

    // TODO:
};

/**
 * 更新群组相关信息
 * @param r 联系人列表
 * @param uid 当前用户id
 */
const updateGroup = (r: Contact, uid: number) => {
    // 判断群组是否发生了变化,需要重新订阅群组消息
    const oldGroup = (store.getStore(`contactMap/${uid}`) || { group: [] }).group;
    const addGroup = r.group.filter((gid) => {
        return oldGroup.findIndex(item => item === gid) === -1;
    });
    const delGroup = oldGroup.filter((gid) => {
        return r.group.findIndex(item => item === gid) === -1;
    });

    // 主动或被动退出的群组
    delGroup.forEach((gid: number) => {
        unSubscribe(`ims/group/msg/${gid}`);  // 退订群聊消息
        subscribedb.unSubscribeGroupInfo(gid); // 退订群信息
        exitGroup(gid);
    });

    // 订阅我已经加入的群组基础信息
    addGroup.forEach((gid) => {
        getMyGroupHistory(gid); // 获取第一条消息
        subscribe(`ims/group/msg/${gid}`, SendMsg, (r: SendMsg) => {
            if (r.code === 1) {
                getMyGroupHistory(gid); // 获取群组离线消息
            }
        });
        subscribedb.subscribeGroupInfo(gid, () => {
            clientRpcFunc(getGroupUserLink, gid, (r: GroupUserLinkArray) => {
                // 判断是否返回成功
                if (r && r.arr.length > 0) {
                    r.arr.forEach((item: GroupUserLink) => {
                        store.setStore(`groupUserLinkMap/${item.guid}`, item);
                    });
                }
            });
        });
    });
    // 获取邀请我进群的群组信息
    const groups = new GetGroupInfoReq();
    groups.gids = [];
    r.applyGroup.forEach(guid => {
        const gid = getGidFromGuid(guid);
        groups.gids.push(gid);
    });
    if (groups.gids.length > 0) {
        clientRpcFunc(getGroupsInfo, groups, (r: GroupArray) => {
            console.log(r);
            if (r && r.arr.length > 0) {
                r.arr.forEach(item => {
                    store.setStore(`groupInfoMap/${item.gid}`, item);
                });
            }
        });
    }

};

/**
 * 更新好友信息
 * @param r 联系人列表
 * @param uid 当前用户id
 */
const updateUsers = (r: Contact, uid: number) => {
    const info = new GetFriendLinksReq();
    info.uuid = [];
    r.friends.forEach((rid: number) => {
        info.uuid.push(genUuid(uid, rid));
        getFriendHistory(rid);  // 获取好友发送的离线消息
    });
    if (info.uuid.length > 0) {
        console.log(info.uuid);
        // 获取friendlink
        clientRpcFunc(getFriendLinks, info, (r: FriendLinkArray) => {
            if (r && r.arr && r.arr.length > 0) {
                r.arr.forEach((e: FriendLink) => {
                    store.setStore(`friendLinkMap/${e.uuid}`, e);
                });
            }

        });

    }
    const uids = r.friends.concat(r.temp_chat, r.blackList, r.applyUser);
    if (uids.length > 0) {
        uids.forEach(elem => {
            subscribedb.subscribeUserInfo(elem, (r: UserInfo) => {
                // TODO
            });
        });

    }
};

/**
 * 主动断开mqtt连接
 */
export const disconnect = () => {
    mqtt && mqtt.disconnect();
    mqtt = undefined;
    rootClient = undefined;
    clientRpc = undefined;
};

/**
 * 聊天手动重连
 */
export const chatManualReconnect = () => {
    mqtt && mqtt.reconnect();
};

// ================================================ 本地
// MQTT管理
let mqtt: any;
// 客户端
let rootClient: Client;
// root RPC
let clientRpc: any;
