
import { uploadFileUrlPrefix } from '../../../../../app/public/config';
import { popNewMessage } from '../../../../../app/utils/pureUtils';
import { deepCopy, popNew3 } from '../../../../../app/utils/tools';
import { Widget } from '../../../../../pi/widget/widget';
import * as store from '../../data/store';
import { getFriendAlias, getFriendsInfo, getUserAvatar, rippleShow, timestampFormat } from '../../logic/logic';
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
    fgSearch:any;// 防止多次点击调用接口
    fgStatus:boolean;// 是否点击搜索
    chatAll:any;// 全部聊天记录
    article:any;// 文章详情
    showDataList:any;// 原始数据
}
/**
 * 搜索
 */
export class Search extends Widget {
    public ok:() => void;
    public props:Props = {
        sreachTab:['好友','群聊','公众号','文章'],
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
        fgSearch:[true,true,true,true],
        fgStatus:false,
        chatAll:[],
        article:[],
        showDataList:[[],[],[],[]]
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
        this.props.fgStatus = true;
        switch (this.props.tabIndex) {
            case 0:// 好友
                if (this.props.searchAll) {
                    this.searchFriend();
                } else {
                    this.searchChat();
                    this.searchGroup();
                    this.searchPost();
                    this.searchFriend();
                }
                break;
            case 1:// 群聊
                this.searchGroup();
                break;
            case 2:// 公众号
                this.searchPost();
                break;
            case 3:// 文章
                this.searchArticle();
                break;
            default:
        }
        this.paint();
    }

