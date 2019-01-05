/**
 * 注册成功
 */

// ================================================ 导入
import { Widget } from '../../../../../pi/widget/widget';
import { Logger } from '../../../../utils/logger';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class RegisterSuccess extends Widget {
    public ok:() => void;
    public props:Props = {
        uid:null
    };
    
    public goChat() {
        this.ok();
    }
}

// ================================================ 本地
interface Props {
    uid : number;
}