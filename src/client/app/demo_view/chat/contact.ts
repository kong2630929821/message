/**
 * 登录
 */

// ================================================ 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import * as store from '../../data/store';
// ================================================ 导出
export const forelet = new Forelet();
export class Contact extends Widget {
    public props:Props;
    constructor() {
        super();
        this.props = {
            sid: null
        }; 
    }    

    public chat(uid:number) {
        popNew('client-app-demo_view-chat-chat', { sid:this.props.sid,rid:uid });
    }

    public openAddUser(e:Event) {
        popNew('client-app-demo_view-chat-addUser', { sid: this.props.sid });
    }
}

store.register(`lastChat`,(r:[number,number][]) => {    
    forelet.paint(r);
});

// ================================================ 本地
interface Props {
    sid: number;
}
