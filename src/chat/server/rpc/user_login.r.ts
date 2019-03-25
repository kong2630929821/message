import { Env } from '../../../pi/lang/env';
import { ServerNode } from '../../../pi_pt/rust/mqtt/server';
import { mqttPublish, QoS, setMqttTopic } from '../../../pi_pt/rust/pi_serv/js_net';
import { userLogin as UserLoginRequest, userLoginResponse } from './user_login.s';

declare var env: Env;

// #[rpc=rpcServer]
export const userLogin = (userLoginRequest: UserLoginRequest): userLoginResponse => {
    const mqttServer = env.get('mqttServer');

    const uid = userLoginRequest.uid;

    // TODO: how to delete topic when user offline ?
    setMqttTopic(mqttServer, uid, true, true);

    // this is only for test purpose
    if (uid === 'group') {
        setMqttTopic(mqttServer, 'gid-123', true, true);
    }

    const response = new userLoginResponse();
    response.ack = true;

    return response;
};