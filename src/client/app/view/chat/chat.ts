/**
 * 登录
 */

 // ================================================ 导入
 import {Widget} from "../../../../pi/widget/widget";
 import {Forelet} from "../../../../pi/widget/forelet";
 import {sendMessage} from "../../net/rpc";
 import {subscribe as subscribeMsg} from "../../net/init";
 import {UserHistory} from "../../../../server/data/db/message.s";

 // ================================================ 导出
 export class Chat extends Widget {
     props = {
         uid:null,
         message:null
     } as Props

    inputUid(e){
        this.props.uid = parseInt(e.text);
    }

    inputMessage(e){
        this.props.message = e.text;
    }

    subscribe(){
        subscribeMsg(this.props.uid.toString(),UserHistory,(r:UserHistory)=>{})
        // open("client-app-view-register-register")
    }

    send(e){
        sendMessage(this.props.uid,this.props.message, ()=>{
            
        })
    }
 }

 // ================================================ 本地
 interface Props  {
     uid:number,
     message:string
 }