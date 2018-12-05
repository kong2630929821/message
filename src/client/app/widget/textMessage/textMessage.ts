/**
 * textMessage 组件相关处理
 */
// ===========================导入
import { Widget } from '../../../../pi/widget/widget';
import * as store from '../../data/store';
import { timestampFormat } from '../../logic/logic';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';

// ===========================导出
export class TextMessage extends Widget {
    constructor() {
        super();
        this.props = {
            hIncId:'',
            name:'',
            msg:null,
            me:true,
            time:'',
            chatType:GENERATOR_TYPE.USER
        };
        this.props.hIncId = '';
        this.props.msg = null; 
        this.props.chatType = GENERATOR_TYPE.USER;
    }     

    public setProps(props:any) {
        super.setProps(props);
        this.props.chatType = props.chatType;
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            this.props.msg = store.getStore(`userHistoryMap/${this.props.hIncId}`);
        } else if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            this.props.msg = store.getStore(`groupHistoryMap/${this.props.hIncId}`);
        }
        this.props.me = this.props.msg.sid === store.getStore('uid');
        let time = this.props.msg.time;
        time = timestampFormat(time).split(' ')[1];
        this.props.time = time.substr(0,5);
    }
}

// ================================================ 本地