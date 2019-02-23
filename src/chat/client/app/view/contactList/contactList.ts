/**
 * 通讯录
 */

 // ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { Contact } from '../../../../server/data/db/user.s';
import * as store from '../../data/store';
import { rippleShow } from '../../logic/logic';
// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');

export class ContactList extends Widget {
    public ok:() => void;
    public props:any = {
        sid:store.getStore('uid')
    };

    public create() {
        super.create();
        const sid = store.getStore('uid').toString();
        this.state = store.getStore('contactMap',new Contact()).get(sid);
    }

     // 返回上一页
    public goBack() {
        this.ok();
    }

    public goNext(i:number,uid:number) {
        switch (i) {
            case 0:
                popNew('chat-client-app-view-contactList-newFriend'); // 新好友验证
                break;
            case 1:
                popNew(`chat-client-app-view-group-groupList`);  // 群聊列表
                break;
            case 2:
                popNew('chat-client-app-view-info-user'); // 本人信息
                break;
            case 3:
                popNew('chat-client-app-view-info-userDetail',{ uid:uid });  // 好友详情
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