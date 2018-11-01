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
export class RegisterSuccess extends Widget {
    props = {
        uid:null
    } as Props
    ok:()=>void;
    back(e) {
        this.ok()
    }
    goChat() {
        console.log("goChat")    
    }
}

// ================================================ 本地
interface Props {
    uid : string
}