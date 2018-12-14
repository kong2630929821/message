/**
 * RPC， 远程方法调用
 * 采用 mqtt上定义的每会话的$req和$resp主题，来发送请求和接受响应
 * 建立网络响应客户端的
 */
declare var pi_modules;

 // ================================================ 导入
import { Client } from '../../../pi/net/mqtt_c';
import { create } from '../../../pi/net/rpc';
import { Struct, StructMgr } from '../../../pi/struct/struct_mgr';
import { BonBuffer } from '../../../pi/util/bon';

// ================================================ 导出

/**
 * 客户端初始化
 */
export const initClient =  () => {
    if (!rootClient) {
        const options = {
            timeout: 3,
            keepAliveInterval: 30,
            cleanSession: false,
            useSSL: false,
            mqttVersion: 3,
            onSuccess: () => {
                clientRpc = create(rootClient, (<any>self).__mgr);
            },
            onFailure: (r) => {
                console.log('connect fail', r);
            }
        };
        rootClient = new Client('127.0.0.1', 1234, 'clientId-wcd14PDgoZ', null, options);
        // rootClient = new Client('192.168.9.29', 1234, 'clientId-wcd14PDgoZ', null, options);
    }
};

/**
 * rpc 调用
 * @param name  method name
 * @param req request
 * @param callback  callback
 * @param timeout  timeout
 */
export const clientRpcFunc = (name: string, req: any, callback: Function, timeout: number = 2000) => {
    if (!clientRpc) return;
    clientRpc(name, req, (r: Struct) => {
        return callback(r);
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
                (<any>self).__mgr.register(exp[kk]._$info.nameHash, exp[kk], exp[kk]._$info.name);
            }
        }
    }
};

/**
 * 订阅主题
 * @param platerTopic topic
 * @param cb callback
 */
export const subscribe = (platerTopic: string, returnStruct: any, cb: Function) => {
    if (!rootClient) return;
    const option = {
        qos: 0,
        onSuccess: () => {
            console.log('subsuccess!===============================');
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
};

// ================================================ 本地
// 客户端
let rootClient: Client;
// root RPC
let clientRpc: any;