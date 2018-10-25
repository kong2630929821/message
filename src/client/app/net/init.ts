/**
 * RPC， 远程方法调用
 * 采用 mqtt上定义的每会话的$req和$resp主题，来发送请求和接受响应
 */
declare var pi_modules;


/**
 * 建立网络响应客户端的
*/
 // ================================================ 导入
import { Client } from "../../../pi/net/mqtt_c";
import { create } from "../../../pi/net/rpc";
import { Error, OK_S, OK } from "../../../pi_pt/net/rpc_r.s";
import { StructMgr, Struct, Func } from "../../../pi/struct/struct_mgr";
import { BonBuffer } from "../../../pi/util/bon";

// ================================================ 导出

/**
 * 客户端初始化
 */
export const initClient = function () {
	if (!rootClient) {
		var options = {
			timeout: 3,
			keepAliveInterval: 30,
			cleanSession: false,
			useSSL: false,
			mqttVersion: 3,
			onSuccess: () => {
				clientRpc = create(rootClient, (<any>self).__mgr);
			},
			onFailure: (r) => {
				console.log("connect fail", r);
			}
		};
		rootClient = new Client("127.0.0.1", 1234, "clientId-wcd14PDgoZ", null, options);
	}
}

/**
 * rpc 调用
 * @param name 
 * @param req 
 * @param respClass 
 * @param callback 
 * @param timeout 
 */
export const clientRpcFunc = (name: string, req: any, respClass: Function, callback: Function, timeout: number = 2000) => {
    if (!clientRpc) return;
    clientRpc(name, req, (r: Struct) => {
        if (!r || !respClass || r instanceof respClass) {
            return callback(r);
        } else if (r instanceof Error) {
            console.log(`RPCError:${r.info}`);
        } else {
            console.log(`RPCError:返回类型${r.constructor.name}与${respClass.name}类型不匹配！`);
        }
    }, timeout);
};

/**
 * 注册了所有可以rpc调用的结构体
 * @param fileMap 
 */
export const registerRpcStruct = (fileMap) => {
    if(!(<any>self).__mgr){
        (<any>self).__mgr = new StructMgr();
    }
	for (let k in fileMap) {
        if(!k.endsWith(".s.js"))
            continue;
		var filePath = k.slice(0, k.length - pi_modules.butil.exports.fileSuffix(k).length - 1);
		var exp = pi_modules[filePath] && pi_modules[filePath].exports;
		for (let kk in exp) {
			if (Struct.isPrototypeOf(exp[kk]) && exp[kk]._$info && exp[kk]._$info.name) {
				(<any>self).__mgr.register(exp[kk]._$info.nameHash, exp[kk], exp[kk]._$info.name);
			}
		}
	}
}

/**
 * 订阅主题
 * @param platerTopic 
 * @param cb 
 */
export const subscribe = (platerTopic: string, mod: any, cb: Function) => {
	if (!rootClient) return
	let option = {
		qos: 0,
		onSuccess: () => {
			console.log("subsuccess!===============================");
		},
		onFailure: (e) => {
			console.log("subfail!=============================== ", e)
		}
	}
	rootClient.onMessage((topic: string, payload: Uint8Array) => {
		if (topic === platerTopic) {
			let o = new BonBuffer(payload).readBonCode(mod);
			cb(o);
			console.log("listen db success!", o);
		}
	});

	rootClient.subscribe(platerTopic, option); //订阅主题
}

// ================================================ 本地
//客户端
let rootClient: Client;
//root RPC
let clientRpc: any;

// ================================================ 可执行
//初始化客户端
// initClient();