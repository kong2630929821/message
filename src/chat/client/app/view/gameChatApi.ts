
import { uploadFileUrlPrefix } from '../../../../app/config';
import { WebViewManager } from '../../../../pi/browser/webview';
import { loadDir } from '../../../../pi/widget/util';
import { DEFAULT_ERROR_STR } from '../../../server/data/constant';
import { GroupInfo } from '../../../server/data/db/group.s';
import { GroupHistory, MSG_TYPE } from '../../../server/data/db/message.s';
import { sendGroupMessage } from '../../../server/data/rpc/message.p';
import { GroupSend } from '../../../server/data/rpc/message.s';
import { depCopy, genGroupHid, genGuid, getGidFromHincid } from '../../../utils/util';
import * as store from '../data/store';
import { bottomNotice, timestampFormat } from '../logic/logic';
import { clientRpcFunc } from '../net/init';
import { EMOJIS } from '../widget/emoji/emoji';

/**
 * 第三方应用中聊天接口
 */

// 点击发送
export const sendMessage = (param,cb?) => {
    const message = new GroupSend();
    message.gid = param.gid;
    message.msg = param.message;
    message.mtype = param.msgType || MSG_TYPE.TXT;
    message.time = (new Date()).getTime();
    
    clientRpcFunc(sendGroupMessage, message, (r: GroupHistory) => {
        
        if (r.hIncId === DEFAULT_ERROR_STR) {
            bottomNotice('发送失败！');
            cb(r);
                    
            return;
        } else {
            cb(null, r);
        }
    });
};

// 获取群聊信息
export const getMessList = (gid,cb) => {
    const messList = store.getStore(`groupChatMap/${genGroupHid(gid)}`);
    cb(null,messList);
};

// 获取消息内容
export const getDetail = (hIncId,cb) => {
    const msg = store.getStore(`groupHistoryMap/${hIncId}`);
    const gid = getGidFromHincid(hIncId);
    const name = store.getStore(`groupUserLinkMap/${genGuid(gid, msg.sid)}`).userAlias;
    let res = depCopy(msg.msg);
    if (msg.mtype === MSG_TYPE.VOICE || msg.mtype === MSG_TYPE.REDENVELOPE) {
        res = JSON.parse(res);
    }
    cb(null, { 
        ...msg,
        msg:res,
        name:name,
        time:timestampFormat(msg.time,1) 
    });
};

// 获取基础信息
export const getBaseInfo = (gid,cb) => {
    const hid = genGroupHid(gid);
    const ginfo = store.getStore(`groupInfoMap/${gid}`,new GroupInfo());
    cb(null,{
        uid:store.getStore('uid'),
        lastRead:store.getStore(`lastRead/${hid}`,{ msgId:null }).msgId,
        groupName:`${ginfo.name}(${ginfo.memberids.length})`,
        uploadFileUrlHead:uploadFileUrlPrefix,
        EMOJIS:EMOJIS
    });
};

// 第三方聊天注入资源 返回两个propmise
export const gameChatPromise = (gid) => {

    return {
        chatPromise: new Promise<string>((resolve) => {
            const path = 'chat/game_chat/gameChat.js.txt';
            loadDir([path], undefined, undefined, undefined, fileMap => {
                const arr = new Uint8Array(fileMap[path]);
            // for (let i = 0; i < arr.length; ++i) {
            //     content += String.fromCharCode(arr[i]);
            // }
            // content = decodeURIComponent(escape(atob(content)));
                const content = new TextDecoder().decode(arr);
                resolve(content);
            }, () => {
            // TODO 失败的回调
            });
        }),
        textPromise: Promise.resolve(`
            window.piGroupId = '${gid}';
        `)
    };
};

// 打开一个测试 webview
export const openTestWebview = (gid) => {
    const gameTitle = '测试';
    const gameUrl =  'http://192.168.31.226/wallet/phoneRedEnvelope/openRedEnvelope.html';
    
    Promise.all([gameChatPromise(gid).textPromise,gameChatPromise(gid).chatPromise]).then(([textContent,chatContent]) => {
        const content = textContent + chatContent;
        WebViewManager.open(gameTitle, `${gameUrl}?${Math.random()}`, gameTitle, content);
    });
};