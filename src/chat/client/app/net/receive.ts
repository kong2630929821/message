
/**
 * 接受后端推送事件
 */

import { HandlerMap, HandlerResult } from '../../../../pi/util/event';
import * as CONSTANT from '../../../server/data/constant';
import { SendMsg } from '../../../utils/send.s';
import { bottomNotice } from '../logic/logic';
import { subscribe } from './init';

/**
 * 消息处理列表
 */
const handlerMap: HandlerMap = new HandlerMap();

// 注册事件监听
export const addEvent = (cmd: string, cb: (r: any) => void) => {
    handlerMap.add(cmd, (r) => {
        cb(r);

        return HandlerResult.OK;
    });
};

// 监听topic
export const initReceive = (uid: number) => {
    subscribe(`send/${uid}`, SendMsg, (r: any) => {
        notify(r.cmd, r.msg);
    });
};

// 事件通知
export const notify = (cmd: string, msg: string) => {
    handlerMap.notify(cmd, [msg]);
};

// 主动推送
export const initPush = () => {
    // 拒绝好友添加
    addEvent(CONSTANT.SEND_REFUSED, (r) => {
        console.log('!!!!!!!!!!!!r:', r);
        bottomNotice(r);
    });
};