/**
 * 最新会话列表项
 */
// ================================================ 导入
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { GroupMsg, MSG_TYPE, UserMsg } from '../../../../server/data/db/message.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { depCopy, genGroupHid, genUserHid, getIndexFromHIncId  } from '../../../../utils/util';
import * as store from '../../data/store';
import { getFriendAlias, getGroupAvatar, getUserAvatar, timestampFormat } from '../../logic/logic';
// ================================================ 导出

export class MessageRecord extends Widget {
    public props: Props;
    public bindCB: any;

    constructor() {
        super();
        this.bindCB = this.updateMessage.bind(this);
    }

    // tslint:disable-next-line:cyclomatic-complexity
    public setProps(props: any) {
        super.setProps(props);
        const sid = store.getStore(`uid`);
        let hid;
        let hincId;  // 最新一条消息的ID
        if (props.chatType === GENERATOR_TYPE.USER) { // 单聊
            this.props.name = getFriendAlias(this.props.rid);
            this.props.avatar = getUserAvatar(this.props.rid) || '../../res/images/user.png';
            hid = genUserHid(sid,this.props.rid);

            const hIncIdArr = store.getStore(`userChatMap/${hid}`,[]);
            hincId = hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
            this.props.lastMessage = hincId ? store.getStore(`userHistoryMap/${hincId}`,'') : new UserMsg();
            
        } else { // 群聊
            const groupInfo = store.getStore(`groupInfoMap/${this.props.rid}`,new GroupInfo());
            this.props.name = groupInfo.name;
            this.props.avatar = getGroupAvatar(this.props.rid) || '../../res/images/groups.png';
            hid = genGroupHid(this.props.rid);

            const hIncIdArr = store.getStore(`groupChatMap/${hid}`,[]);
            hincId = hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
            this.props.lastMessage = hincId ? store.getStore(`groupHistoryMap/${hincId}`,'') : new GroupMsg();

        }

        // 计算有多少条新消息记录
        const lastHincId = store.getStore(`lastRead/${hid}`,{ msgId:undefined }).msgId; // 最后阅读的一条消息ID
        const count1 = hincId ? getIndexFromHIncId(hincId) :-1; // 收到的最新消息ID
        const count2 = lastHincId ? getIndexFromHIncId(lastHincId) :-1; // 已读的最后一条消息ID
        this.props.unReadCount = count1 > count2 && (count1 - count2);

        // 消息额外设置，免打扰|置顶
        const setting = store.getStore('setting',{ msgTop:[],msgAvoid:[] });
        this.props.msgTop = setting.msgTop && setting.msgTop.findIndex(item => item === hid) > -1;
        this.props.msgAvoid = setting.msgAvoid && setting.msgAvoid.findIndex(item => item === hid) > -1;
        
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
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            const hid = genUserHid(store.getStore('uid'), this.props.rid);
            store.register(`userChatMap/${hid}`, this.bindCB);
            store.register(`lastRead/${hid}`,this.bindCB);
        } else {
            const hid = genGroupHid(this.props.rid);
            store.register(`groupChatMap/${hid}`, this.bindCB);
            store.register(`lastRead/${hid}`,this.bindCB);
        }
        store.register('setting',this.bindCB);
    }
    public updateMessage() {
        this.setProps(this.props);
        this.paint();
    }
    public destroy() {
        store.unregister(`userChatMap/${genUserHid(store.getStore('uid'), this.props.rid)}`, this.bindCB);
        store.unregister(`groupChatMap/${genGroupHid(this.props.rid)}`, this.bindCB);
        store.unregister(`lastRead/${genUserHid(store.getStore('uid'), this.props.rid)}`,this.bindCB);
        store.unregister(`lastRead/${genGroupHid(this.props.rid)}`,this.bindCB);

        return super.destroy();
    }
}

// ================================================ 本地

interface Props {
    rid: number;  // uid|gid
    name:string;  // 好友名字|群名字
    time:string;  // 最新一条消息时间
    msg:string;   // 最新一条消息内容
    lastMessage: UserMsg;  // 最新一条消息记录
    chatType:GENERATOR_TYPE; // 消息类型 user|group
    msgAvoid:boolean; // 消息免打扰
    msgTop:boolean; // 置顶
    unReadCount:number;  // 未读消息数
    avatar:string; // 用户头像
}
