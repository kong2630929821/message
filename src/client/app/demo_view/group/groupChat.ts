/**
 * 群组聊天
 */

// ================================================ 导入
import { Widget } from "../../../../pi/widget/widget";
import { Forelet } from "../../../../pi/widget/forelet";
import { popNew } from "../../../../pi/ui/root";
import { login as userLogin } from '../../net/rpc';
import { UserInfo } from "../../../../server/data/db/user.s";
import { Logger } from '../../../../utils/logger';
import { factorial } from "../../../../pi/util/math";
import { create } from "../../../../pi/net/rpc";
import { UserArray } from "../../../../server/data/rpc/basic.s"
import * as store from '../../data/store';
import { GroupSend } from "../../../../server/data/rpc/message.s";
import { MSG_TYPE, GroupHistory } from "../../../../server/data/db/message.s";
import { clientRpcFunc } from "../../net/init";
import { sendGroupMessage } from "../../../../server/data/rpc/message.p";
import { DEFAULT_ERROR_STR } from "../../../../server/data/constant";

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class GroupChat extends Widget {
    public ok:() => void;
    public props:Props;
    public bindCB: any;
    constructor(){
        super();
        this.props = {
            sid:null,
            gid:null,
            inputMessage:'',
            hidIncArray: [],
            groupName:"KuPay官方群(24)",
            isLogin:true
        }
        this.bindCB = this.updateChat.bind(this);
    }
    goBack(){
        this.ok();
    }
    public setProps(props){
        super.setProps(props);
        this.props.sid = store.getStore('uid');
        this.props.hidIncArray = store.getStore(`groupChatMap/${this.getHid()}`) || [];
        this.props.groupName = "KuPay官方群(24)";
        this.props.isLogin = true;
        console.log("============groupChat",this.props)
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
    private getHid() {

        return store.getStore(`groupInfoMap/${this.props.gid}`).hid;
    }
}

// ================================================ 本地
interface Props {
    sid:number,
    gid:number,
    inputMessage:string;
    hidIncArray: string[];
    groupName: string,
    isLogin:boolean
}
