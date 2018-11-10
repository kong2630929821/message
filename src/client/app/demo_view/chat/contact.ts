/**
 * 登录
 */

// ================================================ 导入
import { Widget } from "../../../../pi/widget/widget";
import { Forelet } from "../../../../pi/widget/forelet";
import * as store from "../../data/store";
import { popNew } from "../../../../pi/ui/root";
import { UserHistory, UserMsg } from "../../../../server/data/db/message.s";
import { updateUserMessage } from "../../data/parse";
// ================================================ 导出
export const forelet = new Forelet;
export class Contact extends Widget {
    
    props = {
        sid: null,
    } as Props;

    chat(uid:number){
        popNew("client-app-demo_view-chat-chat", {"sid":this.props.sid,"rid":uid})
    }

    openAddUser(e) {
        popNew("client-app-demo_view-chat-addUser", { "sid": this.props.sid})
    }
}

store.register(`lastChat`,(r:Array<[number,number]>)=>{
    alert("xxx")
    forelet.paint(r);
})


// ================================================ 本地
interface Props {
    sid: number,
}

