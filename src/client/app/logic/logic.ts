/**
 * 一些全局方法
 */
// =====================================导入
import { GroupInfo } from '../../../server/data/db/group.s';
import { UserInfo } from '../../../server/data/db/user.s';
import { genUuid } from '../../../utils/util';
import * as store from '../data/store';

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
    const friend = store.getStore(`friendLinkMap/${genUuid(sid,rid)}`,{});

    return friend.alias || user.name;
};

/**
 * 获取群别名
 */
export const getGroupAlias = (gid:number) => {
    const groupInfo = store.getStore(`groupInfoMap/${gid}`,new GroupInfo());
    
    return groupInfo.name;
};