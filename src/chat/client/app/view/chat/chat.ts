/**
 * 单聊
 */

// ================================================ 导入
import { inIOSApp } from '../../../../../app/public/config';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { GROUP_STATE, GroupInfo } from '../../../../server/data/db/group.s';
import { UserHistory } from '../../../../server/data/db/message.s';
import { GENERATOR_TYPE, VIP_LEVEL } from '../../../../server/data/db/user.s';
import { Result, UserArray } from '../../../../server/data/rpc/basic.s';
import { depCopy, genGroupHid, genUserHid, genUuid, getIndexFromHIncId } from '../../../../utils/util';
import { updateUserMessage } from '../../data/parse';
import * as store from '../../data/store';
import { getFriendAlias, getUserAvatar, INFLAG, timestampFormat } from '../../logic/logic';
import { openNewActivity } from '../../logic/native';
import { popNewMessage } from '../../logic/tools';
import { applyUserFriend, getUsersBasicInfo, sendGroupMsg, sendTempMsg, sendUserMsg } from '../../net/rpc';
import { parseMessage } from '../../widget/messageItem/messageItem';

// ================================================ 导出
export const forelet = new Forelet();

export class Chat extends Widget {
    public props:Props;
    public bindCB: any;
    public ok: () => void;
    private audioContext:any = window.AudioContext ? new AudioContext() : new webkitAudioContext();
    private audioSource:any;
    constructor() {
        super();
        this.bindCB = this.updateChat.bind(this);
    }

    public setProps(props:any) {
        super.setProps(props);
        this.props.sid = store.getStore('uid');
        this.props.inputMessage = '';
        this.props.newMsg = null;
        this.props.activeAudio = null;
        this.audioSource = null;

        if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            this.props.hid = genGroupHid(this.props.id);
            this.initGroup();
        } else {
            this.props.hid = genUserHid(this.props.sid, this.props.id);
            this.initUser();
        }
        
