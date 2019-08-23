import { popNewMessage } from '../../../../../app/utils/tools';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { UserInfo } from '../../../../server/data/db/user.s';
import { UserArray } from '../../../../server/data/rpc/basic.s';
import { CommType } from '../../../../server/data/rpc/community.s';
import { getStore, setStore } from '../../data/store';
import { getFriendAlias, getUserAvatar } from '../../logic/logic';
import { addCommunityNum, applyUserFriend, follow, getFansList, getFollowList, getMyPublicNum, getUserPostList, getUsersBasicInfo } from '../../net/rpc';

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
    medalList:any[];  // 勋章列表
    postList:any[];  // 发布的帖子列表
    followList:string[];  // 关注列表
    fansList:string[];  // 粉丝列表
}

/**
 * 联系人详细信息
 */
export class UserDetail extends Widget {
    public ok: () => void;
    public props: Props = {
        uid: null,
        num:'',
        pubNum:'',
        userInfo: {},
        alias: '',
        avatar:'',
        numList:[
            [0,'动态'],
            [0,'关注'],
            [0,'粉丝']
        ],
        isOwner:false,
        isFriend:true,
        followed:true,
        medalList:[],
        postList:[],
        followList:[],
        fansList:[]
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

        this.props.avatar = getUserAvatar(this.props.uid) || '../../res/images/user_avatar.png';
        this.init(sid);

        // const data = getMedalList(CoinType.KT, 'coinType');
        // const ktNum = earnGetStore('balance/KT');
        // data.forEach((element,i) => {
        //     const medal = { img: `medal${element.id}`, id: element.id ,isHave:false };
        //     if (element.coinNum <= ktNum) {
        //         medal.isHave = true;
        //         this.props.medalList.push(medal);
        //     }
        // });
        // this.props.medalList.splice(-5);
        // console.log('getMedalList',data,ktNum);
        
    }

    public init(sid:number) {
        const numsList = getStore(`followNumList/${sid}`,{ person_list:[],public_list:[]  });
        const followList = numsList.person_list.concat(numsList.public_list);
        if (this.props.isOwner) {
            getMyPublicNum().then((r:string) => {
                this.props.pubNum = r;
                this.paint();
            });
            this.props.followList = followList;  // 关注
            this.props.numList[1][0] = followList.length;
        
        } else {  
            const v = getFriendAlias(this.props.uid);
            this.props.alias = v.name;
            this.props.isFriend = v.isFriend;
            if (!this.props.alias) {
                this.getUserData(this.props.uid);
            }
           
            this.props.followed = followList.indexOf(this.props.num) > -1;
            getFollowList(this.props.uid).then((r:string[]) => {
                this.props.followList = r;  // 关注
                this.props.numList[1][0] = r.length;
                this.paint();
            });
        }
        getUserPostList(this.props.num).then((r:any) => {
            this.props.postList = r.list;  // 动态
            this.props.numList[0][0] = r.total;
            this.paint();
        });
        getFansList(this.props.num).then((r:string[]) => {
            this.props.fansList = r;  // 粉丝
            this.props.numList[2][0] = r.length;
            this.paint();
        });
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
        popNew('chat-client-app-view-person-personHome',{ activeTab:i,postList:this.props.postList,followList:this.props.followList,fansList:this.props.fansList });
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

    /**
     * 发动态
     */
    public sendPost() {
        popNew('chat-client-app-view-info-editPost',null,() => {
            getUserPostList(this.props.num).then((r:any) => {
                this.props.postList = r.list;  // 动态
                this.props.numList[0][0] = r.total;
                this.paint();
            });
        });
    }
}

// ================================================ 本地
