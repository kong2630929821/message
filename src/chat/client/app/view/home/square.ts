import { popNew3 } from '../../../../../app/utils/tools';
import { notify } from '../../../../../pi/widget/event';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore, register } from '../../data/store';
import { postLaud, showPost } from '../../net/rpc';

export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    showTag:boolean;  // 显示标签列表
    tagList:string[];  // 标签列表
    active:number;  // 当前显示的标签
    follows:number;  // 关注人数
    expandItem:number;  // 当前展开工具栏的帖子下标
    dealData:any;  // 组装数据
    refresh:boolean; // 是否可以请求更多数据
}
export const TagList = ['广场','关注','公众号','热门'];
/**
 * 广场
 */
export class Square extends Widget {
    public state:any;
    public props:Props = {
        showTag:false,
        tagList:TagList,
        active:0,
        follows:0,
        expandItem:-1,
        dealData:this.dealData,
        refresh:true
    };
    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        State.postList = [];
        this.state = State;
        this.init(this.props.active);
        showPost(this.props.active + 1);
    }
    public firstPaint() {
        super.firstPaint();
        register('uid',() => {  // 聊天用户登陆成功
            this.setProps(this.props);
        });
    }
    public init(ind:number) {
        if (ind === 2) {
            const pubNum = getStore('pubNum', 0);
            this.props.follows = this.state.followList.public_list.filter(v => {

                return v !== pubNum;
            }); 
        } else {
            const user = getStore(`userInfoMap/${getStore('uid')}`, {});
            this.props.follows = this.state.followList.person_list.filter(v => {
                return v !== user.comm_num;
            });
        } 
    }

    // 切换tag
    public changeTag(ind:number,e:any) {
        this.props.showTag = false;
        this.props.active = ind;
        this.init(ind);
        this.paint();
        notify(e.node,'ev-square-change',{ value:ind });
    }

    // 管理我关注的公众号 其他账号
    public goManage() {
        popNew3('chat-client-app-view-person-manageFollow',{ followList:this.props.follows });
    }

    /**
     * 点赞
     */
    public likeBtn(i:number) {
        const v = this.state.postList[i];
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
        const v = this.state.postList[i];
        popNew3('chat-client-app-view-info-editComment',{ key:v.key },() => {
            v.commentCount ++;
            this.paint();
            popNew3('chat-client-app-view-info-postDetail',{ ...v,showAll:true });
        });
    }

    /**
     * 删除
     */
    public delPost(i:number) {
        this.state.postList.splice(i,1);
        this.paint();
    }

    /**
     * 查看详情
     */
    public goDetail(i:number) {
        popNew3('chat-client-app-view-info-postDetail',{ ...this.state.postList[i],showAll:true });
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
    public dealData(v:any,r:boolean) {
        return { 
            ...v,
            showUtils: r 
        };
    }

    /**
     * 滚动加载更多帖子
     */
    public scrollPage() {
        this.pageClick();
        const page = document.getElementById('squarePage');
        const contain = document.getElementById('squareContain');
        if (this.props.refresh && (contain.offsetHeight - page.scrollTop - page.offsetHeight) < 150 && this.state.postList.length % 5 === 0) {
            this.props.refresh = false;
            const list = this.state.postList;
            showPost(this.props.active + 1,list[list.length - 1].key.num,list[list.length - 1].key.id).then(r => {
                this.props.refresh = true;
            });
        }
    }
}
const State = {
    followList:{
        person_list:[],
        public_list:[]
    },
    likeList:[],
    postList:[]  // 帖子列表
};
// 关注列表
register('followNumList',r => {
    for (const value of r.values()) {
        State.followList = value;
        const list = value.person_list.concat(value.public_list);
        State.postList.forEach((v,i) => {
            State.postList[i].followed = list.indexOf(v.key.num) > -1;
        });
    }
   
    forelet.paint(State);
});
// 点赞列表
register('laudPostList',r => {
    for (const value of r.values()) {
        State.likeList = value.list;
        State.postList.forEach((v,i) => {
            State.postList[i].likeActive = State.likeList.findIndex(r => r.num === v.key.num && r.id === v.key.id) > -1;
        });
    }
    
    forelet.paint(State);
});
// 帖子数据
register('postList',r => {
    State.postList = r;
    forelet.paint(State);
});
