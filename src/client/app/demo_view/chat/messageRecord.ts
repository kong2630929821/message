/**
 * 最新会话列表项
 */
// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { UserMsg } from '../../../../server/data/db/message.s';
import { FriendLink, LastReadMsgId } from '../../../../server/data/db/user.s';
import { genUserHid, genUuid, getIndexFromHIncId } from '../../../../utils/util';
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
        this.props.name = getFriendAlias(this.props.rid);
        const friendLink = store.getStore(`friendLinkMap/${genUuid(sid,this.props.rid)}`,new FriendLink());
        const hid = friendLink.hid;
        const hIncIdArr = store.getStore(`userChatMap/${hid}`);
        const hincId = hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
        this.props.lastMessage = hincId ? store.getStore(`userHistoryMap/${hincId}`) : '没有最新消息';
        const time:any = this.props.lastMessage.time;
        this.props.time = timestampFormat(time,1);
        const lastHincId = store.getStore(`lastRead/${this.props.rid}`,new LastReadMsgId()).msgId;

        // 计算有多少条新消息记录
        const count1 = hincId ? getIndexFromHIncId(hincId) :0;
        const count2 = lastHincId ? getIndexFromHIncId(lastHincId) :0;
        this.props.unReadCount = count1 - count2;
    }

    public firstPaint() {
        super.firstPaint();
        store.register(`userChatMap/${genUserHid(store.getStore(`uid`), this.props.rid)}`, this.bindCB);
        store.register(`lastRead/${this.props.rid}`, this.bindCB);
    }
    public updateMessage() {
        this.setProps(this.props);
        this.paint();
    }
    public destroy() {
        store.unregister(`userChatMap/${genUserHid(store.getStore(`uid`), this.props.rid)}`, this.bindCB);
        store.unregister(`lastRead/${this.props.rid}`, this.bindCB);

        return super.destroy();
    }
}

// ================================================ 本地

interface Props {
    rid: number;
    name:string;
    time:string;
    lastMessage: UserMsg;
    isGroupMessage:boolean;
    isNotDisturb:boolean;
    unReadCount:number;
}