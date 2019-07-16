/**
 * 新朋友验证状态
 */

// ================================================ 导入
import * as walletStore from '../../../../../app/store/memstore';
import { popNewMessage } from '../../../../../app/utils/tools';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { Result } from '../../../../server/data/rpc/basic.s';
import { agreeJoinGroup } from '../../../../server/data/rpc/group.p';
import { GroupAgree } from '../../../../server/data/rpc/group.s';
import { acceptFriend } from '../../../app/net/rpc';
import * as  store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
export const forelet = new Forelet();

export class NewFriend extends Widget {
    public ok: () => void;

    public create() {
        super.create();
        const flags = walletStore.getStore('inviteUsers');
        STATE.inviteUsers = flags.invite_success || [];
        STATE.convertUser = flags.convert_invite || [];
        this.state = STATE;
    }

    public goBack() {
        this.ok();
    }
    
    // 同意好友申请
    public agreeClick(e: any) {
        const v = parseInt(e.value, 10);
        acceptFriend(v, true, (r: Result) => {
            if (r.r !== 1) {
                popNewMessage('添加好友失败');
            }
        });
    }

    // 同意入群邀请（被动）
    public agreeGroupApply(e: any) {
        const gid = parseInt(e.value, 10);
        const agree = new GroupAgree();
        agree.agree = true;
        agree.gid = gid;
        agree.uid = store.getStore(`uid`);
        clientRpcFunc(agreeJoinGroup, agree, (gInfo: GroupInfo) => {
            if (gInfo.gid < 0) {

                return;
            }
            store.setStore(`groupInfoMap/${gInfo.gid}`, gInfo);
        });
    }
    
}

// ================================================ 本地
const STATE = {
    contact:{ // 联系人列表
        applyUser:[],
        applyGroup:[]
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