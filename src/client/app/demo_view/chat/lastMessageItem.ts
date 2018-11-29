/**
 * 登录
 */

// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { GroupHistory, UserHistory } from '../../../../server/data/db/message.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
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
            id: -1,
            lastMessage: undefined,
            chatType:GENERATOR_TYPE.USER
        };
    }
    public setProps(props: any) {
        super.setProps(props);
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            const sid = store.getStore(`uid`);
            const friendLink = store.getStore(`friendLinkMap/${sid}:${this.props.id}`);
            const hid = friendLink.hid;
            const hIncIdArr = store.getStore(`userChatMap/${hid}`);
            const hincId = hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
            this.props.lastMessage = hincId ? store.getStore(`userHistoryMap/${hincId}`) : '没有最新消息';
        } else if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            const hid = store.getStore(`groupInfoMap/${this.props.id}`).hid;
            const hIncIdArr = store.getStore(`groupChatMap/${hid}`);
            const hincId = hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
            this.props.lastMessage = hincId ? store.getStore(`groupHistoryMap/${hincId}`) : '没有最新消息';
        }        
    }

    public firstPaint() {
        super.firstPaint();
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            store.register(`userChatMap/${genUserHid(store.getStore(`uid`), this.props.id)}`, this.bindCB);
        } else if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            store.register(`groupChatMap/${store.getStore(`groupInfoMap/${this.props.id}`).hid}`, this.bindCB);
        }        
        
    }
    public updateMessage() {
        this.setProps(this.props);
        this.paint();
    }
    public destroy() {
        
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            store.unregister(`userChatMap/${genUserHid(store.getStore(`uid`), this.props.id)}`, this.bindCB);    
        } else if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            store.unregister(`groupChatMap/${store.getStore(`groupInfoMap/${this.props.id}`).hid}`, this.bindCB);
        }        
        
        return super.destroy();
    }
}

// ================================================ 本地

interface Props {
    id: number;
    lastMessage: UserHistory|GroupHistory;
    chatType:GENERATOR_TYPE;
}