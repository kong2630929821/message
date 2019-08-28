/**
 * 最新会话列表项
 */
// ================================================ 导入
import { notify } from '../../../../../pi/widget/event';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { GroupMsg, MSG_TYPE, UserMsg } from '../../../../server/data/db/message.s';
import { GENERATOR_TYPE, VIP_LEVEL } from '../../../../server/data/db/user.s';
import { setData } from '../../../../server/data/rpc/basic.p';
import { UserArray } from '../../../../server/data/rpc/basic.s';
import { depCopy, genGroupHid, genUserHid, getIndexFromHIncId  } from '../../../../utils/util';
import * as store from '../../data/store';
import { getFriendAlias, getGroupAvatar, getMessageIndex, getUserAvatar, timestampFormat } from '../../logic/logic';
import { clientRpcFunc } from '../../net/init';
import { getUsersBasicInfo } from '../../net/rpc';
// ================================================ 导出

interface Props {
    rid: number;  // uid|gid
    hid:string;   // hid
    name:string;  // 好友名字|群名字
    time:string;  // 最新一条消息时间
    msg:string;   // 最新一条消息内容
    lastMessage: UserMsg;  // 最新一条消息记录
    chatType:GENERATOR_TYPE; // 消息类型 user|group
    msgAvoid:boolean; // 消息免打扰
    msgTop:boolean; // 置顶
    unReadCount:number;  // 未读消息数
    avatar:string; // 用户头像
    official:boolean; // 是否是官方群组
    showUtils:boolean;  // 是否显示操作栏
    messageFlag:boolean;// 消息通知
    messageTime:number;// 消息通知时间
}
const STATE = [];
export class MessageCard extends Widget {
    public props: Props;
    public bindCB: any;
    constructor() {
        super();
        this.bindCB = this.updateMessage.bind(this);
    }

    public setProps(props: any) {
        super.setProps(props);
        this.state = STATE;
        const sid = store.getStore(`uid`);
        let hincId;  // 最新一条消息的ID
        if (props.messageFlag) {
            const time = depCopy(this.props.messageTime);
            this.props.name = '消息通知';
            this.props.avatar = '../../res/images/user_avatar.png';
            this.props.official = true;
            this.props.time = timestampFormat(time,1);
            if (props.chatType === store.GENERATORTYPE.NOTICE_1) {
                this.props.msg = '你邀请的好友上线了';
            } else if (props.chatType === store.GENERATORTYPE.NOTICE_2) {
                this.props.msg = '邀请你的好友上线了';
            } else if (props.chatType === store.GENERATORTYPE.NOTICE_3) {
                this.props.msg = '有人赞了你的动态';
            } else if (props.chatType === store.GENERATORTYPE.NOTICE_4) {
                this.props.msg = '有人@了你';
            }
       
            const arr = store.getStore('lastReadNotice',[]);
         
            const count1  = getMessageIndex([props.rid,time,props.chatType]) ;
            const count2  =  getMessageIndex(arr);
            this.props.unReadCount = count1 > count2 && (count1 - count2);
        } else {
            if (props.chatType === GENERATOR_TYPE.GROUP)  { // 群聊
                const groupInfo = store.getStore(`groupInfoMap/${this.props.rid}`,new GroupInfo());
                this.props.official = groupInfo.level === 5;
                this.props.name = groupInfo.name;
                this.props.avatar = getGroupAvatar(this.props.rid) || '../../res/images/groups.png';
                this.props.hid = genGroupHid(this.props.rid);
    
                const hIncIdArr = store.getStore(`groupChatMap/${this.props.hid}`,[]);
                hincId = hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
                this.props.lastMessage = hincId ? store.getStore(`groupHistoryMap/${hincId}`,'') : new GroupMsg();
    
            } else {// 单聊
                this.props.name = getFriendAlias(this.props.rid).name;
                if (!this.props.name) {  // 获取不到用户名
                    getUsersBasicInfo([this.props.rid]).then((r: UserArray) => {
                        this.props.name = r.arr[0].name;
                        store.setStore(`userInfoMap/${this.props.rid}`,r.arr[0]);
                        this.paint();
                    },(r) => {
                        console.error('获取用户信息失败', r);
                    });
                }
                this.props.avatar = getUserAvatar(this.props.rid) || '../../res/images/user_avatar.png';
                this.props.hid = genUserHid(sid,this.props.rid);
    
                const hIncIdArr = store.getStore(`userChatMap/${this.props.hid}`,[]);
                hincId = hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
                this.props.lastMessage = hincId ? store.getStore(`userHistoryMap/${hincId}`,'') : new UserMsg();
                this.props.official = store.getStore(`userInfoMap/${this.props.rid}`,{ level:0 }).level === VIP_LEVEL.VIP5;
            }
    
            // 计算有多少条新消息记录
            const lastHincId = store.getStore(`lastRead/${this.props.hid}`,{ msgId:undefined }).msgId; // 最后阅读的一条消息ID
            const count1 = hincId ? getIndexFromHIncId(hincId) :-1; // 收到的最新消息ID
            const count2 = lastHincId ? getIndexFromHIncId(lastHincId) :-1; // 已读的最后一条消息ID
            this.props.unReadCount = count1 > count2 && (count1 - count2);
            console.log(`count1 is: ${count1}, count2 is: ${count2}, hid is: ${this.props.hid}`);
    
            this.initData();
        }
        
    }

