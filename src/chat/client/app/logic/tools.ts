import { popNew } from '../../../../pi/ui/root';
import { lookup } from '../../../../pi/widget/widget';
import { GENERATOR_TYPE } from '../../../server/data/db/user.s';
import { genGroupHid } from '../../../utils/util';
import { getStore, setStore } from '../data/store';
import { EMOJIS_MAP } from '../widget/emoji/emoji';

/**
 * tools
 */
declare var pi_modules;
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

// 弹出提示框
export const popNewMessage = (content: any) => {
    const name = 'app-components-message-message';
    if (!lookup(name)) {
        const name1 = name.replace(/-/g,'/');
        const sourceList = [`${name1}.tpl`,`${name1}.js`,`${name1}.wcss`,`${name1}.cfg`,`${name1}.widget`];
        piLoadDir(sourceList).then(() => {
            popNew(name, { content });
        });
    } else {
        popNew(name, { content });
    }
};
/**
 * 获取模块导出
 */
export const relativeGet = (path:string) => {
    const mod = pi_modules.commonjs.exports.relativeGet(path);

    return mod ? mod.exports : {};
};
/**
 * loadDir加载模块
 */
export const piLoadDir = (sourceList:string[],flags?:any,fm?:any,suffixCfg?:any) => {
    return new Promise((resolve,reject) => {
        const html = relativeGet('pi/util/html');
        html.checkWebpFeature((r) => {
            flags = flags || {};
            flags.webp = flags.webp || r;
            const util = relativeGet('pi/widget/util');
            util.loadDir(sourceList, flags, fm, suffixCfg,  (fileMap) => {                
                const tab = util.loadCssRes(fileMap);
                tab.timeout = 90000;
                tab.release();
                resolve();
            },  (r) => {
                reject(r);
            }, () => {
                // console.log();
            });
        });
        
    });
};