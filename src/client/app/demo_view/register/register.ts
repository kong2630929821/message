/**
 * 登录
 */

// ================================================ 导入
import { open } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { UserInfo } from '../../../../server/data/db/user.s';
import { Logger } from '../../../../utils/logger';
import { register as registerUser } from '../../net/rpc';

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class Login extends Widget {
    public props = {
        name: '',
        passwd: ''
    } as Props;
    public ok:() => void;
    public back(e) {
        this.ok();
    }
    public inputName(e) {
        this.props.name = e.text;
    }
    public inputPasswd(e) {
        this.props.passwd = e.text;
    }
    public register(e) {
        registerUser(this.props.name, this.props.passwd, (r: UserInfo) => {
            logger.debug(JSON.stringify(r));
        });

        // open("client-app-widget-components-inputMessage-inputMessage");
    }
}

// ================================================ 本地
interface Props {
    name: string;
    passwd: string;
}