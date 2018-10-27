/**
 * 登录
 */

 // ================================================ 导入
 import {Widget} from "../../../../pi/widget/widget";
 import {Forelet} from "../../../../pi/widget/forelet";
 import {sendMessage} from "../../net/rpc";
 import {subscribe as subscribeMsg} from "../../net/init";
 import {UserHistory, UserMsg} from "../../../../server/data/db/message.s";
 import * as store from "../../data/store";
 import {Contact } from "../../../../server/data/db/user.s";

 // ================================================ 导出
 declare var  module;
 export const forelet = new Forelet;
 export const WIDGET_NAME = module.id.replace(/\//g, '-');



 export class AddUser extends Widget {
     props = {
         sid:null,
         rid:null,
     } as Props

    inputUid(e){
        this.props.rid = parseInt(e.text);
    }
    applyFriend(){
        
    }
    setState(state:Map<number, Contact>){
        this.state = state.get(this.props.sid)
    }
 }

 // ================================================ 本地
 interface Props  {
     sid:number,
     rid:number,     
 }
 interface State {
    friends:Array<number>
    applyUser:Array<number>
 }

 store.register("contactMap", (r:Map<number, Contact>)=>{
     forelet.paint(r);
 })