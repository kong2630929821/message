/**
 * 登录
 */

// ================================================ 导入
import { Widget } from "../../../../pi/widget/widget";
import { Forelet } from "../../../../pi/widget/forelet";
import { open } from "../../../../pi/ui/root";
import { register as registerUser } from "../../net/rpc";
import { UserInfo } from "../../../../server/data/db/user.s";
import { Logger } from '../../../../utils/logger';

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);


// ================================================ 导出
export class Register extends Widget {
    props = {
        name: "",
        nick:"",
        passwd: "",
        repasswd:"",
        pwVisible:false,// 密码可见性
        repwVisible:false,//重复密码可见性
        isSuccess:false// 两次密码一致验证是否成功
    } as Props
    ok:()=>void;
    back(e) {
        this.ok()
    }
    inputName(e) {
        this.props.name = e.value;
    }
    // 随机名字
    randomName(){
        console.log("randomName");
    }
    inputPasswd(e) {
        if(e.success){
            this.props.passwd = e.password;
        }
    }
    repeatPasswd(e){
        this.props.repasswd = e.value;
        if(this.props.repasswd != this.props.passwd){
            this.props.isSuccess= false;
        }
        else{
            this.props.isSuccess= true;
        }
        this.paint();
    }
    // 改变眼睛状态
    changepwEye(){
        let temp = !this.props.pwVisible;
        this.props.pwVisible = temp;
        this.paint();
    }
    changerepwEye(){
        let temp = !this.props.repwVisible;
        this.props.repwVisible = temp;
        this.paint();
    }
    register(e) {
        registerUser(this.props.name, this.props.passwd, (r: UserInfo) => {
            logger.debug(JSON.stringify(r));
            // if(r.uid){
            //     open("client-app-view-register-registerSuccess",{"uid" : r.uid});                
            // }
        })
    }
}

// ================================================ 本地
interface Props {
    name: string,
    passwd: string,
    repasswd:string,
    pwVisible:boolean,
    repwVisible:boolean,
    isSuccess:boolean
}