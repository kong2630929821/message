/**
 * 一些全局方法
 */
// =====================================导入
import { notify } from '../../../../pi/widget/event';
import { MSG_TYPE } from '../../../server/data/db/message.s';
import { FriendLink, GENERATOR_TYPE, UserInfo } from '../../../server/data/db/user.s';
import { genGroupHid, genUuid } from '../../../utils/util';
import * as store from '../data/store';
import { unSubscribe } from '../net/init';
import { uploadFile } from '../net/upload';
import { selectImage } from './native';

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
 * 用户退出群组后取消订阅清空本地数据
 */
export const exitGroup = (gid:number) => {
    unSubscribe(`ims/group/msg/${gid}`);

    const groupChatMap = store.getStore('groupChatMap',new Map());
    groupChatMap.delete(genGroupHid(gid)); // 删除聊天记录
    store.setStore('groupChatMap',groupChatMap);

    const lastChat = store.getStore(`lastChat`, []);
    const index = lastChat.findIndex(item => item[0] === gid && item[2] === GENERATOR_TYPE.GROUP);
    if (index > -1) { // 删除最近对话记录
        lastChat.splice(index,1);
        store.setStore('lastChat',lastChat);
    }

    const gInfoMap = store.getStore(`groupInfoMap`,new Map());    
    gInfoMap.delete(gid);  // 删除群组信息
    store.setStore(`groupInfoMap`, gInfoMap);
};

// 复制到剪切板
export const copyToClipboard = (copyText) => {
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', copyText);
    input.setAttribute('style', 'position:absolute;top:-9999px;');
    document.body.appendChild(input);
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        input.setSelectionRange(0, 9999);
    } else {
        input.select();
    }
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
};

// 发送图片消息
export const sendImg = (e:any) => {
    selectImage((width, height, base64) => {
        uploadFile(base64, (imgUrlSuf:string) => {
            notify(e.node,'ev-send',{ value:`[${imgUrlSuf}]`, msgType:MSG_TYPE.IMG });
        });            
    });
};