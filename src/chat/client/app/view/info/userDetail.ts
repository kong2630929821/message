/**
 * 联系人详细信息
 */

// ================================================ 导入
import { popNewMessage } from '../../../../../app/utils/tools';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { UserInfo } from '../../../../server/data/db/user.s';
import { UserArray } from '../../../../server/data/rpc/basic.s';
import { CommType } from '../../../../server/data/rpc/community.s';
import { getStore, setStore } from '../../data/store';
import { getFriendAlias, getUserAvatar } from '../../logic/logic';
import { addCommunityNum, applyUserFriend, follow, getUsersBasicInfo } from '../../net/rpc';

interface Props {
    uid: number;
    num:string;  // 社区账号
    pubNum:string; // 社区公众号
    userInfo: any;  // 用户信息
    alias: string; // 好友别名
    avatar:string; // 头像
    numList:any[][];
    isOwner:boolean;  // 当前用户
    isFriend: boolean; // 是否是好友
    followed:boolean;  // 是否关注
}

// ================================================ 导出
export class UserDetail extends Widget {
    public ok: () => void;
    public props: Props = {
        uid: null,
        num:'',
        pubNum:'3',
        userInfo: {},
        alias: '',
        avatar:'',
        numList:[
            [114,'动态'],
            [302,'关注'],
            [159,'粉丝']
        ],
        isOwner:false,
        isFriend:true,
        followed:true
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const sid = getStore('uid');
        this.props.isOwner = this.props.uid === sid;
        this.props.userInfo = getStore(`userInfoMap/${this.props.uid}`, new UserInfo());
        if (!this.props.num) {  // 不传则默认查看个人社区账号
            this.props.num = this.props.userInfo.comm_num;
        }
        
        if (!this.props.isOwner) {
            const v = getFriendAlias(this.props.uid);
            this.props.alias = v.name;
            this.props.isFriend = v.isFriend;
            if (!this.props.alias) {
                this.getUserData(this.props.uid);
            }
            const followList = getStore(`followNumList/${sid}`,{ list:[] }).list;
            this.props.followed = followList.indexOf(this.props.num) > -1;
        }

        this.props.avatar = getUserAvatar(this.props.uid) || '../../res/images/user_avatar.png';
        
    }

    // 非好友获取信息
    public getUserData(uid: number) {
        getUsersBasicInfo([uid]).then((r: UserArray) => {
            this.props.userInfo = r.arr[0];
            setStore(`userInfoMap/${uid}`,r.arr[0]);
            this.paint();
        },(r) => {
            console.error('获取用户信息失败', r);
        });
    }
   
    public goBack() {
        this.ok && this.ok();
    }

    // 设置
    public goSetting() {
        if (this.props.isOwner) {
            popNew('app-view-mine-account-home');
        } else {
            popNew('chat-client-app-view-info-setting',{ uid:this.props.uid });
        }
    }

    // 动态 粉丝 关注列表
    public goPersonHome(i:number) {
        popNew('chat-client-app-view-person-personHome',{ activeTab:i });
    }

    // 申请公众号 去我的公众号
    public goPublic() {
        if (!this.props.pubNum) {
            addCommunityNum('我的公众号',CommType.publicAcc,'');
            
        } else {
            popNew('chat-client-app-view-person-publicHome',{ uid:this.props.uid,pubNum:this.props.pubNum });
        }
    }

    // 添加好友
    public addUser() {
        applyUserFriend(this.props.uid.toString()).then((r) => {
            if (r === 0) {
                popNewMessage(`${this.props.uid}已经是你的好友`);
            } else {
                popNewMessage('发送申请成功');
            }
        });
    }
    
    /**
     * 关注用户
     */
    public followUser() {
        follow(this.props.num).then(r => {
            this.props.followed = !this.props.followed;
            this.paint();
        });
    }
}

// ================================================ 本地
