/**
 * textMessage 组件相关处理
 */
// ===========================导入
import { Widget } from '../../../../pi/widget/widget';
import { UserMsg } from '../../../../server/data/db/message.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import * as store from '../../data/store';
import { EMOJIS_MAP } from '../../demo_view/chat/emoji';
import { timestampFormat } from '../../logic/logic';
declare var module;
// ===========================导出
export class TextMessage extends Widget {
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
        this.props.msg = parseEmoji(this.props.msg);
        this.props.me = this.props.msg.sid === store.getStore('uid');
        let time = this.props.msg.time;
        time = timestampFormat(time).split(' ')[1];
        this.props.time = time.substr(0,5);
    }
}

// ================================================ 本地

const parseEmoji = (msg:UserMsg):UserMsg => {
    module.id;
    msg.msg = msg.msg.replace(/\[(\S+?)\]/ig, (match, capture) => {
        let url = EMOJIS_MAP.get(capture) || undefined;
        if (url) {
            // FIXME: 不应该写死,应该动态获取
            url = url.replace('../../','/client/app/');

            return `<img src="${url}" alt="${capture}"></img>`;
        } else {
            return match;
        }
    });

    return msg;
};