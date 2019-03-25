/**
 * 新朋友验证状态
 */

// ================================================ 导入
import * as walletStore from '../../../../../app/store/memstore';
import { popNewMessage } from '../../../../../app/utils/tools';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { Contact } from '../../../../server/data/db/user.s';
import { Result, UserArray } from '../../../../server/data/rpc/basic.s';
import { agreeJoinGroup } from '../../../../server/data/rpc/group.p';
import { GroupAgree } from '../../../../server/data/rpc/group.s';
import { acceptFriend, getUsersBasicInfo } from '../../../app/net/rpc';
import * as  store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
export const forelet = new Forelet();

export class NewFriend extends Widget {
    public ok: () => void;

    public create() {
        super.create();
        const sid = store.getStore('uid','').toString();
        this.state = store.getStore('contactMap',new Contact()).get(sid);
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
    convertUser:{}  // 我兑换好友的邀请码
};
store.register('contactMap', (r) => {
    for (const value of r.values()) {
        STATE.contact = value;
        forelet.paint(STATE);
    }  
});

// 邀请好友成功
walletStore.register('flags/invite_success',(r) => {
    getUsersBasicInfo([],[r]).then((user:UserArray) => {
        STATE.inviteUsers = user.arr;
        forelet.paint(STATE);
        store.setStore('inviteUsers/invite',user.arr);
    });
});

// 兑换好友邀请码成功
walletStore.register('flags/convert_invite',(r) => {
    getUsersBasicInfo([],[r]).then((user:UserArray) => {
        STATE.convertUser = user.arr[0];
        forelet.paint(STATE);
        store.setStore('inviteUsers/convert',user.arr[0]);
    });
});