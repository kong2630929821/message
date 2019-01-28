
import { uploadFileUrlPrefix } from '../../../../app/config';
import { DEFAULT_ERROR_STR } from '../../../server/data/constant';
import { GroupInfo } from '../../../server/data/db/group.s';
import { GroupHistory, MSG_TYPE } from '../../../server/data/db/message.s';
import { sendGroupMessage } from '../../../server/data/rpc/message.p';
import { GroupSend } from '../../../server/data/rpc/message.s';
import { genGroupHid, genGuid, getGidFromHincid, depCopy } from '../../../utils/util';
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
    var res = depCopy(msg.msg);
    if(msg.mtype==MSG_TYPE.VOICE || msg.mtype==MSG_TYPE.REDENVELOPE){
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
