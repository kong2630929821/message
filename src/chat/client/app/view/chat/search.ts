
import { uploadFileUrlPrefix } from '../../../../../app/publicLib/config';
import { Widget } from '../../../../../pi/widget/widget';
import * as store from '../../data/store';
import { getFriendAlias, getUserAvatar, rippleShow } from '../../logic/logic';

interface Props {
    sreachTab:any;// 搜索选项卡
    tabIndex:number;// 默认tab
    friendList:any;// 好友
    groupList:any;// 群聊
    postList:any;// 公众号
    articleList:any;// 文章
    chatHistory:any;// 聊天记录
    search:string;// 搜索值
    urlPath:string;  // 图片路径前
    searchAll:boolean;// 是否搜索全部
}
/**
 * 搜索
 */
export class Search extends Widget {
    public ok:() => void;
    public props:Props = {
        sreachTab:['全部','好友','群聊','公众号','文章'],
        tabIndex:0,
        friendList:[],
        groupList:[],
        postList:[],
        chatHistory:[],
        articleList:[],
        search:'',
        urlPath:uploadFileUrlPrefix,
        searchAll:false
    };

    // 初始化
    public init() {
        this.props.friendList = [];
        this.props.groupList = [];
        this.props.postList = [];
        this.props.chatHistory = [];
        this.props.articleList = [];
    }
    // 切换tab
    public checkTab(index:number) {
        this.init();
        this.props.tabIndex = index;
        this.searchBtn();
        this.paint();
    }

    // 搜索
    public inputUid(e:any) {
        this.props.search = e.value;
        this.paint();
    }
    // 确认搜索
    public searchBtn() {
        switch (this.props.tabIndex) {
            case 0 :// 全部
                this.searchFriend();
                this.searchGroup();
                this.searchPost();
                this.searchChat();
                break;
            case 1:// 好友
                this.searchFriend();
                break;
            case 2:// 群聊
                this.searchGroup();
                break;
            case 3:// 公众号
                this.searchPost();
                break;
            case 4:// 文章
                break;
            default:
        }
        this.paint();
    }

    // 搜索好友
    public searchFriend() {
        const friends = store.getStore('userInfoMap',[]);
        const searchItem = this.props.search;
        this.props.friendList = [];
        let fg = true; // 是否要搜索后端
        for (const [key,value] of friends) {
            if (JSON.stringify(value.uid) === searchItem || value.name === searchItem || value.acc_id === searchItem) {
                const avatar = value.avatar ? this.props.urlPath + value.avatar :'../../res/images/user_avatar.png';
                this.props.friendList.push({ text:value.name,uid:value.uid,img:avatar });
                fg = false;
            }
        }
    }

    // 搜索群聊
    public searchGroup() {
        const group = store.getStore('groupInfoMap',[]);
        const searchItem = this.props.search;
        this.props.groupList = [];
        let fg = true;
        for (const[key,value] of group) {
            if (JSON.stringify(value.gid) === searchItem || value.name === searchItem) {
                const avatar = value.avatar ? this.props.urlPath + value.avatar :'../../res/images/groups.png';
                this.props.groupList.push({ text:value.name,gid:value.gid,img:avatar });
                fg = false;
            }
        }
    }

    // 搜索公众号
    public searchPost() {
        const post = store.getStore('communityInfoMap',[]);
        const searchItem = this.props.search;
        this.props.postList = [];
        let fg = true;
        for (const [key ,value] of post) {
            if (value.comm_info.num === searchItem || value.user_info.name === searchItem) {
                const avatar = value.user_info.avatar ? this.props.urlPath + value.user_info.avatar :'../../res/images/user_avatar.png';
                this.props.postList = [{ text:value.user_info.name,num:value.comm_info.num,img:avatar }];
                fg = false;
            }
        }
    }

    // 搜索聊天记录
    public searchChat() {
        const userHistory = store.getStore('userHistoryMap',[]);
        const groupHistory = store.getStore('groupHistoryMap',[]);
        const searchItem = this.props.search;
        this.props.chatHistory = [];
        // 搜索单聊
        for (const [key,value] of userHistory) {
            if (value.msg.indexOf(searchItem) !== -1) {
                const name = getFriendAlias(value.sid).name;
                const avatar = getUserAvatar(value.sid) || '../../res/images/user_avatar.png';
                this.props.chatHistory.push({ text:name,img:avatar,msg:value.msg });                
            }
        }
    }

    // 搜索更多
    public searchAllType() {
        if (this.props.tabIndex === 0) {
            this.props.searchAll = !this.props.searchAll;
        }
        this.paint();
    }
    // 添加
    public addType(index:number) {
        console.log(index);
    }
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
    // 页面返回
    public goBack() {
        this.ok && this.ok();
    }
}