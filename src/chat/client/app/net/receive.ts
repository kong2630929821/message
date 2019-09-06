
/**
 * 接受后端推送事件
 */
import { HandlerMap, HandlerResult } from '../../../../pi/util/event';
import * as CONSTANT from '../../../server/data/constant';
import { SendMsg } from '../../../utils/send.s';
import * as store from '../data/store';
import { setNoticeList } from '../logic/logic';
import { subscribe } from './init';
import { getPostDetile } from './rpc';

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

// 处理点赞事件
export const deelFabulousList = (fabulousList:any,arr:any,time:any) => {
    if (fabulousList.length) {
        fabulousList.forEach(v => {
            if (v[5].key.id === arr.post_id) {
                const data = [arr.uid,time,store.GENERATORTYPE.NOTICE_3,arr.post_id,arr.num,v[5]];
                setNoticeList(store.GENERATORTYPE.NOTICE_3,'fabulousList',data);
            } else {
                getPostDetile(arr.num,arr.post_id).then((res:any) => {
                    const data = [arr.uid,time,store.GENERATORTYPE.NOTICE_3,arr.post_id,arr.num,res[0]];
                    setNoticeList(store.GENERATORTYPE.NOTICE_3,'fabulousList',data);
                });  
            }
        });    
    } else {
        getPostDetile(arr.num,arr.post_id).then((res:any) => {
            const data = [arr.uid,time,store.GENERATORTYPE.NOTICE_3,arr.post_id,arr.num,res[0]];
            setNoticeList(store.GENERATORTYPE.NOTICE_3,'fabulousList',data);
        });  
    }
};

// 处理评论事件
export const deelConmentList = (conmentList:any,arr:any,time:any,r:any) => {
    if (conmentList.length) {
        conmentList.forEach(v => {
            if (v[5].key.id === arr.post_id) {
                const data = [JSON.parse(r).owner,time,store.GENERATORTYPE.NOTICE_4,arr.post_id,arr.num,v[5]];
                setNoticeList(store.GENERATORTYPE.NOTICE_4,'conmentList',data);
            } else {
                getPostDetile(arr.num,arr.post_id).then((res:any) => {
                    const data = [JSON.parse(r).owner,time,store.GENERATORTYPE.NOTICE_4,arr.post_id,arr.num,res[0]];
                    setNoticeList(store.GENERATORTYPE.NOTICE_4,'conmentList',data);
                });  
            }
        });
    } else {
        getPostDetile(arr.num,arr.post_id).then((res:any) => {
            const data = [JSON.parse(r).owner,time,store.GENERATORTYPE.NOTICE_4,arr.post_id,arr.num,res[0]];
            setNoticeList(store.GENERATORTYPE.NOTICE_4,'conmentList',data);
        });  
    }
};

// 主动推送
// tslint:disable-next-line:max-func-body-length
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
        const fabulousList = store.getStore('fabulousList',[]);
        deelFabulousList(fabulousList,arr,time);
    });

    // 监听评论点赞
    addEvent(CONSTANT.SEND_COMMENT_LAUD, (r) => {
        console.log('评论点赞', r);
        // popNewMessage(r);
        const arr = JSON.parse(r).key;
        const time = JSON.parse(JSON.parse(r).createtime);
        const fabulousList = store.getStore('fabulousList',[]);
        deelFabulousList(fabulousList,arr,time);
        
    });

    // 监听评论
    addEvent(CONSTANT.SEND_COMMENT, (r) => {
        console.log('评论', r);
        // popNewMessage(r);
        const arr = JSON.parse(r).key;
        const time = JSON.parse(JSON.parse(r).createtime);
        const conmentList = store.getStore('conmentList',[]);
        deelConmentList(conmentList,arr,time,r);
    });

    // 监听评论的评论
    addEvent(CONSTANT.SEND_COMMENT_TO_COMMENT, (r) => {
        console.log('评论的评论', r);
        // popNewMessage(r);
        const arr = JSON.parse(r).key;
        const time = JSON.parse(JSON.parse(r).createtime);

        const conmentList = store.getStore('conmentList',[]);
        deelConmentList(conmentList,arr,time,r);
        
    });

};