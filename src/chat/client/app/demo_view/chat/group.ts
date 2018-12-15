/**
 * 登录
 */

// ================================================ 导入
import { Widget } from '../../../../../pi/widget/widget';
import { DEFAULT_ERROR_STR } from '../../../../server/data/constant';
import { GroupHistory, MSG_TYPE } from '../../../../server/data/db/message.s';
import { sendGroupMessage } from '../../../../server/data/rpc/message.p';
import { GroupSend } from '../../../../server/data/rpc/message.s';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';
// ================================================ 导出
export class Group extends Widget {
    public props:Props;
    public bindCB: any;
    public ok: () => void;
    constructor() {
        super();
        this.props = {
            sid: null,
            gid: null,
            inputMessage:'',
            hidIncArray: []
        }; 
        this.bindCB = this.updateChat.bind(this);
    }
    public setProps(props:any) {
        super.setProps(props);
        this.props.sid = store.getStore('uid');
        this.props.hidIncArray = store.getStore(`groupChatMap/${this.getHid()}`) || [];
    }

    public firstPaint() {
        super.firstPaint();
        store.register(`groupChatMap/${this.getHid()}`,this.bindCB);
    }
    public updateChat() {
        this.setProps(this.props);
        this.paint();
    }
    
    public send(e:any) {
        this.props.inputMessage = e.value;
        const message = new GroupSend();
        message.gid = this.props.gid;
        message.msg = this.props.inputMessage;
        message.mtype = MSG_TYPE.TXT;
        message.time = (new Date()).getTime();
        clientRpcFunc(sendGroupMessage, message, (() => {
            const gid = this.props.gid;

            return (r: GroupHistory) => {
                if (r.hIncId === DEFAULT_ERROR_STR) {
                    alert('对方不是你的好友！');
                    
                    return;
                }
                // updateGroupMessage(gid, r);
            };
        })());
    }

    public destroy() {
        store.unregister(`groupChatMap/${this.getHid()}`,this.bindCB);

        return super.destroy();
    }
    public goBack() {
        this.ok();
    }
    private getHid() {

        return store.getStore(`groupInfoMap/${this.props.gid}`).hid;
    }
}

// ================================================ 本地
interface Props {
    sid: number;
    gid: number;
    inputMessage:string;
    hidIncArray: string[];
    
}