/**
 * 群公告详细
 */

// ================================================ 导入
import { popNew } from '../../../../pi/ui/root';
import { factorial } from '../../../../pi/util/math';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { AnnounceHistory, GroupHistory, MSG_TYPE } from '../../../../server/data/db/message.s';
import { sendGroupMessage } from '../../../../server/data/rpc/message.p';
import { GroupSend } from '../../../../server/data/rpc/message.s';
import { Logger } from '../../../../utils/logger';
import * as store from '../../data/store';
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
        logger.debug('=============inputChange',this.props.title);
    }
    // 公告内容变化
    public textAreaChange(e:any) {
        this.props.content = e.value;
        logger.debug('=============textAreaChange',this.props.content);
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
            if (r) {
                const ah = new AnnounceHistory();
                // 公告key使用群聊消息key
                ah.aIncId = r.hIncId;
                ah.announce = r.msg;
                store.setStore(`announceHistoryMap/${ah.aIncId}`,ah);
                
                // const ginfo = store.getStore(`groupInfoMap/${this.props.gid}`);
                // store.setStore(`groupInfoMap/${this.props.gid}`,ginfo);
            }
        });
    }
}

// ================================================ 本地
interface Props {
    gid:number;
    title:string; // 公告标题
    content:string; // 公告内容
}
