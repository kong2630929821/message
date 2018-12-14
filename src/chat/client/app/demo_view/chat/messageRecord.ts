/**
 * 最新会话列表项
 */
// ================================================ 导入
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { MSG_TYPE, UserMsg } from '../../../../server/data/db/message.s';
import { FriendLink, GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { depCopy, genGroupHid, genUserHid, genUuid, getIndexFromHIncId  } from '../../../../utils/util';
import * as store from '../../data/store';
import { getFriendAlias, timestampFormat } from '../../logic/logic';
// ================================================ 导出

export class MessageRecord extends Widget {
    public props: Props;
    public bindCB: any;

    constructor() {
        super();
        this.bindCB = this.updateMessage.bind(this);
    }

    public setProps(props: any) {
        super.setProps(props);
        const sid = store.getStore(`uid`);
        if (props.chatType === GENERATOR_TYPE.USER) { // 单聊
            this.props.name = getFriendAlias(this.props.rid);
            const friendLink = store.getStore(`friendLinkMap/${genUuid(sid,this.props.rid)}`,new FriendLink());
            const hid = friendLink.hid;
            const hIncIdArr = store.getStore(`userChatMap/${hid}`,[]);
            const hincId = hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
            this.props.lastMessage = hincId ? store.getStore(`userHistoryMap/${hincId}`,'') : '没有最新消息';
            const lastHincId = store.getStore(`lastRead/${genUserHid(sid,this.props.rid)}`,{ msgId:undefined }).msgId;

            // 计算有多少条新消息记录
            const count1 = hincId ? getIndexFromHIncId(hincId) :-1;
            const count2 = lastHincId ? getIndexFromHIncId(lastHincId) :-1;
            this.props.unReadCount = count1 - count2;

        } else { // 群聊
            const groupInfo = store.getStore(`groupInfoMap/${this.props.rid}`,new GroupInfo());
            this.props.name = groupInfo.name;
            const hIncIdArr = store.getStore(`groupChatMap/${genGroupHid(this.props.rid)}`,[]);
            const hincId = hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
            this.props.lastMessage = hincId ? store.getStore(`groupHistoryMap/${hincId}`,'') : '没有最新消息';
            const lastHincId = store.getStore(`lastRead/${genGroupHid(this.props.rid)}`,{ msgId:undefined }).msgId;

            // 计算有多少条新消息记录
            const count1 = hincId ? getIndexFromHIncId(hincId) :-1;
            const count2 = lastHincId ? getIndexFromHIncId(lastHincId) :-1;
            this.props.unReadCount = count1 - count2;
        }
        
        const time:any = depCopy(this.props.lastMessage.time);
        this.props.time = timestampFormat(time,1);
        this.props.msg = depCopy(this.props.lastMessage.msg);
        if (this.props.lastMessage.mtype === MSG_TYPE.IMG) {
            this.props.msg = '图片';
        }
        
    }

    public firstPaint() {
        super.firstPaint();
        store.register(`userChatMap/${genUserHid(store.getStore('uid'), this.props.rid)}`, this.bindCB);
        store.register(`groupChatMap/${genGroupHid(this.props.rid)}`, this.bindCB);
        store.register(`lastRead/${genUserHid(store.getStore('uid'), this.props.rid)}`,this.bindCB);
        store.register(`lastRead/${genGroupHid(this.props.rid)}`,this.bindCB);
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
    isNotDisturb:boolean; // 是否设置了消息免打扰
    unReadCount:number;  // 未读消息数
}