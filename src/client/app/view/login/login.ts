/**
 * 登录
 */

 // ================================================ 导入
 import {Widget} from "../../../../pi/widget/widget";
 import {Forelet} from "../../../../pi/widget/forelet";
 import {open} from "../../../../pi/ui/root";
 import {clientRpcFunc} from "../../net/init";
 import { login as userLogin} from '../../net/rpc';

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
        open("client-app-view-register-register")
    }

    login(e){
        userLogin(this.props.uid,this.props.passwd, ()=>{

        })
        alert(`name is : ${this.props.uid}, passwd is : ${this.props.passwd}`)
    }
 }

 // ================================================ 本地
 interface Props  {
     uid:number,
     passwd:string
 }