
import { uploadFileUrlPrefix } from '../../../../../app/publicLib/config';
import { popNewMessage } from '../../../../../app/utils/tools';
import { Widget } from '../../../../../pi/widget/widget';
import * as store from '../../data/store';
import { getFriendAlias, getUserAvatar, rippleShow } from '../../logic/logic';
import { applyToGroup, applyUserFriend, follow, searchAllArticle, searchAllGroup, searchAllPost, searchAllUserInfo } from '../../net/rpc';

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
    friendAdd:any;// 搜索到的好友状态
    groupAdd:any;// 搜索到的群里状态
    postAdd:any;// 搜索到的公众号状态
    fgSearch:boolean;
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
        searchAll:false,
        friendAdd:[],
        groupAdd:[],
        postAdd:[],
        fgSearch:true
    };

    // 初始化
    public init() {
        this.props.friendList = [];
        this.props.groupList = [];
        this.props.postList = [];
        this.props.chatHistory = [];
        this.props.articleList = [];
        this.paint();
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
        if (!this.props.search) {
            popNewMessage('请输入搜索条件');
            this.init();

            return;
        }
        switch (this.props.tabIndex) {
            case 0 :// 全部
                this.searchFriend();
                this.searchGroup();
                this.searchPost();
                if (this.props.searchAll) {
                    this.searchArticle();
                } else {
                    this.searchChat();
                }    
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
                this.searchArticle();
                break;
            default:
        }
        this.paint();
    }

    // 搜索好友
    public searchFriend() {
        const friends = store.getStore('userInfoMap',[]);
        const searchItem = this.props.search;
        const uid = store.getStore('uid');
        this.props.friendList = [];
        this.props.friendAdd = [];
        // 是否支持搜索全部用户
        if (this.props.searchAll) {
            searchAllUserInfo(searchItem).then((r:any) => {
                r.forEach(v => {
                    const avatar = v.avatar ? this.props.urlPath + v.avatar :'../../res/images/user_avatar.png';
                    let status = false;
                    // 判断是否是好友
                    for (const [key,value] of friends) {
                        if (value.uid === v.uid) {
                            status = true;
                        }
                    }
                    this.props.friendList.push({ text:v.name,uid:v.uid,img:avatar,myself:uid === v.uid,friend:status });  
                    this.props. friendAdd.push(true);  
                });
                this.paint();
            });
        } else {
            // 本地搜索
            for (const [key,value] of friends) {
                if (JSON.stringify(value.uid) === searchItem || value.name === searchItem || value.acc_id === searchItem) {
                    const avatar = value.avatar ? this.props.urlPath + value.avatar :'../../res/images/user_avatar.png';
                    this.props.friendList.push({ text:value.name,uid:value.uid,img:avatar,friend:true });
                }
            }
        }
    }

    // 搜索群聊
    public searchGroup() {
        const group = store.getStore('groupInfoMap',[]);
        const searchItem = this.props.search;
        const uid = store.getStore('uid');
        this.props.groupList = [];
        this.props.groupAdd = [];
        // 是否支持全局搜索
        if (this.props.searchAll) {
            searchAllGroup(searchItem).then((r:any) => {
                r.forEach(v => {
                    const avatar = v.avatar ? this.props.urlPath + v.avatar :'../../res/images/user_avatar.png';
                    let status = false;
                     // 判断是否加入过群聊
                    for (const[key,value] of group) {
                        if (value.gid === v.gid) {
                            status = true;
                        }
                    }
                    this.props.groupList.push({ text:v.name,gid:v.gid,img:avatar,myself:uid === v.ownerid,friend:status });  
                    this.props.groupAdd.push(true);  
                });
                this.paint();
            });
        } else {
            for (const[key,value] of group) {
                if (JSON.stringify(value.gid) === searchItem || value.name === searchItem) {
                    const avatar = value.avatar ? this.props.urlPath + value.avatar :'../../res/images/groups.png';
                    this.props.groupList.push({ text:value.name,gid:value.gid,img:avatar });
                }
            }
        }
        
    }

    // 搜索公众号
    public searchPost() {
        const post = store.getStore('communityInfoMap',[]);
        const searchItem = this.props.search;
        const uid = store.getStore('uid');
        this.props.postList = [];
        this.props.postAdd = [];
        // 是否支持全局搜索
        if (this.props.searchAll) {
            if (!this.props.fgSearch) {
                
                return;
            }
            this.props.fgSearch = false;
            searchAllPost(searchItem).then((r:any) => {
                r.forEach(v => {
                    const avatar = v.avatar ? this.props.urlPath + v.avatar :'../../res/images/user_avatar.png';
                    let status = false;
                    // 判断是否关注过公众号
                    for (const [key ,value] of post) {
                        if (value.num === v.num) {
                            status = true;
                        }
                    }
                    this.props.postList.push({ text:v.name,num:v.num,img:avatar,myself:uid === v.owner,friend:status });  
                    this.props.postAdd.push(true);  
                });
                this.props.fgSearch = true;
                this.paint();
            });
        } else {
            for (const [key ,value] of post) {
                if (value.comm_info.num === searchItem || value.user_info.name === searchItem) {
                    const avatar = value.user_info.avatar ? this.props.urlPath + value.user_info.avatar :'../../res/images/user_avatar.png';
                    this.props.postList = [{ text:value.user_info.name,num:value.comm_info.num,img:avatar }];
                }
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
        for (const [key,value] of groupHistory) {
            if (value.msg.indexOf(searchItem) !== -1) {
                const name = getFriendAlias(value.sid).name;
                const avatar = getUserAvatar(value.sid) || '../../res/images/user_avatar.png';
                this.props.chatHistory.push({ text:name,img:avatar,msg:value.msg });                
            }
        }
    }

    // 搜索文章
    public searchArticle() {
        this.props.articleList = [];
        const searchItem = this.props.search;
        const uid = store.getStore('uid');
        searchAllArticle(searchItem).then((r:any) => {
            r.forEach(v => {
                const avatar = v.avatar ? this.props.urlPath + v.avatar :'../../res/images/user_avatar.png';
                this.props.articleList.push({ text:v.username,img:avatar,msg:v.title });
                this.paint();
            });
        });
    }

    // 搜索更多
    public searchAllType() {
        if (this.props.tabIndex === 0) {
            this.props.searchAll = !this.props.searchAll;
        }
        this.paint();
    }

    // 添加好友
    public addFriend(index:number) {
        const data = this.props.friendList[index];
        applyUserFriend(data.uid).then(() => {
            popNewMessage('已申请');
            this.props.friendAdd[index] = false;
            this.paint();
        });
    }

    // 添加群聊
    public addGroup(index:number) {
        const data = this.props.groupList[index];   
        applyToGroup(data.gid).then(() => {
            popNewMessage('发送成功');
            this.props.groupAdd[index] = false;
            this.paint();
        },(r) => {
            if (r.r === -2) {
                popNewMessage('您申请的群不存在');
            } else if (r.r === -1) {
                popNewMessage('您已经是该群的成员');
            }
        });     
    }

    // 关注公众号
    public addPost(index:number) {
        const data = this.props.postList[index];
        follow(data.num).then(() => {
            popNewMessage('关注成功');
            this.props.postAdd[index] = false;
            this.paint();
        });
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