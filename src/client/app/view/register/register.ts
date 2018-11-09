/**
 * 注册
 */

// ================================================ 导入
import { Widget } from "../../../../pi/widget/widget";
import { Forelet } from "../../../../pi/widget/forelet";
import { popNew } from "../../../../pi/ui/root";
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

    } as Props
    ok:()=>void;
    back(e) {
        this.ok()
    }
    inputName(e) {
        this.props.name = e.value;
    }
    inputPasswd(e) {
        if(e.success){
            this.props.passwd = e.password;
        }
    }
    register(e) {
        registerUser(this.props.name, this.props.passwd, (r: UserInfo) => {
            logger.debug(JSON.stringify(r));
            if(r.uid > 0){
                popNew("client-app-view-register-registerSuccess",{"uid" : r.uid});                
            }
            
        })
    }
}

// ================================================ 本地
interface Props {
    name: string,
    passwd: string,
    repasswd:string,
}