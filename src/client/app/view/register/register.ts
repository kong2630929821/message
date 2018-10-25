/**
 * 登录
 */

 // ================================================ 导入
 import {Widget} from "../../../../pi/widget/widget";
 import {Forelet} from "../../../../pi/widget/forelet";
 import {open} from "../../../../pi/ui/root";
 import {register as registerUser} from "../../net/rpc";
 import {UserInfo} from "../../../../server/data/db/user.s";

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
    register(e){
        registerUser(this.props.name, this.props.passwd, (r:UserInfo)=>{            
            alert(`${r.uid}`);
        })
        alert(`name is : ${this.props.name}, passwd is : ${this.props.passwd}`)
    }
 }

 // ================================================ 本地
 interface Props  {
     name:string,
     passwd:string
 }