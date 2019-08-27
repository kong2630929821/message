
/**
 * 接受后端推送事件
 */

import { HandlerMap, HandlerResult } from '../../../../pi/util/event';
import * as CONSTANT from '../../../server/data/constant';
import { GENERATOR_TYPE } from '../../../server/data/db/user.s';
import { SendMsg } from '../../../utils/send.s';
import { deelNotice } from '../logic/logic';
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
    console.log(`initReceive`);
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
        console.log('refused user', r);
        // popNewMessage(r);
    });

    // 监听点赞
    addEvent(CONSTANT.SEND_POST_LAUD, (r) => {
        console.log('点赞', r);
        // popNewMessage(r);
        const arr = JSON.parse(r).key;
        const time = JSON.parse(JSON.parse(r).createtime);
        const data = [arr.uid,time,GENERATOR_TYPE.NOTICE_3,arr.post_id,arr.num];
        deelNotice(data,GENERATOR_TYPE.NOTICE_3);
    });

    // 监听评论点赞
    addEvent(CONSTANT.SEND_COMMENT_LAUD, (r) => {
        console.log('评论点赞', r);
        // popNewMessage(r);
        const arr = JSON.parse(r).key;
        const time = JSON.parse(JSON.parse(r).createtime);
        const data = [arr.uid,time,GENERATOR_TYPE.NOTICE_3,arr.post_id,arr.num];
        deelNotice(data,GENERATOR_TYPE.NOTICE_3);
    });

    // 监听评论
    addEvent(CONSTANT.SEND_COMMENT, (r) => {
        console.log('评论', r);
        // popNewMessage(r);
        const arr = JSON.parse(r).key;
        const time = JSON.parse(JSON.parse(r).createtime);
        const data = [JSON.parse(r).owner,time,GENERATOR_TYPE.NOTICE_4,arr.post_id,arr.num];
        deelNotice(data,GENERATOR_TYPE.NOTICE_4);
    });

    // 监听评论的评论
    addEvent(CONSTANT.SEND_COMMENT_TO_COMMENT, (r) => {
        console.log('评论的评论', r);
        // popNewMessage(r);
        const arr = JSON.parse(r).key;
        const time = JSON.parse(JSON.parse(r).createtime);
        const data = [JSON.parse(r).owner,time,GENERATOR_TYPE.NOTICE_4,arr.post_id,arr.num];
        deelNotice(data,GENERATOR_TYPE.NOTICE_4);
    });

};