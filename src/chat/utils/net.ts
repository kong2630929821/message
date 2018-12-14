/**
 * network functions
 */
import {mqttPublish} from "../../pi_pt/rust/pi_serv/js_net";
import {getNativeObj} from "../../pi_pt/init/init";
import {setMqttTopic} from "../../pi_pt/rust/pi_serv/js_net";

// let mqttServer = getNativeObj("mqttServer");
// mqttPublish(mqttServer, false, 0, "a/b/c", new Uint8Array([1,1,1]));

let mqttServer = getNativeObj("mqttServer");//使用服务名取到服务的实例
setMqttTopic(mqttServer, "a/b/c", true, true);//注册主题，允许该主题被订阅和发布

export const setTopic = (topic: string): void => {
    setMqttTopic(mqttServer, topic, true, true);
    console.log("subscribe topic: ", topic);
}