/**
 * 我邀请的或邀请我的好友
 */ 

// ================================================ 导入
import { getStoreData, setStoreData } from '../../../../../app/middleLayer/wrap';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { UserArray } from '../../../../server/data/rpc/basic.s';
import * as store from '../../data/store';
import { getUserAvatar, INFLAG, rippleShow } from '../../logic/logic';
import { applyUserFriend, getUsersBasicInfo } from '../../net/rpc';

// ================================================ 导出

export class ApplyUser extends Widget {
    public props: Props = {
        id:null,
        accId:'',
        name:'哈哈哈',
        applyInfo: '简介或其它',
        isAddUser:false,
        avatar:'../../res/images/user_avatar.png'
    };

    public setProps(props:any) {
        super.setProps(props);
        this.props.isAddUser = false;
        getUsersBasicInfo([],[this.props.accId]).then((r:UserArray) => {
            store.setStore(`userInfoMap/${r.arr[0].uid}`,r.arr[0]);
            this.props.name = r.arr[0].name;
            this.props.id = r.arr[0].uid;
            this.props.avatar = getUserAvatar(this.props.id) || '../../res/images/user_avatar.png';
            this.paint();
        });
      
    }
    // 查看申请详细信息 
    public viewApplyDetail() {
        popNew('chat-client-app-view-info-userDetail',{ uid:this.props.id, inFlag: INFLAG.newApply });
    }

    // 加好友
    public agreenBtn(e:any) {
        this.props.isAddUser = true;
        applyUserFriend(this.props.accId).then(() => {
            getStoreData('inviteUsers').then(inviteUsers => {
                // 我邀请的好友
                const invite = inviteUsers.invite_success;
                const index = invite.findIndex(item => item === this.props.accId);
                invite.splice(index,1);
                setStoreData('inviteUsers/invite_success',invite);

                // 邀请我的好友
                const convert = inviteUsers.convert_invite;
                const index1 = convert.findIndex(item => item === this.props.accId);
                convert.splice(index1,1);
                setStoreData('inviteUsers/convert_invite',convert);
            });
            
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
    isAddUser:boolean;
    avatar:string;  // 头像
}