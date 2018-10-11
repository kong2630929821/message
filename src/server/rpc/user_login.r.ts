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

    // this is only for test purpose
    if (uid === 'group') {
        setMqttTopic(mqttServer, 'gid-123', true, true);
    }

    let response = new userLoginResponse();
    response.ack = true;

    return response;
}