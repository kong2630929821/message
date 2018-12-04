/**
 * textMessage 组件相关处理
 */
// ===========================导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import * as store from '../../data/store';
import { timestampFormat } from '../../logic/logic';

// ===========================导出
export class TextMessage extends Widget {
    constructor() {
        super();
        this.props = {
            hIncId:'',
            name:'',
            msg:null,
            me:true,
            time:''
        };
    }     

    public setProps(props:any) {
        super.setProps(props);
        this.props.msg = store.getStore(`userHistoryMap/${this.props.hIncId}`);
        this.props.me = this.props.msg.sid === store.getStore('uid');
        let time = this.props.msg.time;
        time = timestampFormat(time).split(' ')[1];
        this.props.time = time.substr(0,5);
    }

    /**
     * 查看好友详细信息
     */
    public goDetail() {
        popNew('client-app-demo_view-info-userDetail',{ uid: this.props.msg.sid });
    }
}

// ================================================ 本地