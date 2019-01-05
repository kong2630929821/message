/**
 * 单聊
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { DEFAULT_ERROR_STR } from '../../../../server/data/constant';
import { GROUP_STATE, GroupInfo } from '../../../../server/data/db/group.s';
import { GroupHistory, MSG_TYPE, UserHistory } from '../../../../server/data/db/message.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { sendGroupMessage, sendUserMessage } from '../../../../server/data/rpc/message.p';
import { GroupSend, UserSend } from '../../../../server/data/rpc/message.s';
import { Logger } from '../../../../utils/logger';
import { depCopy, genUuid, getIndexFromHIncId } from '../../../../utils/util';
import { updateUserMessage } from '../../data/parse';
import * as store from '../../data/store';
import { getFriendAlias, timestampFormat } from '../../logic/logic';
import { clientRpcFunc } from '../../net/init';
import { parseMessage } from '../../widget/messageItem/messageItem';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);
export const forelet = new Forelet();

export class Chat extends Widget {
    public props:Props;
    public bindCB: any;
    public ok: () => void;
    constructor() {
        super();
        this.bindCB = this.updateChat.bind(this);
    }

    public setProps(props:any) {
        super.setProps(props);
        this.props.sid = store.getStore('uid');
        this.props.inputMessage = '';
        this.props.newMsg = undefined;

        if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            this.props.hid = store.getStore(`groupInfoMap/${this.props.id}`,{ hid:'' }).hid;
            this.initGroup();
        } else {
            this.props.hid = store.getStore(`friendLinkMap/${genUuid(this.props.sid, this.props.id)}`,{ hid:'' }).hid;
            this.initUser();
        }
       
        this.latestMsg();
    }

    /**
     * 好友聊天初始化
     */
    public initUser() {
        this.props.name = getFriendAlias(this.props.id);
        const hIncIdArr = store.getStore(`userChatMap/${this.props.hid}`, []);
        this.props.hidIncArray = hIncIdArr; 

        // 更新上次阅读到哪一条记录
        const hincId = hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
        const lastRead = store.getStore(`lastRead/${this.props.hid}`,{ msgId:undefined,msgType:GENERATOR_TYPE.USER });
        lastRead.msgId = hincId;
        store.setStore(`lastRead/${this.props.hid}`,lastRead);
    }

    /**
     * 群组聊天初始化
     */
    public initGroup() {
        this.props.hidIncArray = store.getStore(`groupChatMap/${this.props.hid}`,[]);
        const gInfo = store.getStore(`groupInfoMap/${this.props.id}`,new GroupInfo());
        const lastRead = store.getStore(`lastRead/${this.props.hid}`,{ msgId:undefined,msgType:GENERATOR_TYPE.GROUP });
        this.props.name = `${gInfo.name}(${gInfo.memberids.length})`;

        const annouces = gInfo.annoceids;
        const lastAnnounce = annouces && annouces.length > 0 ? annouces[annouces.length - 1] :undefined ;
        // 最新一条公告是否已读
        const count1 = lastAnnounce ? getIndexFromHIncId(lastAnnounce) :-1 ;
        const count2 = lastRead.msgId ? getIndexFromHIncId(lastRead.msgId)  :-1;
        this.props.lastAnnounce = count1 > count2 ? lastAnnounce :undefined;
        
        // 更新上次阅读到哪一条记录        
        const hincId = this.props.hidIncArray.length > 0 ? this.props.hidIncArray[this.props.hidIncArray.length - 1] : undefined;
        lastRead.msgId = hincId;
        store.setStore(`lastRead/${this.props.hid}`,lastRead);

        // 是否已被踢出群或群已经解散
        if (gInfo.state === GROUP_STATE.DISSOLVE) {
            alert('该群已被解散');
            this.ok();
        } else if (gInfo.memberids.indexOf(this.props.sid) < 0) {
            alert('您已被移除该群');
            this.ok();
        }
    }

    public firstPaint() {
        super.firstPaint();
        setTimeout(() => {
            this.getScrollElem().classList.add('scrollSmooth');   // 进入页面时需要快速定位，之后需要平滑滚动
            getRealNode(this.tree).style.visibility = 'visible';  // 滚动完成后才显示页面 
        }, 500);
        if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            store.register(`groupChatMap/${this.props.hid}`,this.bindCB);
            store.register(`groupInfoMap/${this.props.id}`,this.bindCB);
        } else {
            store.register(`userChatMap/${this.props.hid}`,this.bindCB);
        }
    
    }

    /**
     * 更新聊天记录
     */
    public updateChat() {
        this.setProps(this.props);
        this.paint();
        
    }

    public send(e:any) {
        this.props.inputMessage = e.value;
        if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            logger.debug('====群组聊天信息发送',e);
            const message = new GroupSend();
            message.gid = this.props.id;
            message.msg = this.props.inputMessage;
            message.mtype = e.msgType || MSG_TYPE.TXT;
            message.time = (new Date()).getTime();
            if (e.msgType < 5) {
                this.props.newMsg = {
                    msg:parseMessage(depCopy(message)).msg,
                    time:timestampFormat(message.time,1)
                };
            }
            clientRpcFunc(sendGroupMessage, message, (r: GroupHistory) => {
    
                if (r.hIncId === DEFAULT_ERROR_STR) {
                    alert('发送失败！');
                    
                    return;
                } 
            });

        } else {
            
            logger.debug('=========单聊信息发送',e);
            const info = new UserSend();
            info.msg = this.props.inputMessage;
            info.mtype = e.msgType || MSG_TYPE.TXT;
            info.rid = this.props.id;
            info.time = (new Date()).getTime();
            if (e.msgType < 5) {
                this.props.newMsg = {
                    msg:parseMessage(depCopy(info)).msg,
                    time:timestampFormat(info.time,1)
                };
            }
            clientRpcFunc(sendUserMessage, info, (r:UserHistory) => {
                const nextside = this.props.id;
    
                if (r.hIncId === DEFAULT_ERROR_STR) {
                    alert('对方不是你的好友！');
                    
                    return;
                } 
                updateUserMessage(nextside, r);
            });
        }
        this.props.inputMessage = '';
        this.paint();
        this.latestMsg();
    }

    /**
     * 输入框内容变化
     */ 
    public msgChange(e:any) {
        this.props.inputMessage = e.value;
        this.paint();
    }

    /**
     * 点击页面
     */
    public pageClick() {
        this.props.isOnEmoji = false;
        this.props.isOnTools = false;
        this.paint();
    }

    /**
     * 打开表情库
     */
    public openEmoji() {
        this.props.isOnEmoji = !this.props.isOnEmoji;
        this.props.isOnTools = false;
        this.paint();
        this.latestMsg();
    }

    /**
     * 打开更多功能
     */
    public openTools() {
        this.props.isOnTools = !this.props.isOnTools;
        this.props.isOnEmoji = false;
        this.paint();
        this.latestMsg();
    }

    /**
     * 输入框聚焦
     */
    public inputFocus() {
        this.props.isOnEmoji = false;
        this.props.isOnTools = false;
        this.paint();
        this.latestMsg();
    }

    /**
     * 选择表情
     */
    public pickEmoji(emoji:any) {
        this.props.inputMessage += `[${emoji}]`;
        this.paint();
    }

    // 关闭公告
    public closeAnnounce() {
        this.props.lastAnnounce = undefined;
        this.paint();
    }

    /**
     * 定位最新消息
     */
    public latestMsg() {
        setTimeout(() => {
            this.getScrollElem().scrollTop = this.getScrollElem().scrollHeight;
            this.paint();
        }, 100);
        
    }

    /**
     * 获取滚动区元素
     */
    public getScrollElem() {
        return getRealNode((<any>this.tree).children[1]);
    }

    /**
     * 查看群详细信息
     */
    public groupDetail() {
        popNew('chat-client-app-view-group-groupInfo', { gid:this.props.id });
    }

    public destroy() {
        if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            store.unregister(`groupChatMap/${this.props.hid}`,this.bindCB);
            store.unregister(`groupInfoMap/${this.props.id}`,this.bindCB);
        } else {
            store.unregister(`userChatMap/${this.props.hid}`,this.bindCB);
        }

        return super.destroy();
    }
    public goBack() {
        this.ok();
    }

}

// ================================================ 本地
interface Props {
    sid: number;  // 我的ID
    id: number;  // 好友ID|群ID
    hid:string;  // 好友hid|群hid
    chatType:string; // 群聊|单聊
    name:string;  // 群名或好友名
    inputMessage:string;  // 输入框内容
    hidIncArray: string[]; // 消息历史记录
    isOnEmoji:boolean; // 是否打开表情选择区
    lastAnnounce:string; // 最新一条公告，群聊
    newMsg:any; // 我发布的一条新消息
    isOnTools:boolean; // 是否打开更多功能
}