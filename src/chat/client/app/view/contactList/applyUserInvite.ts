/**
 * 我邀请的或邀请我的好友
 */ 

// ================================================ 导入
import * as walletStore from '../../../../../app/store/memstore';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { UserArray } from '../../../../server/data/rpc/basic.s';
import * as store from '../../data/store';
import { INFLAG, rippleShow } from '../../logic/logic';
import { applyFriend as applyUserFriend, getUsersBasicInfo } from '../../net/rpc';

// ================================================ 导出

export class ApplyUser extends Widget {
    public props: Props = {
        id:null,
        accId:'',
        name:'',
        applyInfo: '',
        isagree:false
    };

    public setProps(props:any) {
        super.setProps(props);
        this.props.isagree = false;
        getUsersBasicInfo([],[this.props.accId]).then((r:UserArray) => {
            store.setStore(`userInfoMap/${this.props.id}`,r.arr[0]);
            this.props.name = r.arr[0].name;
            this.props.id = r.arr[0].uid;
            this.paint();
        });
      
    }
    // 查看申请详细信息 
    public viewApplyDetail() {
        popNew('chat-client-app-view-info-userDetail',{ uid:this.props.id, inFlag: INFLAG.newApply });
    }

    public agreenBtn(e:any) {
        this.props.isagree = true;
        applyUserFriend(this.props.accId,() => {
            // 我邀请的好友
            const invite = walletStore.getStore('flags').invite_success;
            const index = invite.findIndex(item => item === this.props.accId);
            invite.splice(index,1);
            walletStore.setStore('flags/invite_success',invite);

            // 邀请我的好友
            const convert = walletStore.getStore('flags').convert_invite;
            const index1 = convert.findIndex(item => item === this.props.accId);
            convert.splice(index1,1);
            walletStore.setStore('flags/convert_invite',convert);
        });
        this.paint();
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}

// ================================================ 本地
interface Props {
    id: number; // 用户id或群组id
    accId:string; // 好嗨号
    name: string; // 用户名或群名
    applyInfo: string; // 验证信息
    isagree:boolean;
}