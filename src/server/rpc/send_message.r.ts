import { sendMessage as Message, messageReceivedAck, messageDeliveredAck as deliveredAck } from './send_message.s';
import { createMemoryBucket } from '../../utils/db';
import { Type, EnumType, TabMeta } from '../../pi/struct/sinfo';
import { getEnv } from '../../pi_pt/net/rpc_server';
import { mqttPublish, QoS } from "../../pi_pt/rust/pi_serv/js_net";
import { ServerNode } from "../../pi_pt/rust/mqtt/server";
import {BonBuffer} from "../../pi/util/bon";

//#[rpc]
export const sendMessage = (message: Message): messageReceivedAck => {
    let mqttServer = getEnv().getNativeObject<ServerNode>("mqttServer");

    let dst = message.dst;
    let msgAck = new messageReceivedAck();
    msgAck.ack = true;

    messgeHandler(message);

    let buf = new BonBuffer();
    message.bonEncode(buf);

    mqttPublish(mqttServer, true, QoS.AtMostOnce, dst, buf.getBuffer());

    return msgAck;
}

//#[rpc]
export const messageDeliveredAck = (): deliveredAck => {
    let deliverAck = new deliveredAck();
    deliverAck.ack = true;

    return deliverAck;
}

const messgeHandler = (message: Message) => {
    let dbMgr = getEnv().getDbMgr();
    let meta = new TabMeta(new EnumType(Type.Usize), new EnumType(Type.Struct, Message._$info));
    let bkt = createMemoryBucket("wtf", meta, dbMgr);

    let key = message.msgId;
    let val = message;

    bkt.put(key, val);

    console.log('read memory bucket', bkt.get(key));
}