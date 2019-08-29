
import { uploadFileUrlPrefix } from '../../../../../app/publicLib/config';
import { Widget } from '../../../../../pi/widget/widget';
import * as store from '../../data/store';
import { rippleShow } from '../../logic/logic';

interface Props {
    sreachTab:any;// 搜索选项卡
    tabIndex:number;// 默认tab
    friendList:any;// 好友
    groupList:any;// 群聊
    postList:any;// 公众号
    articleList:any;// 文章
    search:string;// 搜索值
    urlPath:string;  // 图片路径前
}
/**
 * 搜索
 */
export class Search extends Widget {
    public ok:() => void;
    public props:Props = {
        sreachTab:['全部','好友','群聊','公众号','文章'],
        tabIndex:0,
        friendList:[{ text:'玩家昵称',img:'../../res/images/user_avatar.png' }],
        groupList:[{ text:'群名',img:'../../res/images/groups.png' }],
        postList:[{ text:'公众号',img:'../../res/images/user_avatar.png' }],
        articleList:[],
        search:'',
        urlPath:uploadFileUrlPrefix
    };

    // 切换tab
    public checkTab(index:number) {
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
        // this.searchFriend();
        this.searchGroup();
        this.paint();
    }

    // 搜索好友
    public searchFriend() {
        const friends = store.getStore('userInfoMap',[]);
        const searchItem = this.props.search;
        let fg = true; // 是否要搜索后端
        for (const [key,value] of friends) {
            if (JSON.stringify(value.uid) === searchItem || value.name === searchItem || value.acc_id === searchItem) {
                const avatar = value.avatar ? this.props.urlPath + value.avatar :'../../res/images/user_avatar.png';
                this.props.friendList = [{ text:value.name,uid:value.uid,img:avatar }];
                fg = false;
            } else {
                this.props.friendList = [];
            }
        }
    }

    // 搜索群聊
    public searchGroup() {
        const group = store.getStore('groupInfoMap',[]);
        const searchItem = this.props.search;
        let fg = true;
        for (const[key,value] of group) {
            if (JSON.stringify(value.gid) === searchItem || value.name === searchItem) {
                const avatar = value.avatar ? this.props.urlPath + value.avatar :'../../res/images/groups.png';
                this.props.groupList = [{ text:value.name,gid:value.gid,img:avatar }];
                fg = false;
            } else {
                this.props.groupList = [];
            }
        }
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