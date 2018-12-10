/**
 * textMessage 组件相关处理
 */
// ===========================导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { MSG_TYPE, UserMsg } from '../../../../server/data/db/message.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import * as store from '../../data/store';
import { EMOJIS_MAP } from '../../demo_view/chat/emoji';
import { timestampFormat } from '../../logic/logic';
import { downloadFileUrlPrefix } from '../../net/upload';
// ===========================导出
export class MessageItem extends Widget {
    constructor() {
        super();
        this.props = {
            hIncId:'',
            name:'',
            msg:null,
            me:true,
            time:'',
            chatType:GENERATOR_TYPE.USER
        };
        this.props.hIncId = '';
        this.props.msg = null; 
        this.props.chatType = GENERATOR_TYPE.USER;
    }     

    public setProps(props:any) {
        super.setProps(props);
        this.props.chatType = props.chatType;
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            this.props.msg = store.getStore(`userHistoryMap/${this.props.hIncId}`);
        } else if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            this.props.msg = store.getStore(`groupHistoryMap/${this.props.hIncId}`);
        }
        this.props.msg = parseMessage(this.props.msg);
        this.props.me = this.props.msg.sid === store.getStore('uid');
        let time = this.props.msg.time;
        time = timestampFormat(time).split(' ')[1];
        this.props.time = time.substr(0,5);
    }

    public userDetail() {
        popNew('client-app-demo_view-info-userDetail',{ uid:this.props.msg.sid });
    }
}

// ================================================ 本地

const parseEmoji = (msg:UserMsg):UserMsg => {    
    msg.msg = msg.msg.replace(/\[(\S+?)\]/ig, (match, capture) => {
        let url = EMOJIS_MAP.get(capture) || undefined;
        if (url) {
            // FIXME: 不应该写死,应该动态获取
            url = url.replace('../../','/client/app/');

            return `<img src="${url}" alt="${capture}" class='emojiMsg'></img>`;
        } else {
            return match;
        }
    });

    return msg;
};

const parseImg = (msg:UserMsg):UserMsg => {    
    msg.msg = msg.msg.replace(/\[(\S+?)\]/ig, (match, url) => {
        return `<img src="${downloadFileUrlPrefix}${url}" alt="img" class='imgMsg'></img>`;
    });

    return msg;
};
const parseMessage = (msg:UserMsg):UserMsg => {
    switch (msg.mtype) {
        case MSG_TYPE.TXT:
            return parseEmoji(msg);
        case MSG_TYPE.IMG:
            return parseImg(msg);
        case MSG_TYPE.VOICE:
        // TODO:
            return msg;
        case MSG_TYPE.VIDEO:
        // TODO:
            return msg;
        default:

            return msg;
    }
};