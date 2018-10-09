import { userLogin as UserLoginRequest, userLoginResponse } from './user_login.s';
import { setMqttTopic, mqttPublish, QoS } from "../../pi_pt/rust/pi_serv/js_net";
import { getEnv } from "../../pi_pt/net/rpc_server";
import { ServerNode } from "../../pi_pt/rust/mqtt/server";

//#[rpc]
export const userLogin = (userLoginRequest: UserLoginRequest): userLoginResponse => {
    let mqttServer = getEnv().getNativeObject<ServerNode>("mqttServer");

    let uid = userLoginRequest.uid;

    // TODO: how to delete topic when user offline ?
    setMqttTopic(mqttServer, uid, true, true);
    setMqttTopic(mqttServer, "uid-456", true, true);

    mqttPublish(mqttServer, true, QoS.AtMostOnce, uid, new Uint8Array([1,2,3,4,5,6,7,8]));

    let response = new userLoginResponse();
    response.ack = true;

    return response;
}