/**
 * RPC， 远程方法调用
 * 采用 mqtt上定义的每会话的$req和$resp主题，来发送请求和接受响应
 * 建立网络响应客户端的
 */
declare var pi_modules;

// ================================================ 导入
import { Client } from '../../../pi/net/mqtt_c';
import { Struct, structMgr } from '../../../pi/struct/struct_mgr';
import { BonBuffer } from '../../../pi/util/bon';
import { serverIp, serverPort } from '../config';
import { AutoLoginMgr } from '../utils/autologin';
import { popNewMessage } from '../utils/logic';

// ================================================ 导出

/**
 * 客户端初始化
 */
export const initClient = (openId) => {
    if (!rootClient) {
        mqtt = new AutoLoginMgr(serverIp, serverPort);
        // mqtt = new AutoLoginMgr('192.168.9.29', port);
        rootClient = mqtt.connection(() => {
            walletSignIn(openId);
        },() => {
            
        });
    }
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
        popNewMessage(`网络连接中···`);

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
        (<any>self).__mgr = structMgr;
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
    console.log('chatManualReconnect called');
    mqtt && mqtt.reconnect();
};

// ================================================ 本地
// MQTT管理
let mqtt: any;
// 客户端
let rootClient: Client;
// root RPC
let clientRpc: any;
