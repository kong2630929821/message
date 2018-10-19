import {Struct} from "../../pi/struct/struct_mgr";
import {Client} from "../../pi/net/mqtt_c";
import {Error} from "../../pi_pt/net/rpc_r.s";
import {create, Rpc} from "../../pi/net/rpc";
import { BonBuffer } from "../../pi/util/bon";
import { sendMessage as Message } from '../../server/rpc/send_message.s';

const SERVER_IP = "127.0.0.1";
const SERVER_PORT = 1234;

const createMqttClient = (onSuccess: Function, onFailure: Function): Client => {
    var options = {
        timeout: 3,
        keepAliveInterval: 60,
        cleanSession: false,
        useSSL: false,
        mqttVersion:3,
        onSuccess: onSuccess,
        onFailure: onFailure,
    };
    return new Client(SERVER_IP, SERVER_PORT, "clientId-wcd14PDgoZ", null, options);
}

const rpcFn = (rpcName: string, client: Client, req: Struct, resp: Function, timeout: number, callback: Function) => {
    let rpc = create(client, (<any>self).__mgr);
    rpcFunc(rpcName, rpc, req, resp, callback, timeout);
}

const rpcFunc = (rpcName: string, rpc: Rpc, req:Struct, respClass:Function, callback:Function, timeout: number) => {
	rpc(rpcName, req, (r:Struct) =>{
		if(!respClass || r instanceof respClass){
			return callback(r);
		}else if(r instanceof Error){
			console.log("RPCError:" + r.info);
		}else{
			console.log("RPCError:"  + "返回类型" + r.constructor.name + "与" + respClass.name + "类型不匹配！")
		}
	}, timeout);
}

export const callRemoteRpc = (rpcName: string, rpcRequest: Struct, rpcResponseType: Function, callback: Function, timeout: number = 1000) => {
    let mqttClient = createMqttClient(() => {
        rpcFn(rpcName, mqttClient, rpcRequest, rpcResponseType, timeout, callback);
    }, error => {
        console.log(error);
    });
}

export const subscribeChannel = (channelId: string) => {
    let mqttClient = createMqttClient(() => {
        mqttClient.onMessage((topic: string, payload: Uint8Array) => {
            if(topic === channelId) {
                let bon = new BonBuffer(payload);
                let message = new Message();
                message.bonDecode(bon);

                console.log('received message: ', message);
            }
        });
        mqttClient.subscribe(channelId, {
            qos: 0,
            onSuccess : () => {

            },
            onFailure: (e) => {
                console.log(e);
            }
        });

    }, error => {
        console.log(error);
    });
}
