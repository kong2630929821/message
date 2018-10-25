/**
 * 登录
 */

 // ================================================ 导入
 import {Widget} from "../../../../pi/widget/widget";
 import {Forelet} from "../../../../pi/widget/forelet";
 import {popNew} from "../../../../pi/ui/root";
 import { login as userLogin} from '../../net/rpc';
 import {UserInfo} from "../../../../server/data/db/user.s";

 // ================================================ 导出
 export class Login extends Widget {
     props = {
         uid:null,
         passwd:""
     } as Props

    inputName(e){
        this.props.uid = parseInt(e.text);
    }

    inputPasswd(e){
        this.props.passwd = e.text;
    }

    openRegister(){
        popNew("client-app-view-register-register")
    }

    login(e){
        userLogin(this.props.uid,this.props.passwd, (r:UserInfo)=>{
            if(r.uid > 0){
                popNew("client-app-view-chat-chat")
            }
        })
    }
 }

 // ================================================ 本地
 interface Props  {
     uid:number,
     passwd:string
 }