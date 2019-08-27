import { getUserRecentGame } from '../../../../../app/net/pull';
import { popNewMessage } from '../../../../../app/utils/tools';
import { getMedalest } from '../../../../../earn/client/app/net/rpc';
import { getMedalList } from '../../../../../earn/client/app/utils/util';
import { CoinType } from '../../../../../earn/client/app/xls/dataEnum.s';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { UserArray } from '../../../../server/data/rpc/basic.s';
import { CommType } from '../../../../server/data/rpc/community.s';
import { getStore, setStore } from '../../data/store';
import { getFriendAlias, getUserAvatar } from '../../logic/logic';
import { addCommunityNum, applyUserFriend, follow, getFansList, getFollowList, getUserPostList, getUsersBasicInfo } from '../../net/rpc';

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
    gameList:string[]; // 最近玩过的游戏列表
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
        fansList:[],
        gameList:[]
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const sid = getStore('uid');
        this.props.isOwner = this.props.uid === sid;
        const userinfo = getStore(`userInfoMap/${this.props.uid}`, {});
        this.props.userInfo = userinfo;
        
        if (userinfo.uid) { // 用户信息
            this.props.num = userinfo.comm_num;
            if (this.props.isOwner) {  // 本人
                this.props.pubNum = getStore('pubNum');
            }
            this.init(sid);

        } else {
            getUsersBasicInfo([this.props.uid]).then((r: UserArray) => {
                this.props.userInfo = r.arr[0];
                this.props.num = this.props.userInfo.comm_num;
                setStore(`userInfoMap/${this.props.uid}`,r.arr[0]);
                this.init(sid);
            });
        }

    }

    public init(sid:number) {
        const numsList = getStore(`followNumList/${sid}`,{ person_list:[],public_list:[]  });
        const followList = numsList.person_list.concat(numsList.public_list);
        this.props.avatar = getUserAvatar(this.props.uid);
        this.props.followed = followList.indexOf(this.props.num) > -1;
        
        if (!this.props.isOwner) {
            const v = getFriendAlias(this.props.uid);
            this.props.alias = v.name;
            this.props.isFriend = v.isFriend;
            getFollowList(this.props.uid).then((r:string[]) => {
                this.props.followList = r;  // 关注
                this.props.numList[1][0] = r.length;
                this.paint();
            });
        } else {
            this.props.followList = followList.filter(v => { // 关注除去自己
                return v !== this.props.num && v !== this.props.pubNum;
            });
            this.props.numList[1][0] = this.props.followList.length;
        }
        this.paint();

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
        getMedalest([this.props.userInfo.acc_id]).then((r:any) => {
            const ktNum = r.arr[0].resultNum;  // 勋章
            const data = getMedalList(CoinType.KT, 'coinType');
            const list = [];
            data.forEach((element,i) => {
                const medal = { img: `medal${element.id}`, id: element.id ,isHave:false };
                if (element.coinNum <= ktNum) {
                    medal.isHave = true;
                    list.push(medal);
                }
            });
            this.props.medalList = list.splice(-5);
            this.paint();
        });
        getUserRecentGame(this.props.userInfo.acc_id,5).then(r => {
            this.props.gameList = r;   // 游戏
            this.paint();
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
            addCommunityNum('我的公众号',CommType.publicAcc,'').then((r:string) => {
                this.props.pubNum = r;
                setStore('pubNum',r);
                this.paint();
            });
            
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
