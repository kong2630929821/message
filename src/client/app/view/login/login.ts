/**
 * 登录
 */

 // ================================================ 导入
 import {Widget} from "../../../../pi/widget/widget";
 import {Forelet} from "../../../../pi/widget/forelet";
 import {open} from "../../../../pi/ui/root";
 import {clientRpcFunc} from "../../net/init";
 import {userLogin} from '../../../../server/rpc/user_login.p';
 import {userLogin as userLoginRequest, userLoginResponse} from '../../../../server/rpc/user_login.s';

 // ================================================ 导出
 export class Login extends Widget {
     props = {
         name:"",
         passwd:""
     } as Props

    inputName(e){
        this.props.name = e.text;
    }

    inputPasswd(e){
        this.props.passwd = e.text;
    }

    openRegister(){
        open("client-app-view-register-register")
    }

    login(e){
        let user = new userLoginRequest();
        user.uid = this.props.name;
        user.passwdHash = '0xFFFFFFFFFF';
        // clientRpcFunc(userLogin, user, userLoginResponse, (r) => {
        //     console.log(r);
        // })
        alert(`name is : ${this.props.name}, passwd is : ${this.props.passwd}`)
    }
 }

 // ================================================ 本地
 interface Props  {
     name:string,
     passwd:string
 }