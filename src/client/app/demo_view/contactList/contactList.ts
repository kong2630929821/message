/**
 * 通讯录
 */

 // ================================================ 导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { Contact } from '../../../../server/data/db/user.s';
import { Logger } from '../../../../utils/logger';
import * as store from '../../data/store';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

 // ================================================ 导出
export class ContactList extends Widget {
    public ok:() => void;

    public setProps(props:Json,oldProps:Json) {
        super.setProps(props,oldProps);
        console.log(props);
    }
     // 返回上一页
    public goBack() {
        this.ok();
    }
     
     // 跳转至新的朋友验证状态界面
    public toNewFriend() {
        console.log('===========toNewFriend');
        popNew('client-app-demo_view-contactList-newFriend');
    }

    public toGroup() {
        popNew(`client-app-demo_view-group-group`);
    }

    // 查看好友详细信息
    public friendInfo(i:number) {
        popNew('client-app-demo_view-info-userDetail',{ uid:i });
    }
}

 // ================================================ 本地

store.register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (const value of r.values()) {
        forelet.paint(value);
    }    
});
store.register('friendLinkMap',() => {
    const w = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.paint(true);
    }
});