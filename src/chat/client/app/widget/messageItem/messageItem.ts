/**
 * textMessage 组件相关处理
 */
// ================================================ 导入
import { inAndroidApp, uploadFileUrlPrefix } from '../../../../../app/publicLib/config';
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
            recallBtn:false,
            avatar:'',  // 对方的头像
            playAudio:false,
            refusedMsg:false, 
            myAvatar:''
        };
       
    }     

    public setProps(props:any) {
        super.setProps(props);
        if (this.props.hIncId) {
            if (this.props.chatType === GENERATOR_TYPE.USER) {
                this.props.message = store.getStore(`userHistoryMap/${this.props.hIncId}`, new UserMsg());
                this.props.avatar = getUserAvatar(this.props.message.sid) || '../../res/images/user_avatar.png';
            } else if (this.props.chatType === GENERATOR_TYPE.GROUP) {
                this.props.message = store.getStore(`groupHistoryMap/${this.props.hIncId}`, new GroupMsg());
                const gid = getGidFromHincid(this.props.hIncId);
                this.props.name = store.getStore(`groupUserLinkMap/${genGuid(gid,this.props.message.sid)}`, new GroupUserLink()).userAlias;
                this.props.avatar = getGroupUserAvatar(gid,this.props.message.sid) || '../../res/images/user_avatar.png';
            }
            this.props.refusedMsg = !this.props.message.send;
            this.props.message = parseMessage(depCopy(this.props.message));
            this.props.me = this.props.message.sid === store.getStore('uid');
            const time = depCopy(this.props.message.time);
            this.props.time = timestampFormat(time,1);
        }
        this.props.myAvatar = getUserAvatar(store.getStore('uid')) || '../../res/images/user_avatar.png';
        
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

    public userDetail(e:any) {
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            popNew('chat-client-app-view-info-userDetail',{ uid:this.props.message.sid, inFlag: INFLAG.chat_user },(r) => {
                if (r) {
                    notify(e.node,'ev-delelte-user',null);
                }
            });
        } else {
            const gid = getGidFromHincid(this.props.hIncId);
            const ownerid = store.getStore(`groupInfoMap/${gid}`,new GroupInfo()).ownerid;
            popNew('chat-client-app-view-info-userDetail',{ uid:this.props.message.sid, inFlag: INFLAG.chat_group, groupId: store.getStore('uid') === ownerid ? gid :null });
        }
    }

    // 长按打开消息撤回
    public openMessageRecall(e:any) {
        notify(e.node,'ev-recall',{ value:this.props.hIncId });
        this.props.recallBtn = true;
        this.paint();
    }

    // 点击撤回
    public recall(e:any) {
        if (this.props.hIncId) {  // 真实发送成功的消息才可以撤回
            notify(e.node,'ev-send',{ value:this.props.hIncId, msgType:MSG_TYPE.RECALL });
            this.props.recallBtn = false;
            this.paint();
        }
    }

    // 点击消息内容
    public msgDetailClick(e:any) {
        this.props.recallBtn = false;
        this.paint();
    }

    // 点击打开红包
    public openRedEnvelope() {
        const redEnvDetail = this.props.message.redEnvDetail;
        if (redEnvDetail) {
            const redEnvDetailProps = { ...redEnvDetail };
            if (redEnvDetail.userHead && redEnvDetail.userHead.indexOf('http://') < 0) {
                redEnvDetailProps.userHead = `${uploadFileUrlPrefix}${redEnvDetail.userHead}`;
            }
            popNew('app-view-earn-exchange-exchangeDetail',redEnvDetailProps);

        } else {
            const user = store.getStore(`userInfoMap/${this.props.message.sid}`,new Map());
            if (user.avatar && user.avatar.indexOf('http://') < 0) {
                user.avatar = `${uploadFileUrlPrefix}${user.avatar}`;
            }
            popNew('app-view-earn-exchange-openRedEnv', { 
                inFlag: 'chat',
                rid: this.props.message.redEnvId,
                message: this.props.message.msg,
                acc_id: user.acc_id,
                userName: user.name,   // 红包发送者的名字 头像
                userHead: user.avatar
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
        const url = this.props.message.msg.compressImg.split('"')[1];
        popNew('chat-client-app-widget-bigImage-bigImage',{ img: url,originalImg:this.props.message.msg.originalImg });
    }

    // 点击播放语音
    public playRadioMess(e:any) {
        const elem = getRealNode(e.node).getElementsByTagName('audio')[0];
        
        if (inAndroidApp) {
            // 关掉所有语音
            const audios = document.getElementsByTagName('audio');
            for (const i of audios) {
                i.pause();
                i.currentTime = 0;
            }
            // 没有正在播放的语音，播放当前点击的语音
            if (!this.props.playAudio) {  
                elem.play();
                setTimeout(() => {
                    if (elem.currentTime === elem.duration) {
                        this.props.playAudio = false;
                        console.log('结束播放语音');
                        elem.pause();
                        elem.currentTime = 0;
                        this.paint();
                    }
                
                }, elem.duration * 1000 + 500); // 多加半秒，确保语音播完
            }
        }
        this.props.playAudio = !this.props.playAudio;
        this.paint();
        console.log(`${this.props.playAudio ? '播放语音' :'暂停语音'}`);

        notify(e.node,'ev-messItem-radio',{ hIncId:this.props.hIncId,playAudio:this.props.playAudio,elem });
    }

    /**
     * 查看文章
     */
    public openArticle() {
        popNew('chat-client-app-view-info-postDetail',{ ...this.props.message.msg,showAll:true });
    }

    /**
     * 查看详情
     */
    public goDetail() {
        if (this.props.message.msg.type === '公众号') {
            popNew('chat-client-app-view-person-publicHome', { uid: this.props.message.msg.uid, pubNum: this.props.message.msg.num });
        } else {
            popNew('chat-client-app-view-info-userDetail', { uid: this.props.message.msg.uid, num:this.props.message.msg.num });
        }
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
    recallBtn:boolean;// 撤回按钮是否可见
    avatar:string;  // 对方的头像
    playAudio:boolean; // 是否正在播放语音
    refusedMsg:boolean; // 信息是否被拒绝
    myAvatar:string;  // 自己的头像
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
    const mess = JSON.parse(msg.msg);
    // 预览图片不解析
    if(mess.compressImg.indexOf('<div') === -1){
        msg.msg = {
            compressImg: `<img src="${uploadFileUrlPrefix}${mess.compressImg}" alt="img" class='imgMsg'></img>`,
            originalImg: uploadFileUrlPrefix + mess.originalImg
        };
    }else{
        msg.msg = mess;
    }

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

            return parseRadio(msg);
        case MSG_TYPE.VIDEO: // 视频
           
            return msg;
        case MSG_TYPE.Article:case MSG_TYPE.NameCard: // 分享文章  // 名片
            const mess = JSON.parse(msg.msg);
            console.log(mess);
        
            return {
                ...msg,
                msg: mess,
                image: mess.imgs && mess.imgs[0] ? uploadFileUrlPrefix + mess.imgs[0] :mess.avatar
            };
        default:

            return msg;
    }
};
