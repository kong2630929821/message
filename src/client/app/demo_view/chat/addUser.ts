/**
 * 登录
 */

// ================================================ 导入
import { Widget } from "../../../../pi/widget/widget";
import { Forelet } from "../../../../pi/widget/forelet";
import { applyFriend as applyUserFriend, acceptFriend, delFriend as delUserFriend} from "../../net/rpc";
import * as store from "../../data/store";
import { Contact } from "../../../../server/data/db/user.s";
import { Result } from "../../../../server/data/rpc/basic.s";
import { popNew } from "../../../../pi/ui/root";

// ================================================ 导出
declare var module;
export const forelet = new Forelet;
const WIDGET_NAME = module.id.replace(/\//g, '-');

export class AddUser extends Widget {
    props = {
        sid: null,
        rid: null
    } as Props
    state = new Map;
    ok:()=>void

    returnFunc() {
        this.ok();
    }

    inputUid(e) {
        this.props.rid = parseInt(e.text);
    }

    applyFriend() {
        applyUserFriend(this.props.rid,(r:Result)=>{
            //TODO:
        })
    }
    chat(uid:number){
        popNew("client-app-demo_view-chat-chat", {"sid":this.props.sid,"rid":uid})
    }
    agree(uid:number){
        acceptFriend(uid,true,(r:Result)=>{
            //TODO:
        })
    }
    reject(uid:number){
        acceptFriend(uid,false,(r:Result)=>{
            //TODO:
        })
    }
    delFriend(uid:number){
        delUserFriend(uid,(r:Result)=>{
            //TODO:
        })
    }
}

// ================================================ 本地
interface Props {
    sid: number,
    rid: number,
}
type State = Contact

store.register("contactMap", (r: Map<number, Contact>) => {
    //这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (let value of r.values()) {
        forelet.paint(value)
      }    
})