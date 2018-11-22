/**
 * 登录
 */

// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { UserHistory } from '../../../../server/data/db/message.s';
import { genUserHid } from '../../../../utils/util';
import * as store from '../../data/store';
// ================================================ 导出

export class Chat extends Widget {
    public props: Props;
    public bindCB: any;

    constructor() {
        super();
        this.bindCB = this.updateMessage.bind(this);
        this.props = {
            rid: -1,
            lastMessage: undefined
        };
    }
    public setProps(props: any) {
        super.setProps(props);
        const sid = store.getStore(`uid`);
        const friendLink = store.getStore(`friendLinkMap/${sid}:${this.props.rid}`);
        const hid = friendLink.hid;
        const hIncIdArr = store.getStore(`userChatMap/${hid}`);
        const hincId = hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
        this.props.lastMessage = hincId ? store.getStore(`userHistoryMap/${hincId}`) : '没有最新消息';
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
    lastMessage: UserHistory;
}