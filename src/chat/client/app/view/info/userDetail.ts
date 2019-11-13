import { getUserRecentGame } from '../../../../../app/net/pull';
import { getAllMedal } from '../../../../../earn/client/app/net/rpc';
import { popModalBoxs, popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { UserArray } from '../../../../server/data/rpc/basic.s';
import { genUuid } from '../../../../utils/util';
import { getStore, register, setStore, unregister } from '../../data/store';
import { getFriendAlias, getUserAvatar } from '../../logic/logic';
import { popNewMessage } from '../../logic/tools';
import { applyUserFriend, follow, getFansList, getFollowList, getUserPostList, getUsersBasicInfo, postLaud } from '../../net/rpc';

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
    expandItem:number;  // 当前展开工具栏的帖子下标
    dealData:any;  // 组装数据
    refresh:boolean; // 是否可以请求更多数据
}

/**
 * 联系人详细信息
 */
export class UserDetail extends Widget {
    public ok: (value?:string) => void;
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
        gameList:[],
        expandItem:-1,
        dealData:this.dealData,
        refresh:true
    };
    public bindUpdate:any = this.updateData.bind(this);

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const sid = getStore('uid');
        if (!props.uid) {  // 查看自己的信息
            this.props.uid = sid;
        }
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
        
        // getMedalest([this.props.userInfo.acc_id]).then((r:any) => {
        //     const ktNum = r.arr[0].resultNum;  // 勋章
        //     const data = getMedalList(CoinType.KT, 'coinType');
        //     const list = [];
        //     data.forEach((element,i) => {
        //         const medal = { img: `medal${element.id}`, id: element.id ,isHave:false };
        //         if (element.coinNum <= ktNum) {
        //             medal.isHave = true;
        //             list.push(medal);
        //         }
        //     });
        //     this.props.medalList = list.splice(-5);
        //     this.paint();
        // });

        // 获取全部勋章
        getAllMedal().then(r => {
            if (r.medals) {
                this.props.medalList = r.medals;
                this.paint();
            }
           
        });
        getUserRecentGame(this.props.userInfo.acc_id,5).then(r => {
            this.props.gameList = r;   // 游戏
            this.paint();
        });
    }

    public firstPaint() {
        super.firstPaint();
        const sid = getStore(`uid`, 0);
        if (sid !== this.props.uid) {
            register(`friendLinkMap/${genUuid(sid,this.props.uid)}`,this.bindUpdate);
            register(`followNumList/${sid}`,this.bindUpdate);
        }
        
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
            // if (!this.props.userInfo.tel) {
            //     popNewMessage('请绑定手机号码');
                
            //     return;
            // }
            // addCommunityNum('我的公众号',CommType.publicAcc,'').then((r:string) => {
            //     this.props.pubNum = r;
            //     setStore('pubNum',r);
            //     this.paint();
            // });
            popNew('chat-client-app-view-person-openPublic',{ chooseImage:false ,userInfo:this.props.userInfo },(r) => {
                this.props.pubNum = r;
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
        if (this.props.followed) {
            popModalBoxs('chat-client-app-widget-modalBox-modalBox', { title:'取消关注',content:'确定取消关注？' },() => {
                follow(this.props.num);
            });
        } else {
            follow(this.props.num);
        }
        
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
    /**
     * 点赞
     */
    public likeBtn(i:number) {
        const v = this.props.postList[i];
        v.likeActive = !v.likeActive;
        v.likeCount += v.likeActive ? 1 :-1;
        this.paint();
        postLaud(v.key.num, v.key.id, () => {
            // 失败了则撤销点赞或取消点赞操作
            v.likeActive = !v.likeActive;
            v.likeCount += v.likeActive ? 1 :-1;
            this.paint();
        });
    }

    /**
     * 评论
     */
    public commentBtn(i:number) {
        const v = this.props.postList[i];
        popNew('chat-client-app-view-info-editComment',{ key:v.key },() => {
            v.commentCount ++;
            this.paint();
            popNew('chat-client-app-view-info-postDetail',{ ...v,showAll:true });
        });
    }

    /**
     * 删除
     */
    public delPost(i:number) {
        this.props.postList.splice(i,1);
        this.paint();
    }
    
    /**
     * 查看详情
     */
    public goDetail(i:number) {
        popNew('chat-client-app-view-info-postDetail',{ ...this.props.postList[i],showAll:true },(value) => {
            if (value !== undefined) {
                this.ok && this.ok(value);
            }
        });
    }

    /**
     * 展示操作
     */
    public expandTools(e:any,i:number) {
        this.props.expandItem = e.value ? i :-1;
        this.paint();
    }

    public pageClick() {
        this.props.expandItem = -1;
        this.paint();
    }

    /**
     * 组装squareItem的数据
     */
    public dealData(v:any,r:boolean,t:boolean) {
        return { 
            ...v,
            showUtils: r,
            followed: t
        };
    }

    // 更新信息
    public updateData() {
        this.setProps(this.props);
        this.paint();
    }

    /**
     * 滚动加载更多帖子
     */
    public scrollPage() {
        const page = document.getElementById('userDetailPage');
        const contain = document.getElementById('userDetailContain');
        if (this.props.refresh && (contain.offsetHeight - page.scrollTop - page.offsetHeight) < 150 && this.props.postList.length % 20 === 0) {
            this.props.refresh = false;
            let list = this.props.postList;
            getUserPostList(this.props.num,list[list.length - 1].key.id).then((r:any) => {
                this.props.refresh = true;
                list = list.concat(r.list);
                this.props.postList = list;
                this.paint();
            });
        }
    }
    
    public destroy() {
        super.destroy();
        const sid = getStore(`uid`);
        if (sid !== this.props.uid) {
            unregister(`friendLinkMap/${genUuid(sid,this.props.uid)}`,this.bindUpdate);
            unregister(`followNumList/${sid}`,this.bindUpdate);
        }

        return true;
    }

    // 去好友的公众号
    public goHisPublic() {
        popNew('chat-client-app-view-person-publicHome',{ uid:this.props.userInfo.uid,pubNum:this.props.userInfo.comm_num });
    }

    // 去聊天
    public goChat() {
        popNew('chat-client-app-view-chat-chat', { id: this.props.userInfo.uid, chatType: GENERATOR_TYPE.USER });
    }

    /**
     * 点击游戏标签回到对应标签页
     */
    public changeTag(e:any) {
        const tagList = getStore('tagList');
        // 判断当前的标签页
        this.ok && this.ok(tagList[e.value]);
    }
}

// ================================================ 本地
