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
export class Login extends Widget {
    props = {
        name: "",
        passwd: ""
    } as Props
    ok:()=>void;
    back(e) {
        this.ok()
    }
    inputName(e) {
        this.props.name = e.text;
    }
    inputPasswd(e) {
        this.props.passwd = e.text;
    }
    register(e) {
        registerUser(this.props.name, this.props.passwd, (r: UserInfo) => {
            logger.debug(JSON.stringify(r));
        })

        // open("client-app-widget-components-inputMessage-inputMessage");
    }
}

// ================================================ 本地
interface Props {
    name: string,
    passwd: string
}