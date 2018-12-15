/**
 * textMessage 组件相关处理
 */
// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupUserLink } from '../../../../server/data/db/group.s';
import { GroupMsg, MSG_TYPE, UserMsg } from '../../../../server/data/db/message.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { Logger } from '../../../../utils/logger';
import { depCopy, genGuid, getGidFromHincid } from '../../../../utils/util';
import * as store from '../../data/store';
import { timestampFormat } from '../../logic/logic';
import { downloadFileUrlPrefix } from '../../net/upload';
import { EMOJIS_MAP } from '../emoji/emoji';
// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);export class MessageItem extends Widget {
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
            logger.debug('oooooooooooooo', this.props.msg);
            const gid = getGidFromHincid(this.props.hIncId);
            logger.debug('mmmmmmmmmmmmmmmmm',gid);
            this.props.name = store.getStore(`groupUserLinkMap/${genGuid(gid,this.props.msg.sid)}`, new GroupUserLink()).userAlias;
        }
        this.props.msg = parseMessage(depCopy(this.props.msg));
        logger.debug('==================vvvvvvvvvvvvvvvvv',this.props.msg);
        this.props.me = this.props.msg.sid === store.getStore('uid');
        logger.debug('==================hhhhhhhhhhhhhhhhh',this.props.me);
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

    public userDetail() {
        popNew('chat-client-app-demo_view-info-userDetail',{ uid:this.props.msg.sid });
    }

    // 长按打开消息撤回条组件
    public openMessageRecall() {
        this.props.isMessageRecallVisible = true;
        this.paint();
    }

    // 点击关闭消息撤回组件
    public closeMessageRecall() {
        this.props.isMessageRecallVisible = false;
        this.paint();
    }
}

// ================================================ 本地

const parseEmoji = (msg:UserMsg):UserMsg => {    
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