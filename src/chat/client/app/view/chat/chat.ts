/**
 * 单聊
 */

// ================================================ 导入
import { popNewMessage } from '../../../../../app/utils/tools';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { GROUP_STATE, GroupInfo } from '../../../../server/data/db/group.s';
import { UserHistory } from '../../../../server/data/db/message.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { Result, UserArray } from '../../../../server/data/rpc/basic.s';
import { depCopy, genUuid, getIndexFromHIncId } from '../../../../utils/util';
import { updateUserMessage } from '../../data/parse';
import * as store from '../../data/store';
import { getFriendAlias, INFLAG, timestampFormat } from '../../logic/logic';
import { openNewActivity } from '../../logic/native';
import { applyFriend, getUsersBasicInfo, sendGroupMsg, sendUserMsg } from '../../net/rpc';
import { parseMessage } from '../../widget/messageItem/messageItem';

// ================================================ 导出
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
        this.props.onRadio = null;

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
        if (!this.props.temporary) { // 如果是临时聊天会传名字 不是临时聊天需要获取用户名
            this.props.name = getFriendAlias(this.props.id);
        } 
        if (!this.props.name) {  // 如果获取不到用户名 临时聊天记录
            this.props.temporary = true;
            getUsersBasicInfo([this.props.id]).then((r: UserArray) => {
                this.props.name = r.arr[0].name;
                this.paint();
            },(r) => {
                console.error('获取用户信息失败', r);
            });
        }

        const hIncIdArr = store.getStore(`userChatMap/${this.props.hid}`, []);
        this.props.hincIdArray = hIncIdArr;
        // 第一次进入只加载最后20条记录
        this.props.showHincIdArray = hIncIdArr.length > 20 ? hIncIdArr.slice(-20) :hIncIdArr ; 
        
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
        const hIncIdArr = store.getStore(`groupChatMap/${this.props.hid}`,[]);
        const gInfo = store.getStore(`groupInfoMap/${this.props.id}`,new GroupInfo());
        const lastRead = store.getStore(`lastRead/${this.props.hid}`,{ msgId:undefined,msgType:GENERATOR_TYPE.GROUP });
        this.props.name = `${gInfo.name}(${gInfo.memberids ? gInfo.memberids.length :0})`;
        this.props.hincIdArray = hIncIdArr;
        // 第一次进入只加载最后20条记录
        this.props.showHincIdArray = hIncIdArr.length > 20 ? hIncIdArr.slice(-20) :hIncIdArr; 
        const annouces = gInfo.annoceids;
        const lastAnnounce = annouces && annouces.length > 0 ? annouces[annouces.length - 1] :undefined ;
        // 最新一条公告是否已读
        const count1 = lastAnnounce ? getIndexFromHIncId(lastAnnounce) :-1 ;
        const count2 = lastRead.msgId ? getIndexFromHIncId(lastRead.msgId)  :-1;
        this.props.lastAnnounce = count1 > count2 ? lastAnnounce :undefined;
        
        // 更新上次阅读到哪一条记录        
        const hincId = hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
        lastRead.msgId = hincId;
        store.setStore(`lastRead/${this.props.hid}`,lastRead);

        // 是否已被踢出群或群已经解散
        if (gInfo.state === GROUP_STATE.DISSOLVE) {
            popNewMessage('该群已被解散');
            this.goBack();
        } else if (gInfo.memberids && gInfo.memberids.indexOf(this.props.sid) < 0) {
            popNewMessage('您已离开该群');            
            this.goBack();
        }
    }

    public firstPaint() {
        super.firstPaint();
        setTimeout(() => {
            this.getScrollElem().classList.add('scrollSmooth');   // 进入页面时需要快速定位，之后需要平滑滚动
            getRealNode(this.tree).style.visibility = 'visible';  // 滚动完成后才显示页面 
        }, 100);
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

    /**
     * 发送图片消息之前,预览
     */
    public sendImgBefore(e:any) {
        const message = {
            msg:e.value,
            mtype:e.mtype,
            time:Date.now()
        };
        this.props.newMsg = {
            hIncId:null,
            name:this.props.name,
            me:true,
            message:message,
            time:timestampFormat(message.time,1),
            chatType:this.props.chatType
        };
        this.paint();
    }

    /**
     * 发送真实消息
     */
    public send(e:any) {
        this.props.inputMessage = e.value;
        if (e.msgType < 5) {
            this.props.newMsg = {
                hIncId:null,
                name:this.props.name,
                me:true,
                message:parseMessage(depCopy({
                    mtype: e.msgType,
                    msg: this.props.inputMessage
                })),
                time:timestampFormat(Date.now(),1),
                chatType:this.props.chatType
            };
        }

        // 群聊
        if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            console.log('====群组聊天信息发送',e);
            
            sendGroupMsg(this.props.id,this.props.inputMessage,e.msgType).then(() => {
                // 群聊发送成功
            }, () => {
                popNewMessage('发送失败');
            });
            
        // 临时单聊
        } else if (this.props.temporary) {
            console.log('=========临时单聊信息发送',e);

        // 单聊
        } else {
            console.log('=========单聊信息发送',e);
            sendUserMsg(this.props.id,this.props.inputMessage,e.msgType).then((r:UserHistory) => {
                updateUserMessage(this.props.id, r);
            },() => {
                this.notMyFriend();
            });
           
        }
        this.props.inputMessage = '';
        this.paint();
        this.latestMsg();
        if (!store.getStore('flags',{}).firstChat) {
            store.setStore('flags/firstChat',true);
        }
    }

    /**
     * 对方不是当前用户的好友
     */
    public notMyFriend() {
        const item = document.createElement('div');
        item.setAttribute('style','font-size: 24px;text-align: center;color: #888;margin: 20px;');
        item.innerText = `对方不是你的好友，立即`;
        const innerItem = document.createElement('span');
        innerItem.setAttribute('style','color:#3FA2F7;border:10px solid transparent;');
        innerItem.innerText = '添加好友';
        innerItem.addEventListener('click', () => {
            popNew('chat-client-app-view-chat-addUser',{ rid:this.props.id });
            this.goBack();
        });
        item.appendChild(innerItem);
        document.getElementById('chatMessageBox').appendChild(item);
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
            const links = document.getElementsByClassName('linkMsg');
            for (const i of links) {
                i.addEventListener('click', () => {
                    openNewActivity(i.innerHTML,'其他网页');
                    console.log(i.innerHTML);
                });
            }
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
        popNew('chat-client-app-view-group-groupInfo', { gid:this.props.id, inFlag:INFLAG.chat_group });
    }

    /**
     * 点击某个语音消息，关闭其他语言播放
     */
    public stopRadio(e:any) {
        this.props.onRadio = e;
        this.paint();
    }

    /**
     * 滚动聊天记录，到最上方时加载更早之前的聊天记录
     */
    public scrollMessBox() {
        const item = document.getElementById('chatMessageBox');
        const showlist = this.props.showHincIdArray.length;
        const totallist = this.props.hincIdArray.length;

        if (item.scrollTop < 50 && totallist > showlist) {
            if (totallist - showlist > 20) {
                this.props.showHincIdArray = this.props.hincIdArray.slice(-showlist - 20);
            } else {
                this.props.showHincIdArray = this.props.hincIdArray;
            }
            console.log('！！！加载前20条内容！！！');
            this.paint();
        }
    }

    /**
     * 添加好友
     */
    public addUser() {
        applyFriend(this.props.id.toString(), (r: Result) => {
            if (r.r === 0) {
                popNewMessage(`${this.props.id}已经是你的好友`);
            }
        });
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
        this.ok && this.ok();
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
    hincIdArray: string[]; // 消息历史记录
    showHincIdArray:string[]; // 当前显示的消息记录
    isOnEmoji:boolean; // 是否打开表情选择区
    lastAnnounce:string; // 最新一条公告，群聊
    newMsg:any; // 我发布的一条新消息
    isOnTools:boolean; // 是否打开更多功能
    onRadio:any; // 当前点击的语音消息ID
    temporary:boolean;  // 是否是临时聊天
}