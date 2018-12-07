/**
 * homeInfo 组件相关处理
 */ 

// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { Logger } from '../../../../utils/logger';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class HomeInfo extends Widget {
    public props : Props = {
        userId:null,
        avatorPath : '',
        name : '',
        note : '',
        isUser : false,
        isContactor:true
    };
    public setProps(props:any) {
        super.setProps(props);
        logger.debug('================homeInfo',props);
    }
}

// ================================================ 本地
interface Props {
    userId:number;
    avatorPath : string;// 头像路径
    name : string;// 用户名还是组名
    note ?: string; // 群号或者备注
    isUser : boolean;// 是否是用户
    isContactor:boolean;// 是否是联系人
}