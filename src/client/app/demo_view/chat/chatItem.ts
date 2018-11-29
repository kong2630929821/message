/**
 * 登录
 */

// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { UserHistory } from '../../../../server/data/db/message.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import * as store from '../../data/store';
// ================================================ 导出
export class Chat extends Widget {
    
    public props:Props;
    constructor() {
        super();
        this.props = {
            hIncId : '',
            msg: null,
            chatType:GENERATOR_TYPE.USER
        };
        this.props.hIncId = '';
        this.props.msg = null; 
        this.props.chatType = GENERATOR_TYPE.USER;
    }     

    public setProps(props:any) {
        super.setProps(props);
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            this.props.msg = store.getStore(`userHistoryMap/${this.props.hIncId}`);
        } else if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            this.props.msg = store.getStore(`groupHistoryMap/${this.props.hIncId}`);
        }
        
    }
}

// ================================================ 本地
interface Props {
    hIncId : string;
    msg: any;
    chatType:GENERATOR_TYPE;
}