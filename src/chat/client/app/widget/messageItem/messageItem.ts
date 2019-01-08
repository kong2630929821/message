/**
 * textMessage 组件相关处理
 */
// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupUserLink } from '../../../../server/data/db/group.s';
import { GroupMsg, MSG_TYPE, UserMsg } from '../../../../server/data/db/message.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { depCopy, genGuid, getGidFromHincid } from '../../../../utils/util';
import * as store from '../../data/store';
import { timestampFormat } from '../../logic/logic';
import { downloadFileUrlPrefix } from '../../net/upload';
import { EMOJIS_MAP } from '../emoji/emoji';
// ================================================ 导出

export class MessageItem extends Widget {
    constructor() {
        super();
        this.props = {
            hIncId:'',
            name:'',
            msg:null,
            me:true,
            time:'',
            chatType:GENERATOR_TYPE.USER,
            isMessageRecallVisible:false
        };
        this.props.hIncId = '';
        this.props.msg = null; 
        this.props.chatType = GENERATOR_TYPE.USER;
    }     

    public setProps(props:any) {
        super.setProps(props);
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            this.props.msg = store.getStore(`userHistoryMap/${this.props.hIncId}`, new UserMsg());
        } else if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            this.props.msg = store.getStore(`groupHistoryMap/${this.props.hIncId}`, new GroupMsg());
            const gid = getGidFromHincid(this.props.hIncId);
            this.props.name = store.getStore(`groupUserLinkMap/${genGuid(gid,this.props.msg.sid)}`, new GroupUserLink()).userAlias;
        }
        this.props.msg = parseMessage(depCopy(this.props.msg));
        this.props.me = this.props.msg.sid === store.getStore('uid');
        const time = depCopy(this.props.msg.time);
        this.props.time = timestampFormat(time,1);
    }

    public firstPaint() {
        super.firstPaint();
        // 当消息撤回 更新map
        store.register(`userHistoryMap/${this.props.hIncId}`,() => {
            this.setProps(this.props);
            this.paint();
        });  
        store.register(`groupHistoryMap/${this.props.hIncId}`,() => {
            this.setProps(this.props);
            this.paint();
        });  
    }

    // 点击撤回
    public recall(e:any) {
        notify(e.node,'ev-send',{ value:this.props.hIncId, msgType:MSG_TYPE.RECALL });
        this.props.isMessageRecallVisible = false;
        this.paint();
    }

    public userDetail() {
        const fg = this.props.chatType === GENERATOR_TYPE.USER ? 1 :2;
        popNew('chat-client-app-view-info-userDetail',{ uid:this.props.msg.sid, inFlag: fg });
    }

    // 长按打开消息撤回
    public openMessageRecall() {
        this.props.isMessageRecallVisible = true;
        this.paint();
    }

    // 点击消息内容
    public msgDetailClick(e:any) {
        this.props.isMessageRecallVisible = false;
        this.paint();
        // const links = getRealNode(e.node).getElementsByClassName('linkMsg');
    }

    // 点击打开红包
    public openRedEnvelope() {
        popNew('app-view-earn-exchange-openRedEnv', { 
            inFlag: 'chat',
            cid: this.props.msg.redEnvId,
            message: this.props.msg.msg
        });
    }
}

// ================================================ 本地

// 转换文字中的链接
const httpHtml = (str:string) => {
    const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|:|#)+)/g;
    
    return str.replace(reg, '<a href="javascript:;" class="linkMsg">$1$2</a>');
};

// 转换表情包
const parseEmoji = (msg:any) => {    
    msg.msg = httpHtml(msg.msg);
    msg.msg = msg.msg.replace(/\[(\S+?)\]/ig, (match, capture) => {
        const url = EMOJIS_MAP.get(capture) || undefined;
        if (url) {
            // FIXME: 不应该写死,应该动态获取
            // url = url.replace('../../','/client/app/');

            return `<img src="../../chat/client/app/res/emoji/${url}" alt="${capture}" class='emojiMsg'></img>`;
        } else {
            return match;
        }
    });

    return msg;
};

// 转换图片;
const parseImg = (msg:any) => {    
    msg.msg = msg.msg.replace(/\[(\S+?)\]/ig, (match, url) => {
        return `<img src="${downloadFileUrlPrefix}${url}" alt="img" class='imgMsg'></img>`;
    });

    return msg;
};

// 转换红包
const parseRedEnv = (msg:any) => {
    const value = JSON.parse(msg.msg);
    msg.msg = value.message || '恭喜发财，万事如意';
    msg.redEnvId = value.rid;

    return msg;
};

export const parseMessage = (msg:any):any => {
    switch (msg.mtype) {
        case MSG_TYPE.REDENVELOPE: // 红包

            return parseRedEnv(msg);
        case MSG_TYPE.TXT:  // 文本，表情

            return parseEmoji(msg);
        case MSG_TYPE.IMG:  // 图片

            return parseImg(msg);
        case MSG_TYPE.VOICE:  // 语音
        // TODO:
            return msg;
        case MSG_TYPE.VIDEO: // 视频
        // TODO:
            return msg;
        default:

            return msg;
    }
};