        this.latestMsg();
    }

    /**
     * 好友聊天初始化
     */
    public initUser() {
        const level = store.getStore(`userInfoMap/${this.props.id}`,{ level:0 }).level;  // 对方的等级
        const myLevel = store.getStore(`userInfoMap/${this.props.sid}`,{ level:0 }).level;  // 当前用户的等级
        if (!this.props.temporary) { // 如果是临时聊天会传名字 不是临时聊天需要获取用户名
            this.props.name = getFriendAlias(this.props.id).name;
            this.props.avatar = getUserAvatar(this.props.id) || '../../res/images/user_avatar.png';
            this.props.temporary = level !== VIP_LEVEL.VIP5 && !getFriendAlias(this.props.id).isFriend;  // 不是官方客服且不是好友则是临时聊天
        } 
        if (!this.props.name) {  // 获取不到用户名
            getUsersBasicInfo([this.props.id]).then((r: UserArray) => {
                this.props.name = r.arr[0].name;
                this.props.avatar = r.arr[0].avatar || '../../res/images/user_avatar.png';
                store.setStore(`userInfoMap/${this.props.id}`,r.arr[0]);
                this.props.temporary = r.arr[0].level !== VIP_LEVEL.VIP5;
                this.paint();
            },(r) => {
                console.error('获取用户信息失败', r);
            });
        }
        // 当前用户自己是客服 都不需要提示加好友
        if (myLevel === VIP_LEVEL.VIP5) {
            this.props.temporary = false;
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
        this.props.name = gInfo.name;
        this.props.text = `(${gInfo.memberids ? gInfo.memberids.length :0})`;  // 群成员个数展示
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

        // 群已经解散 已被踢出群
        if ((!isNaN(gInfo.state) && gInfo.state === GROUP_STATE.DISSOLVE) || (gInfo.memberids && gInfo.memberids.indexOf(this.props.sid) < 0)) {  
            this.deleteRecord();
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
            store.register(`groupUserlinkMap`,this.bindCB);
        } else {
            store.register(`userChatMap/${this.props.hid}`,this.bindCB);
            store.register(`friendLinkMap/${genUuid(this.props.sid,this.props.id)}`,(r) => {
                this.props.name = r.alias;
                this.paint();
            });
        }
        
    }

    // 删除已解散或已退出的对话记录
    public deleteRecord() {
        const chatList = store.getStore('lastChat',[]);
        const ind = chatList.findIndex(item => item[0] === this.props.id && item[2] === GENERATOR_TYPE.GROUP);
        ind > -1 && chatList.splice(ind,1);
        store.setStore('lastChat',chatList);

        const readList = store.getStore('lastRead',new Map());
        readList.delete(this.props.hid);
        store.setStore('lastRead',readList);
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
        this.props.newMsg = {
            hIncId:null,
            name:this.props.name,
            me:true,
            message:parseMessage(depCopy({
                mtype: e.msgType,
                msg: e.value
            })),
            time:timestampFormat(Date.now(),1),
            chatType:this.props.chatType
        };
        console.log('预览图片',this.props.newMsg);
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
        } else if (this.props.temporary || this.props.groupId) {
            console.log('=========临时单聊信息发送',e);
            sendTempMsg(this.props.id,this.props.groupId,this.props.inputMessage,e.msgType).then((r:UserHistory) => {
                updateUserMessage(this.props.id, r, this.props.groupId);
            });

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
            const userinfo = store.getStore(`userInfoMap/${this.props.id}`,null);
            if (userinfo) {
                popNew('chat-client-app-view-chat-addUser',{ rid: userinfo.acc_id });
            }
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
        this.props.isOnAudio = false;
        this.props.activeMessId = null;
        this.paint();
    }

    /**
     * 打开表情库
     */
    public openEmoji() {
        this.props.isOnEmoji = !this.props.isOnEmoji;
        this.props.isOnTools = false;
        this.props.isOnAudio = false;
        this.props.activeMessId = null;
        this.paint();
        this.latestMsg();
    }

    /**
     * 打开语音
     */
    public openAudio() {
        this.props.isOnAudio = !this.props.isOnAudio;
        this.props.isOnEmoji = false;
        this.props.isOnTools = false;
        this.props.activeMessId = null;
        this.paint();
        this.latestMsg();
    }

    /**
     * 打开更多功能
     */
    public openTools() {
        this.props.isOnTools = !this.props.isOnTools;
        this.props.isOnEmoji = false;
        this.props.isOnAudio = false;
        this.props.activeMessId = null;
        this.paint();
        this.latestMsg();
    }

    /**
     * 输入框聚焦
     */
    public inputFocus() {
        this.pageClick();
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
            const $scrollElem = this.getScrollElem();
            // console.log($scrollElem.scrollHeight);
            $scrollElem.scrollTop = $scrollElem.scrollHeight;
            this.paint();
        }, 100);
        
    }

    /**
     * 获取滚动区元素
     */
    public getScrollElem() {
        if (this.props.temporary || this.props.groupId) { // 临时聊天会多一个div
            return getRealNode((<any>this.tree).children[2]);

        } else {
            return getRealNode((<any>this.tree).children[1]);
        }
    }

    /**
     * 查看群详细信息
     */
    public groupDetail() {
        popNew('chat-client-app-view-group-groupInfo', { gid:this.props.id, inFlag:INFLAG.chat_group },(r) => {
            if (r) {
                this.goBack();
            }
        });
    }

    /**
     * 点击某个语音消息，关闭其他语言播放
     */
    public playRadio(e:any) {
        if (this.audioSource) { // 关闭当前正在播放的语音
            this.audioSource.stop();
            this.audioSource.onended = null;
            this.audioSource = null;
        }
        this.props.activeAudio = e;
        this.paint();

        if (e.playAudio && inIOSApp) {  // 播放当前选中的语音
            const source = this.audioContext.createBufferSource(); 
            const request = new XMLHttpRequest();
            request.open('GET', e.elem.src, true);
            request.responseType = 'arraybuffer';
            request.onload = () => {
                const audioData = request.response;
                this.audioContext.decodeAudioData(audioData, (buffer) => {
                    source.buffer = buffer;
                    source.connect(this.audioContext.destination);
                    source.start();
                    source.onended = () => {
                        source.stop();
                        console.log('结束播放语音');
                        this.props.activeAudio.playAudio = false;
                        this.audioSource = null;
                        this.paint();
                    };
                    this.audioSource = source;
                });
            };

            request.send();
        }

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
        applyUserFriend(this.props.id.toString()).then((r: Result) => {
            if (r.r === 0) {
                popNewMessage(`${this.props.id}已经是你的好友`);
            } else {
                popNewMessage('发送成功');
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
        if (this.props.okCB) {
            this.props.okCB && this.props.okCB();
            setTimeout(() => {
                this.ok && this.ok();
            },500);
        } else {
            this.ok && this.ok();
        }

    }

    // 长按显示撤回按钮
    public openMessageRecall(e:any) {
        this.props.activeMessId = e.value;
        this.paint();
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
    activeAudio:any; // 当前点击的语音消息
    temporary:boolean;  // 是否是临时聊天
    groupId:number; // 当前群聊ID 群主可与成员私聊
    okCB:any;  // 游戏中进入携带的参数
    avatar:string; // 头像
    text:string;  // 群成员个数展示
    activeMessId:string;  // 当前选中要撤回的消息ID
    recallBtn:string; // 撤回按钮位置
    isOnAudio:boolean;  // 是否打开语音录入
}