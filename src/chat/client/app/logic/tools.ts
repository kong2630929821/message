import { GENERATOR_TYPE } from '../../../server/data/db/user.s';
import { genGroupHid } from '../../../utils/util';
import { getStore, setStore } from '../data/store';
import { EMOJIS_MAP } from '../widget/emoji/emoji';

/**
 * tools
 */

// 转换文字中的链接
const httpHtml = (str:string) => {
    const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|:|#)+)/g;
    
    return str.replace(reg, '<a href="javascript:;" class="linkMsg">$1$2</a>');
};

// 转换表情包
export const parseEmoji = (msg:any) => {    
    msg = httpHtml(msg);
    msg = msg.replace(/\[(\S+?)\]/ig, (match, capture) => {
        const url = EMOJIS_MAP.get(capture) || undefined;
        if (url) {
            return `<img src="../../chat/client/app/res/emoji/${url}" alt="${capture}" class='emojiMsg'></img>`;
        } else {
            return match;
        }
    });

    return msg;
};

/**
 * 用户退出群组后取消订阅清空本地数据
 */
export const exitGroup = (gid:number) => {
    const groupChatMap = getStore('groupChatMap',new Map());
    groupChatMap.delete(genGroupHid(gid)); // 删除聊天记录
    setStore('groupChatMap',groupChatMap);

    const lastChat = getStore(`lastChat`, []);
    const index = lastChat.findIndex(item => item[0] === gid && item[2] === GENERATOR_TYPE.GROUP);
    if (index > -1) { // 删除最近对话记录
        lastChat.splice(index,1);
        setStore('lastChat',lastChat);
    }

    const lastRead = getStore(`lastRead`, []);
    lastRead.delete(genGroupHid(gid));  // 删除已读消息记录
    setStore(`lastRead`, lastRead);

    const gInfoMap = getStore(`groupInfoMap`,new Map());    
    gInfoMap.delete(gid.toString());  // 删除群组信息
    setStore(`groupInfoMap`, gInfoMap);
};