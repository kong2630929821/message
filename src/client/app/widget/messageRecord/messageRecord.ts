/**
 * 最新会话列表项
 */
// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { UserMsg } from '../../../../server/data/db/message.s';
import { UserInfo } from '../../../../server/data/db/user.s';
import { genUserHid } from '../../../../utils/util';
import * as store from '../../data/store';
import { timestampFormat } from '../../logic/logic';
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
        this.props.name = store.getStore(`userInfoMap/${this.props.rid}`,new UserInfo()).name;
        const friendLink = store.getStore(`friendLinkMap/${sid}:${this.props.rid}`);
        const hid = friendLink.hid;
        const hIncIdArr = store.getStore(`userChatMap/${hid}`);
        const hincId = hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
        this.props.lastMessage = hincId ? store.getStore(`userHistoryMap/${hincId}`) : '没有最新消息';
        let time:any = this.props.lastMessage.time;
        time = timestampFormat(time).split(' ')[1];
        this.props.time = time.substr(0,5);
        console.log('最近消息》》》》》》》',props);
    }

    public firstPaint() {
        super.firstPaint();
        store.register(`userChatMap/${genUserHid(store.getStore(`uid`), this.props.rid)}`, this.bindCB);
    }
    public updateMessage() {
        this.setProps(this.props);
        this.paint();
    }
    public destroy() {
        store.unregister(`userChatMap/${genUserHid(store.getStore(`uid`), this.props.rid)}`, this.bindCB);

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