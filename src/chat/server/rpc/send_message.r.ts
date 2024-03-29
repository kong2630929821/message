/**
 * 发送聊天消息
 */
import { Env } from '../../../pi/lang/env';
import { EnumType, TabMeta, Type } from '../../../pi/struct/sinfo';
import { BonBuffer } from '../../../pi/util/bon';
import { mqttPublish, QoS } from '../../../pi_pt/rust/pi_serv/js_net';
import { createMemoryBucket } from '../../utils/db';
import { Logger } from '../../utils/logger';
import { messageDeliveredAck as deliveredAck, messageReceivedAck, sendMessage as Message } from './send_message.s';

declare var env: Env;

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// #[rpc]
export const sendMessage = (message: Message): messageReceivedAck => {
    const mqttServer = env.get('mqttServer');

    const dst = message.dst;
    const msgAck = new messageReceivedAck();
    msgAck.ack = true;

    messgeHandler(message);

    const buf = new BonBuffer();
    message.bonEncode(buf);
    logger.debug(`the topic is : ${dst}`);
    mqttPublish(mqttServer, true, QoS.AtMostOnce, dst, buf.getBuffer());

    return msgAck;
};

// #[rpc]
export const messageDeliveredAck = (): deliveredAck => {
    const deliverAck = new deliveredAck();
    deliverAck.ack = true;

    return deliverAck;
};

const messgeHandler = (message: Message) => {
    const meta = new TabMeta(new EnumType(Type.Usize), new EnumType(Type.Struct, Message._$info));
    const bkt = createMemoryBucket('wtf', meta);

    const key = message.msgId;
    const val = message;

    bkt.put(key, val);

    console.log('read memory bucket', bkt.get(key));
};