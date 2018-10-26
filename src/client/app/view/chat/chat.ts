/**
 * 登录
 */

 // ================================================ 导入
 import {Widget} from "../../../../pi/widget/widget";
 import {Forelet} from "../../../../pi/widget/forelet";
 import {sendMessage} from "../../net/rpc";
 import {subscribe as subscribeMsg} from "../../net/init";
 import {UserHistory, UserMsg} from "../../../../server/data/db/message.s";

 // ================================================ 导出
 export class Chat extends Widget {
     props = {
         sid:null,
         rid:null,
         message:null
     } as Props

    inputUid(e){
        this.props.rid = parseInt(e.text);
    }

    inputMessage(e){
        this.props.message = e.text;
    }
    subscribe(){
        subscribeMsg(this.props.sid.toString(),UserMsg,(r:UserMsg)=>{

        })
    }
    send(e){
        sendMessage(this.props.rid,this.props.message, (r:UserHistory)=>{
            alert(`chat ${JSON.stringify(r)}`)
        })
    }
 }

 // ================================================ 本地
 interface Props  {
     sid:number,
     rid:number,
     message:string
 }