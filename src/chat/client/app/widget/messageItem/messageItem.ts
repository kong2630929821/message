/**
 * textMessage 组件相关处理
 */
// ================================================ 导入
import { uploadFileUrlPrefix } from '../../../../../app/config';
import { popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupUserLink } from '../../../../server/data/db/group.s';
import { GroupMsg, MSG_TYPE, UserMsg } from '../../../../server/data/db/message.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { depCopy, genGuid, getGidFromHincid } from '../../../../utils/util';
import * as store from '../../data/store';
import { getGroupUserAvatar, getUserAvatar, timestampFormat } from '../../logic/logic';
import { EMOJIS_MAP } from '../emoji/emoji';
// ================================================ 导出

export class MessageItem extends Widget {
    public props:Props;
    constructor() {
        super();
        this.props = {
            hIncId:'',
            name:'',
            msg:null,
            me:true,
            time:'',
            chatType:GENERATOR_TYPE.USER,
            isMessageRecallVisible:false,
            avatar:'',  // 对方的头像
            playRadio:false
        };
       
    }     

    public setProps(props:any) {
        super.setProps(props);
        if (this.props.hIncId) {
            if (this.props.chatType === GENERATOR_TYPE.USER) {
                this.props.msg = store.getStore(`userHistoryMap/${this.props.hIncId}`, new UserMsg());
                this.props.avatar = getUserAvatar(this.props.msg.sid) || '../../res/images/user.png';
            } else if (this.props.chatType === GENERATOR_TYPE.GROUP) {
                this.props.msg = store.getStore(`groupHistoryMap/${this.props.hIncId}`, new GroupMsg());
                const gid = getGidFromHincid(this.props.hIncId);
                this.props.name = store.getStore(`groupUserLinkMap/${genGuid(gid,this.props.msg.sid)}`, new GroupUserLink()).userAlias;
                this.props.avatar = getGroupUserAvatar(gid,this.props.msg.sid) || '../../res/images/user.png';
            }
            this.props.msg = parseMessage(depCopy(this.props.msg));
            this.props.me = this.props.msg.sid === store.getStore('uid');
            const time = depCopy(this.props.msg.time);
            this.props.time = timestampFormat(time,1);
        }
        
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
        if (this.props.hIncId) {  // 真实发送成功的消息才可以撤回
            notify(e.node,'ev-send',{ value:this.props.hIncId, msgType:MSG_TYPE.RECALL });
            this.props.isMessageRecallVisible = false;
            this.paint();
        }
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
    }

    // 点击打开红包
    public openRedEnvelope() {
        popNew('app-view-earn-exchange-openRedEnv', { 
            inFlag: 'chat',
            cid: this.props.msg.redEnvId,
            message: this.props.msg.msg
        });
    }

    // 点击查看大图
    public openBigImage() {
        const url = this.props.msg.msg.split('"')[1];
        popNew('chat-client-app-widget-bigImage-bigImage',{ img: url });
    }

    // 点击播放语音
    public playRadioMess(e:any) {
        const elem = getRealNode(e.node).getElementsByTagName('audio')[0];
        if (elem.currentTime > 0) {
            this.props.playRadio = false;
            console.log('暂停播放语音');
            elem.pause();
            elem.currentTime = 0;

        } else {
            this.props.playRadio = true;
            console.log('开始播放语音');
            elem.play();
            
            setTimeout(() => {
                this.props.playRadio = false;
                console.log('结束播放语音');
                elem.pause();
                elem.currentTime = 0;
                this.paint();
            }, elem.duration * 1000);
        }
        this.paint();
    }
}

// ================================================ 本地
interface Props {
    hIncId:string; // 消息ID
    name:string; // 名称
    msg:any; // 消息内容
    me:boolean; // 是否是本人
    time:string;// 消息发送时间
    chatType:GENERATOR_TYPE;// 消息类型
    isMessageRecallVisible:boolean;// 撤回按钮是否可见
    avatar:string;  // 对方的头像
    playRadio:boolean; // 是否正在播放语音
}

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
        return `<img src="${uploadFileUrlPrefix}${url}" alt="img" class='imgMsg'></img>`;
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

// 转换音频文件
const parseRadio = (msg:any) => {
    const value = JSON.parse(msg.msg);
    msg.msg = `${value.time}"<audio src="${uploadFileUrlPrefix}${value.message}">语音信息</audio>`;
    msg.width = value.time;

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
            return parseRadio(msg);
        case MSG_TYPE.VIDEO: // 视频
        // TODO:
            return msg;
        default:

            return msg;
    }
};
