/**
 * 登录
 */

// ================================================ 导入
import { Widget } from '../../../../../pi/widget/widget';
import { Logger } from '../../../../utils/logger';
import { playerName } from '../../widget/randomName/randomName';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class Login extends Widget {
    public props:Props = {
        name: playerName(),
        passwd: '',
        success:false
    };
    public ok:() => void;
    public back(e:any) {
        this.ok();
    }
    public inputName(e:any) {
        this.props.name = e.value;
    }
    public inputPasswd(e:any) {
        this.props.passwd = e.password;
        this.props.success = e.success;
    }
    public register(e:any) {
        // registerUser(this.props.name, this.props.passwd, (r: UserInfo) => {
        //     logger.debug(JSON.stringify(r));
        //     this.ok();
        //     popNew('chat-client-app-view-register-registerSuccess',{ uid:r.uid });
        // });
    }
}

// ================================================ 本地
interface Props {
    name: string;
    passwd: string;
    success:boolean;
}