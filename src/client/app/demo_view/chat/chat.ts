/**
 * 登录
 */

// ================================================ 导入
import { Widget } from "../../../../pi/widget/widget";
import { Forelet } from "../../../../pi/widget/forelet";
import { sendMessage } from "../../net/rpc";
import { popNew } from "../../../../pi/ui/root";
import { UserHistory, UserMsg } from "../../../../server/data/db/message.s";
import { updateUserMessage } from "../../data/parse";
import * as store from "../../data/store";
// ================================================ 导出
export class Chat extends Widget {
    props = {
        sid: null,
        rid: null,
        inputMessage:"",
        hidIncArray: []
    } as Props

    create(){
        super.create();
        
    }
    setProps(props){
        super.setProps(props);
        this.props.hidIncArray = store.getStore(`userChatMap/${this.getHid()}`);
    }

    firstPaint(){
        super.firstPaint();
        store.register(`userChatMap/${this.getHid()}`,(r:Array<string>)=>{
            this.setProps(this.props);
            this.paint();
        })
    }

    inputMessage(e) {
        this.props.inputMessage = e.text;
    }

    send(e) {
        sendMessage(this.props.rid, this.props.inputMessage, (() => {
            let nextside = this.props.rid;
            return (r: UserHistory) => {
                updateUserMessage(nextside, r);
            }
        })())
    }

    openAddUser(e) {
        popNew("client-app-demo_view-chat-addUser", { "sid": this.props.sid, "rid": null })
    }

    destroy(){
        store.unregister(`userChatMap/${this.getHid()}`,undefined)
        return super.destroy();
    }
    private getHid(){
        let friendLink = store.getStore(`friendLinkMap/${this.props.sid}:${this.props.rid}`)
        return friendLink && friendLink.hid
    }
}

// ================================================ 本地
interface Props {
    sid: number,
    rid: number,
    inputMessage:string,
    hidIncArray: Array<string>
    
}