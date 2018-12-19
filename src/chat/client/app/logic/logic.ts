/**
 * 一些全局方法
 */
// =====================================导入
import { FriendLink, UserInfo, GENERATOR_TYPE } from '../../../server/data/db/user.s';import { genUuid, genGroupHid } from '../../../utils/util';
import * as store from '../data/store';
import { userExitGroup } from '../../../server/data/rpc/group.p';
import { clientRpcFunc, unSubscribe } from '../net/init';

// =====================================导出

/**
 * 时间戳格式化 毫秒为单位
 * timeType 1 返回时分
 */ 
export const timestampFormat = (timestamp: number,timeType?: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    if (timeType === 1) {
        return `${hour}:${minutes}`;
    }

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

/**
 * Map转json，仅接受一层map
 */
export const map2Json = (data:Map<any,any>)  => {
    const res = {};
    data.forEach((v,k) => {
        res[k] = v;
    });

    return res;
};

/**
 * json转Map，仅可转一层map
 */
export const json2Map = (data:JSON) => {
    const res = new Map();
    for (const i in data) {
        res.set(i,data[i]);
    }

    return res;
};

/**
 * 获取好友的别名
 */
export const getFriendAlias = (rid:number) => {
    const sid = store.getStore('uid');
    const user = store.getStore(`userInfoMap/${rid}`,new UserInfo());
    const friend = store.getStore(`friendLinkMap/${genUuid(sid,rid)}`,new FriendLink());

    return friend.alias || user.name;
};

/**
 * 退出群组，取消订阅
 */
export const exitGroup = (gid:number) => {
    clientRpcFunc(userExitGroup,gid,(r) => {
        console.log('========deleteGroup',r);
        if (r.r === 1) { // 退出成功取消订阅群消息
            unSubscribe(`ims/group/msg/${gid}`);

            const groupChatMap = store.getStore('groupChatMap',[]);
            const index1 = groupChatMap.indexOf(genGroupHid(gid));
            if (index1 > -1) { // 删除聊天记录
                groupChatMap.splice(index1,1);
                store.setStore('groupChatMap',groupChatMap);
            }

            const lastChat = store.getStore(`lastChat`, []);
            const index2 = lastChat.findIndex(item => item[0] === gid && item[2] === GENERATOR_TYPE.GROUP);
            if (index2 > -1) { // 删除最近对话记录
                lastChat.splice(index1,1);
                store.setStore('lastChat',lastChat);
            }
        } else {
            alert('退出群组失败');
        }
    });
}