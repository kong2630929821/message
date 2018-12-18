/**
 * 群公告详细
 */

// ================================================ 导入
import { Widget } from '../../../../../pi/widget/widget';
import { GroupHistory, MSG_TYPE } from '../../../../server/data/db/message.s';
import { sendGroupMessage } from '../../../../server/data/rpc/message.p';
import { GroupSend } from '../../../../server/data/rpc/message.s';
import { Logger } from '../../../../utils/logger';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class AnnounceDetail extends Widget {
    public ok:() => void;
    public props:Props = {
        gid:null,
        title:'',
        content:''
    };
    public goBack() {
        this.ok();
    }
    // 公告标题变化
    public inputChange(e:any) {
        this.props.title = e.value;
    }
    // 公告内容变化
    public textAreaChange(e:any) {
        this.props.content = e.value;
    }
    // 完成公告编辑
    public completeEdit() {
        logger.debug('completeEdit');
        const message = new GroupSend();
        message.gid = this.props.gid;
        message.msg = this.props.content;
        message.mtype = MSG_TYPE.NOTICE;
        message.time = (new Date()).getTime();
        clientRpcFunc(sendGroupMessage, message, (r:GroupHistory) => {
            logger.debug('=============send notice',r);
        });
        this.ok();
    }
}

// ================================================ 本地
interface Props {
    gid:number;
    title:string; // 公告标题
    content:string; // 公告内容
}
