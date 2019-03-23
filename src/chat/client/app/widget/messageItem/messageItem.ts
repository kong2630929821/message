/**
 * textMessage 组件相关处理
 */
// ================================================ 导入
import { uploadFileUrlPrefix } from '../../../../../app/config';
import { popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo, GroupUserLink } from '../../../../server/data/db/group.s';
import { GroupMsg, MSG_TYPE, UserMsg } from '../../../../server/data/db/message.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { depCopy, genGuid, getGidFromHincid } from '../../../../utils/util';
import * as store from '../../data/store';
import { getGroupUserAvatar, getUserAvatar, INFLAG, timestampFormat } from '../../logic/logic';
import { EMOJIS_MAP } from '../emoji/emoji';
// ================================================ 导出

export class MessageItem extends Widget {
    public props:Props;
    constructor() {
        super();
        this.props = {
            hIncId:'',
            name:'',
            message:null,
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
                this.props.message = store.getStore(`userHistoryMap/${this.props.hIncId}`, new UserMsg());
                this.props.avatar = getUserAvatar(this.props.message.sid) || '../../res/images/user.png';
            } else if (this.props.chatType === GENERATOR_TYPE.GROUP) {
                this.props.message = store.getStore(`groupHistoryMap/${this.props.hIncId}`, new GroupMsg());
                const gid = getGidFromHincid(this.props.hIncId);
                this.props.name = store.getStore(`groupUserLinkMap/${genGuid(gid,this.props.message.sid)}`, new GroupUserLink()).userAlias;
                this.props.avatar = getGroupUserAvatar(gid,this.props.message.sid) || '../../res/images/user.png';
            }
            this.props.message = parseMessage(depCopy(this.props.message));
            this.props.me = this.props.message.sid === store.getStore('uid');
            const time = depCopy(this.props.message.time);
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
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            popNew('chat-client-app-view-info-userDetail',{ uid:this.props.message.sid, inFlag: INFLAG.chat_user });
        } else {
            const gid = getGidFromHincid(this.props.hIncId);
            const ownerid = store.getStore(`groupInfoMap/${gid}`,new GroupInfo()).ownerid;
            popNew('chat-client-app-view-info-userDetail',{ uid:this.props.message.sid, inFlag: INFLAG.chat_group, groupId: store.getStore('uid') === ownerid ? gid :null });
        }
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
        if (this.props.message.redEnvDetail) {
            popNew('app-view-earn-exchange-exchangeDetail',this.props.message.redEnvDetail);

        } else {
            popNew('app-view-earn-exchange-openRedEnv', { 
                inFlag: 'chat',
                rid: this.props.message.redEnvId,
                message: this.props.message.msg
            },(r) => {
                console.log(r);
                if (r) {
                    this.props.message.redEnvDetail = JSON.parse(r);
                    this.paint();

                    if (this.props.chatType === GENERATOR_TYPE.USER) {    
                        const history = store.getStore(`userHistoryMap/${this.props.hIncId}`,new UserMsg());
                        history.msg = r;
                        store.setStore(`userHistoryMap/${this.props.hIncId}`,history);  // 兑换成功记录保存

                    } else {
                        const history = store.getStore(`groupHistoryMap/${this.props.hIncId}`,new GroupMsg());
                        history.msg = r;
                        store.setStore(`groupHistoryMap/${this.props.hIncId}`,history);  // 兑换成功记录保存
                    }
                    
                }
            });
        }
    }

    // 点击查看大图
    public openBigImage() {
        const url = this.props.message.msg.split('"')[1];
        popNew('chat-client-app-widget-bigImage-bigImage',{ img: url });
    }

    // 点击播放语音
    public playRadioMess(e:any) {
        // 关掉所有语音
        const audios = document.getElementsByTagName('audio');
        for (const i of audios) {
            i.pause();
            i.currentTime = 0;
        }
        
        const elem = getRealNode(e.node).getElementsByTagName('audio')[0];
        if (this.props.playRadio) {
            this.props.playRadio = false;
            console.log('暂停播放语音');

        } else {
            this.props.playRadio = true;
            console.log('开始播放语音');
            elem.play();
            
            setTimeout(() => {
                if (elem.currentTime === elem.duration) {
                    this.props.playRadio = false;
                    console.log('结束播放语音');
                    elem.pause();
                    elem.currentTime = 0;
                    this.paint();
                }
                
            }, elem.duration * 1000 + 500); // 多加半秒，确保语音播完
        }
        this.paint();
        notify(e.node,'ev-messItem-radio',{ hIncId:this.props.hIncId,playRadio:this.props.playRadio });

    }
}

// ================================================ 本地
interface Props {
    hIncId:string; // 消息ID
    name:string; // 名称
    message:any; // 消息内容
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

    // 如果记录中有inflag标记说明红包已经领取过
    if (value.inFlag) {  
        msg.redEnvDetail = value;
    } 
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
