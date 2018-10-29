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

// ================================================ 导出
declare var module;
export const forelet = new Forelet;
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class AddUser extends Widget {
    props = {
        sid: null,
        rid: null,
        friends:[],
        applyUser:[]
    } as Props
    state = new Map;
    ok:()=>void

    returnFunc() {
        this.ok();
    }
    setProps(props:any){
        this.props = props;
        this.props.friends = this.state.get(this.props.sid).friends;
        this.props.applyUser = this.state.get(this.props.sid).applyUser;
    }
    inputUid(e) {
        this.props.rid = parseInt(e.text);
    }
    applyFriend() {
        applyUserFriend(this.props.rid,(r:Result)=>{
            //TODO:
        })
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
    friends:Array<number>,
    applyUser:Array<number>
}
type State = Map<number, Contact>

store.register("contactMap", (r: Map<number, Contact>) => {
    forelet.paint(r);
    let w = forelet.getWidget(WIDGET_NAME)    
    if(w){
        w.setProps(w.props);
        w.paint()
    }
})