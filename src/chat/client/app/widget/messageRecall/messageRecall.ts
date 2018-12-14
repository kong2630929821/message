/**
 * messageRecall 组件相关处理
 */

// ================================================ 导入
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { MSG_TYPE } from '../../../../server/data/db/message.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';

// ================================================ 导出
export class MessageRecall extends Widget {
    public props:Props = {
        chatType:GENERATOR_TYPE.USER,
        hidInc:''
    };
    // 点击撤回
    public recall(e:any) {
        notify(e.node,'ev-send',{ value:this.props.hidInc, msgType:MSG_TYPE.RECALL });
        // if (this.props.chatType === GENERATOR_TYPE.USER) {
        //     notify(e.node,'ev-recall-userMessage',{});
        // }
        // if (this.props.chatType === GENERATOR_TYPE.GROUP) {
        //     notify(e.node,'ev-recall-groupMessage',{});
        // }
    }
}

// ================================================ 本地
interface Props {
    chatType:GENERATOR_TYPE;
    hidInc:string;
}