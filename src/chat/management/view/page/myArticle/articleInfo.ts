import { Widget } from '../../../../../pi/widget/widget';
import { getStore, setStore } from '../../../../client/app/data/store';
import { buildupImgPath, judgeLiked } from '../../../../client/app/logic/logic';
import { getCommentLaudList, getPostDetile, showComment, showLikeList } from '../../../../client/app/net/rpc';
import { perPage } from '../../../components/pagination';
import { rippleShow } from '../../../utils/tools';

interface Props {
    likeList: any; // 点赞列表
    commentLikeList: number[]; // 评论中点赞的列表
    likeActive: any;   // 是否点赞
    expandItemTop: boolean;
    expandItem: number;
    active: string; // 标签的激活状态
    postItem: any; // 发布的项
    commentList: any; // 评论列表
    showDataList:DraftItem[];// 展示数据
    dataList:DraftItem[];
    sum:number;// 数据条数
    perPage:number;// 每页显示多少条数据
    currentIndex:number;// 当前页数
    expandIndex:boolean;// 控制分页显示隐藏
    perPageIndex:number;// 每页显示多少个的下标
    status:boolean;// true列表 false详情
}

interface DraftItem {
    banner:string;
    title:string;
    time:string;
    commentCount:number;
    likeCount:number;
}
/**
 * 草稿
 */
export class ArticleInfo extends Widget {
    public props:Props = {
        dataList:[],
        sum:20,
        perPage:perPage[0],
        currentIndex:0,
        expandIndex:false,
        perPageIndex:0,
        showDataList:[],
        status:false,
        likeList: '', // 点赞列表
        commentLikeList: [], // 评论中点赞的列表
        likeActive: false,   // 是否点赞
        expandItemTop: false,
        expandItem: -1,
        active: '', // 标签的激活状态
        postItem: '', // 发布的项
        commentList: [] // 评论列表
    };
    public setProps(props: any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.props.likeActive = judgeLiked(this.props.postItem.key.num,this.props.postItem.key.id);
        getCommentLaudList(this.props.postItem.key.num,this.props.postItem.key.id).then((r:number[]) => {
            this.props.commentList = this.props.commentList.map(v => {
                v.likeActive = r.indexOf(v.key.id) > -1;

                return v;
            });
            this.props.commentLikeList = r;
            this.paint();
        });
        showComment(this.props.postItem.key.num, this.props.postItem.key.id).then((r: any) => {
            this.props.commentList = r.map(v => {
                v.likeActive = this.props.commentLikeList.indexOf(v.key.id) > -1;

                return v;
            });
            this.paint();
        });
        showLikeList(this.props.postItem.key.num,this.props.postItem.key.id).then((r: any) => {
            this.props.likeList = r.map(v => {
                v.avatar = buildupImgPath(v.avatar);
                
                return v;
            });
            this.paint();
        });
        getPostDetile(this.props.postItem.key.num,this.props.postItem.key.id).then((r:any) => {
            this.props.postItem.likeCount = r[0].likeCount;
            this.props.postItem.commentCount = r[0].commentCount;
            this.paint();
            // 刷新广场数据
            const postlist = getStore('postReturn',[]);
            const ind = postlist.postList.findIndex(r => r.key.num === this.props.postItem.key.num && r.key.id === this.props.postItem.key.id);
            if (ind > -1) {
                postlist.postList[ind].commentCount = this.props.postItem.commentCount;
                postlist.postList[ind].likeCount = this.props.postItem.likeCount;
                setStore('postReturn',postlist);
            }
        });
    }
    public create() {
        super.create();
        this.props.showDataList = this.props.dataList.slice(0,this.props.perPage);
    }

    // 重置页面的展开状态
    public close() {
        this.props.expandIndex = false;
        this.paint();
    }

    // 分页变化
    public pageChange(e:any) {
        this.close();
        this.props.currentIndex = e.value;
        this.props.showDataList = this.props.dataList.slice(e.value * this.props.perPage,(e.value + 1) * this.props.perPage);
        this.paint();
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
    // 过滤器
    public expand(e:any) {
        this.close();
        this.props.expandIndex = e.value;
        this.paint();
    }
    
    // 每页展示多少数据
    public perPage(e:any) {
        this.props.perPage = e.value;
        this.props.perPageIndex = e.index;
        this.props.expandIndex = false;
        this.pageChange({ value:0 });   
        this.paint();  
    }
    /**
     * 删除评论
     */
    public deleteComment(i:number) {
        this.props.commentList.splice(i,1);
        this.props.postItem.commentCount--;
        this.paint();
        this.updateComment();
    }
    // 更新评论
    public updateComment() {
        const postlist = getStore('postReturn/postList',[]);
        const ind = postlist.findIndex((r:any) => {
            return r.key.num === this.props.postItem.key.num && r.key.id === this.props.postItem.key.id;
        });
        if (ind > -1) {
            postlist[ind].commentCount = this.props.postItem.commentCount;
            setStore('postReturn/postList',postlist);
        }
    }
    
    // 切换tab
    public changeTab(tab: string) {
        this.pageClick();
        this.props.active = tab;
        this.paint();
    }
    /**
     * 展示操作
     */
    public expandTools(e:any,i:number) {
        this.pageClick();
        this.props.expandItem = e.value ? i :-1;
        this.paint();
    }

    public toolsExpand() {
        this.props.expandItem = -1;
        this.paint();
    }
    public pageClick() {
        this.props.expandItem = -1;
        this.props.expandItemTop = !this.props.expandItemTop;
        this.paint();
    }

}