    public initData() {
        // 消息额外设置，免打扰|置顶
        const setting = store.getStore('setting',{ msgTop:[],msgAvoid:[] });
        this.props.msgTop = setting.msgTop && setting.msgTop.findIndex(item => item === this.props.hid) > -1;
        this.props.msgAvoid = setting.msgAvoid && setting.msgAvoid.findIndex(item => item === this.props.hid) > -1;
        
        // 最新一条消息内容处理，空结构体等于true
        if (this.props.lastMessage.time) {
            const time:any = depCopy(this.props.lastMessage.time);
            this.props.time = timestampFormat(time,1);
            this.props.msg = depCopy(this.props.lastMessage.msg);
            if (this.props.lastMessage.mtype === MSG_TYPE.IMG) {
                this.props.msg = '[图片]';
            } else if (this.props.lastMessage.mtype === MSG_TYPE.RECALL) {
                this.props.msg = '[消息撤回]';
            } else if (this.props.lastMessage.mtype === MSG_TYPE.NOTICE) {
                this.props.msg = '[新公告]';
            } else if (this.props.lastMessage.mtype === MSG_TYPE.RENOTICE) {
                this.props.msg = '[公告撤回]';
            } else if (this.props.lastMessage.mtype === MSG_TYPE.REDENVELOPE) {
                this.props.msg = '[快抢红包]';
            } else if (this.props.lastMessage.mtype === MSG_TYPE.VOICE) {
                this.props.msg = '[语音]';
            } else if (this.props.lastMessage.mtype === MSG_TYPE.Article) {
                this.props.msg = '[分享文章]';
            } else if (this.props.lastMessage.mtype === MSG_TYPE.NameCard) {
                this.props.msg = '[推荐名片]';
            }
        } else {
            const mess = store.getStore('lastChat',[]);
            const index = mess.findIndex(item => item[0] === this.props.rid && item[2] === this.props.chatType);
            this.props.time = index > -1 && timestampFormat(mess[index][1],1);
            this.props.msg = '';
        }
    }

    public firstPaint() {
        super.firstPaint();
        store.register('setting',this.bindCB);
        store.register('lastReadNotice',(r:any) => {
            this.setProps(this.props);
        });
    }
    
    // 更新消息
    public updateMessage() {
        this.setProps(this.props);
        this.paint();
    }

    // 点击进入聊天页面清除未读消息数
    public clearUnread(e:any) {
        notify(e.node,'ev-chat',null);
        this.props.unReadCount = 0;
        this.props.showUtils = false;
        this.paint();
    }

    // 操作栏显示隐藏
    // public changeUtils(e:any) {
        // this.props.showUtils = !this.props.showUtils;
        // this.paint(); 
        // notify(e.node,'ev-msgCard-utils',{ value:this.props.showUtils });
    // }
    
    // 动画效果执行
    public onShow(e:any) {
        getRealNode(e.node).classList.add('ripple');
    }

    // 移除动画效果
    public onRemove(e:any) {
        getRealNode(e.node).classList.remove('ripple');
    }

    /**
     * 设置消息免打扰
     */
    public msgAvoid(e:any) {
        this.props.msgAvoid = !this.props.msgAvoid;
        const sid = store.getStore('uid');
        const hid = genUserHid(sid,this.props.rid);
        const setting = store.getStore('setting',{ msgAvoid:[],msgTop:[] });
        const index = setting.msgAvoid.findIndex(item => item === hid);
        if (this.props.msgAvoid) {
            index === -1 && setting.msgAvoid.push(hid);
        } else {
            setting.msgAvoid.splice(index,1);
        }
        store.setStore('setting',setting);
        console.log('setting: ',setting);
        clientRpcFunc(setData,JSON.stringify(setting),(res) => {
            console.log(res);
        });
        notify(e.node,'ev-msgCard-utils',{ value:false });
    }

    /**
     * 设置消息置顶
     */
    public msgTop(e:any) {
        this.props.msgTop = !this.props.msgTop;
        const setting = store.getStore('setting',{ msgAvoid:[],msgTop:[] });
        const sid = store.getStore('uid');
        const hid = genUserHid(sid,this.props.rid);
        const index = setting.msgTop.findIndex(item => item === hid);
        if (this.props.msgTop) {
            index === -1 && setting.msgTop.push(hid);
        } else {
            setting.msgTop.splice(index,1);
        }
        store.setStore('setting',setting);
        console.log('setting: ',setting);
        this.pushLastChat(this.props.msgTop,setting);
        clientRpcFunc(setData,JSON.stringify(setting),(res) => {
            console.log(res);
        });
        notify(e.node,'ev-msgCard-utils',{ value:false });
    }

    // 压入最近聊天列表
    public pushLastChat(fg:boolean,setting:any) {
        const lastChat = store.getStore(`lastChat`, []);
        const ind = lastChat.findIndex(item => item[0] === this.props.rid && item[2] === GENERATOR_TYPE.USER);
        ind > -1 && lastChat.splice(ind, 1); 
        
        if (fg) { // 置顶放到最前面
            lastChat.unshift([this.props.rid, Date.now(), GENERATOR_TYPE.USER]); // 向前压入数组中

        } else {  // 取消置顶放到置顶消息后
            const len = setting.msgTop.length;
            lastChat.splice(len, 0, [this.props.rid, Date.now(), GENERATOR_TYPE.USER]); // 压入到置顶消息后
        }
        store.setStore(`lastChat`,lastChat);

    }

    // 停止冒泡
    public stopDown(e:any) {
        console.log(e);
        e.native.stopPropagation();
    }
}

// ================================================ 本地