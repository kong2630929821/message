/**
 * 通讯录
 */

 // ================================================ 导入
import { popNew3 } from '../../../../../app/utils/tools';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import * as store from '../../data/store';
import { rippleShow } from '../../logic/logic';
// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    sid:number;  // uid
    newApply:number;  // 新申请消息数
}
export class ContactList extends Widget {
    public ok:() => void;
    public props:Props; 

    public setProps(props:any) {
        super.setProps(props);
        this.props.sid = store.getStore('uid');
    }

     // 返回上一页
    public goBack() {
        this.ok();
    }

    public goNext(i:number,uid:number) {
        switch (i) {
            case 0:
                popNew3('chat-client-app-view-contactList-newFriend'); // 新好友验证
                break;
            case 1:
                popNew3(`chat-client-app-view-group-groupList`);  // 群聊列表
                break;
            case 2:case 3:
                popNew3('chat-client-app-view-info-userDetail',{ uid:uid }); // 本人信息
                break;
            default:
        }
    }
    
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}

 // ================================================ 本地
store.register('contactMap', (r) => {
    for (const value of r.values()) {
        forelet.paint(value);
    }  
});