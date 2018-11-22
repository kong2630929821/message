/**
 * 登录
 */

// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { UserHistory } from '../../../../server/data/db/message.s';
import * as store from '../../data/store';
// ================================================ 导出
export class Chat extends Widget {
    
    public props:UserHistory;
    constructor() {
        super();
        this.props = new UserHistory();
        this.props.hIncId = '';
        this.props.msg = null;        
    }     

    public setProps(props:any) {
        super.setProps(props);
        this.props.msg = store.getStore(`userHistoryMap/${this.props.hIncId}`);
    }
}

// ================================================ 本地