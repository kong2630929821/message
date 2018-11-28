/**
 * 登录
 */

// ================================================ 导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { DEFAULT_ERROR_STR } from '../../../../server/data/constant';
import { UserHistory } from '../../../../server/data/db/message.s';
import { updateUserMessage } from '../../data/parse';
import * as store from '../../data/store';
import { sendMessage } from '../../net/rpc';
// ================================================ 导出
export class Chat extends Widget {
    public props:Props;
    public bindCB: any;
    public ok: () => void;
    constructor() {
        super();
        this.props = {
            sid: null,
            rid: null,
            inputMessage:'',
            hidIncArray: []
        }; 
        this.bindCB = this.updateChat.bind(this);
    }
    public setProps(props:any) {
        super.setProps(props);
        this.props.sid = store.getStore('uid');
        this.props.hidIncArray = store.getStore(`userChatMap/${this.getHid()}`) || [];
    }

    public firstPaint() {
        super.firstPaint();
        store.register(`userChatMap/${this.getHid()}`,this.bindCB);
    }
    public updateChat() {
        this.setProps(this.props);
        this.paint();
    }
    
    public send(e:any) {
        this.props.inputMessage = e.value;
        sendMessage(this.props.rid, e.value, (() => {
            const nextside = this.props.rid;

            return (r: UserHistory) => {
                if (r.hIncId === DEFAULT_ERROR_STR) {
                    alert('对方不是你的好友！');
                    
                    return;
                }
                updateUserMessage(nextside, r);
            };
        })());
    }

    public destroy() {
        store.unregister(`userChatMap/${this.getHid()}`,this.bindCB);

        return super.destroy();
    }
    public goBack() {
        this.ok();
    }
    private getHid() {
        const friendLink = store.getStore(`friendLinkMap/${this.props.sid}:${this.props.rid}`);
        
        return friendLink && friendLink.hid;
    }
}

// ================================================ 本地
interface Props {
    sid: number;
    rid: number;
    inputMessage:string;
    hidIncArray: string[];
    
}