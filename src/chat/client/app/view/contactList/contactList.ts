/**
 * 通讯录
 */

 // ================================================ 导入
import * as walletStore from '../../../../../app/store/memstore';
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

export class ContactList extends Widget {
    public ok:() => void;
    public props:any = {
        sid:store.getStore('uid')
    };

    public create() {
        super.create();
        this.state = STATE;
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
            case 2:
                popNew3('chat-client-app-view-info-user'); // 本人信息
                break;
            case 3:
                popNew3('chat-client-app-view-info-userDetail',{ uid:uid });  // 好友详情
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
store.register('friendLinkMap',() => {
    const w = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.paint(true);
    }
});
const STATE = {
    contact:{ // 联系人列表
        applyUser:[],
        applyGroup:[],
        friends:[]
    }, 
    inviteUsers:[],  // 我邀请的好友注册进入
    convertUser:[]  // 我兑换好友的邀请码
};
store.register('contactMap', (r) => {
    for (const value of r.values()) {
        STATE.contact = value;
        forelet.paint(STATE);
    }  
});

// 邀请好友成功
walletStore.register('inviteUsers/invite_success',(r) => {
    STATE.inviteUsers = r;
    forelet.paint(STATE);
});

// 兑换好友邀请码成功
walletStore.register('inviteUsers/convert_invite',(r) => {
    STATE.convertUser = r;
    forelet.paint(STATE);
});