    // 搜索好友
    public searchFriend() {
        const searchItem = this.props.search;
        const uid = store.getStore('uid');
        const friends = []; // 没有好友列表
        this.props.friendList = [];
        this.props.friendAdd = [];
        // 是否支持搜索全部用户
        if (this.props.searchAll) {
            if (!this.props.fgSearch[0]) {
                
                return;
            }
            this.props.fgSearch[0] = false;
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
                    // this.props.friendList.push({ text:v.name,uid:v.uid,img:avatar,myself:uid === v.uid,friend:status });  
                    this.props.friendList.push({ text:v.name,uid:v.uid,img:avatar,myself:uid === v.uid,friend:true });  
                    this.props. friendAdd.push(true);  
                });
                this.props.fgSearch[0] = true;
                this.paint();
            });
        } else {
            // 本地搜索
            for (const [key,value] of friends) {
                if (JSON.stringify(value.uid).indexOf(searchItem) !== -1 || value.name.indexOf(searchItem) !== -1  || value.acc_id.indexOf(searchItem) !== -1) {
                    const avatar = value.avatar ? this.props.urlPath + value.avatar :'../../res/images/user_avatar.png';
                    this.props.friendList.push({ text:value.name,uid:value.uid,img:avatar,friend:true });
                }
            }
        }
    }

    // 搜索群聊
    public searchGroup() {
        const group = getFriendsInfo().groups;
        const searchItem = this.props.search;
        const uid = store.getStore('uid');
        const ginfo = store.getStore('groupInfoMap'); 
        this.props.groupList = [];
        this.props.groupAdd = [];
        // 是否支持全局搜索
        if (this.props.searchAll) {
            if (!this.props.fgSearch[1]) {
                
                return;
            }
            this.props.fgSearch[1] = false;
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
                    // this.props.groupList.push({ text:v.name,gid:v.gid,img:avatar,myself:uid === v.ownerid,friend:status });  
                    this.props.groupList.push({ text:v.name,gid:v.gid,img:avatar,myself:uid === v.ownerid,friend:true });  
                    this.props.groupAdd.push(true);
                    if (!ginfo.get(`${v.gid}`)) {
                        ginfo.set(`${v.gid}`,v);
                    }
                });
                this.props.fgSearch[1] = true;
                store.setStore('groupInfoMap',ginfo);
                this.paint();
            });
        } else {
            for (const[key,value] of group) {
                if (JSON.stringify(value.gid).indexOf(searchItem) !== -1  || value.name.indexOf(searchItem) !== -1) {
                    const avatar = value.avatar ? this.props.urlPath + value.avatar :'../../res/images/groups.png';
                    this.props.groupList.push({ text:value.name,gid:value.gid,img:avatar,friend:true });
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
            if (!this.props.fgSearch[2]) {
                
                return;
            }
            this.props.fgSearch[2] = false;
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
                    // this.props.postList.push({ text:v.name,num:v.num,img:avatar,myself:uid === v.owner,friend:status,uid:v.owner }); 
                    this.props.postList.push({ text:v.name,num:v.num,img:avatar,myself:uid === v.owner,friend:true,uid:v.owner });  
                    this.props.postAdd.push(true);  
                });
                this.props.fgSearch[2] = true;
                this.paint();
            });
        } else {
            for (const [key ,value] of post) {
                if (value.comm_info.num.indexOf(searchItem) !== -1  || value.user_info.name.indexOf(searchItem) !== -1) {
                    const avatar = value.user_info.avatar ? this.props.urlPath + value.user_info.avatar :'../../res/images/user_avatar.png';
                    this.props.postList = [{ text:value.user_info.name,num:value.comm_info.num,img:avatar,uid:value.comm_info.uid }];
                }
            }
        }
        
    }

    // 搜索聊天记录
    public searchChat() {
        const userHistory = store.getStore('userHistoryMap',[]);
        const groupHistory = store.getStore('groupHistoryMap',[]);
        const group = store.getStore('groupInfoMap',[]);
        const searchItem = this.props.search;
        this.props.chatHistory = [];
        this.props.chatAll = [];
        // 搜索单聊
        for (const [key,value] of userHistory) {
            if (value.msg.indexOf(searchItem) !== -1) {
                const name = getFriendAlias(value.sid).name;
                const avatar = getUserAvatar(value.sid) || '../../res/images/user_avatar.png';
                const time = timestampFormat(value.time,1);
                this.props.chatHistory.push({ text:name,img:avatar,msg:value.msg,sid:value.sid,time:time });                
            }
        }
        for (const [key,value] of groupHistory) {
            if (value.msg.indexOf(searchItem) !== -1) {
                const gid = key.split(':')[0].substring(1);
                const gName = group.get(gid);
                const name = gName.name;
                const avatar = gName.avatar ? this.props.urlPath + gName.avatar :'../../res/images/groups.png';
                const time = timestampFormat(value.time,1);
                this.props.chatHistory.push({ text:name,img:avatar,msg:value.msg,sid:gid,time:time });                
            }
        }

        // 合并统计个数
        const data = deepCopy(this.props.chatHistory);
        const dataList = [];
        data.forEach(v => {
            if (!dataList.length) {
                dataList.push([v]);
            } else {
                let fg = true;
                dataList.forEach((t,i) => {
               
                    if (v.sid === t[0].sid) {
                        dataList[i].push(v);
                        fg = true;

                        return;
                    } 
                    fg = false;
                });
                if (!fg) {
                    dataList.push([v]);
                }
            }
            
        });
        this.props.chatHistory = [];
        dataList.forEach(v => {
            const t = deepCopy(v[0]);
            t.msg = `${v.length}条相关的聊天记录`;
            this.props.chatHistory.push(t);
        });
        this.props.chatAll = dataList;
    }

    // 搜索文章
    public searchArticle() {
        this.props.articleList = [];
        const searchItem = this.props.search;
        const uid = store.getStore('uid');
        if (!this.props.fgSearch[3]) {
                
            return;
        }
        this.props.fgSearch[3] = false;
        searchAllArticle(searchItem).then((r:any) => {
            r.forEach(v => {
                const avatar = v.avatar ? this.props.urlPath + v.avatar :'../../res/images/user_avatar.png';
                this.props.articleList.push({ text:v.username,img:avatar,msg:v.title }); 
            });
            this.props.article = r;
            this.paint();
            this.props.fgSearch[3] = true;
        });
    }

    // 搜索更多
    public searchAllType() {
        this.props.searchAll = true;
        this.props.fgStatus = false;
        [...this.props.showDataList] = [this.props.chatHistory,this.props.friendList,this.props.groupList,this.props.postList];
        this.init();
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
        if (this.props.searchAll) {
            this.props.searchAll = false;
            [this.props.chatHistory,this.props.friendList,this.props.groupList,this.props.postList] = [...this.props.showDataList];
            
            this.paint();
        } else {
            this.ok && this.ok();
        }
        
    }

    // 去聊天记录列表
    public goAllChat() {
        popNew3('chat-client-app-view-contactList-chatHistory',{ name:'聊天记录',minTitle:this.props.search ,addType:'',chatHistory:this.props.chatAll,showDataList:this.props.chatHistory });
    }

     // 点击转到对应的页面
    public goTo(i:number,index:number) {
        let data = null;
        switch (i) {
            case 0 :// 单个聊天记录
                data  = this.props.chatAll[index];
                const str = `“${data[0].text}”的聊天记录`;
                popNew3('chat-client-app-view-contactList-blacklist',{ name:this.props.search,minTitle:str,time:data.time,chatHistory:data });
                break;
            case 1:// 好友资料
                data = this.props.friendList[index];
                popNew3('chat-client-app-view-info-userDetail',{ uid:data.uid });
                break;
            case 2:// 群聊
                data = this.props.groupList[index];
                popNew3('chat-client-app-view-group-groupInfo', { gid:data.gid });
                break;
            case 3:// 公众号
                data = this.props.postList[index];
                popNew3('chat-client-app-view-person-publicHome',{ uid:data.uid,pubNum:data.num });
                break;
            case 4:// 文章
                data = this.props.article[index];
                popNew3('chat-client-app-view-info-postDetail',{ ...data,showAll:true });
                break;
            default:
        }
    }

}