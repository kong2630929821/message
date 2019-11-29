import { Widget } from '../../../../../pi/widget/widget';
import { getStore, setStore } from '../../../../client/app/data/store';
import { buildupImgPath, judgeLiked } from '../../../../client/app/logic/logic';
import { perPage } from '../../../components/pagination';
import { getCommentLaudList, getPostDetile, showComment, showLikeList } from '../../../net/rpc';
import { timestampFormat } from '../../../utils/logic';
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
    data: any;
    articleConent: any; // 文章内容
    dealData:any;  // 组装数据
    timeFormat:any; // 时间处理,
    articleData:any; // 经过处理后的详情内容

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
        active: 'comment', // 标签的激活状态
        postItem: '', // 发布的项
        commentList: [], // 评论列表
        data: {}, // 保存父组件传递的值
        articleConent : '', // 文章内容
        dealData:this.dealData,
        timeFormat:timestampFormat,
        articleData: []
    };
    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const currentData = this.props.data;
        console.log(currentData);
        getCommentLaudList(currentData.key.num,currentData.key.id).then((r:number[]) => {
            console.log(r);
            this.props.commentList = this.props.commentList.map(v => {
                v.likeActive = r.indexOf(v.key.id) > -1;

                return v;
            });
            this.props.commentLikeList = r;
            this.paint();
        });
        showComment(currentData.key.num, currentData.key.id).then((r: any) => {
            console.log(r);
            this.props.commentList = r.map(v => {
                v.likeActive = this.props.commentLikeList.indexOf(v.key.id) > -1;

                return v;
            });
            console.log(this.props.commentList);
            this.paint();
        });
        showLikeList(currentData.key.num,currentData.key.id).then((r: any) => {
            console.log(r);
            this.props.likeList = r.map(v => {
                v.avatar = buildupImgPath(v.avatar);
                
                return v;
            });
            this.paint();
        });
        getPostDetile(currentData.key.num,currentData.key.id).then((r:any) => {
            currentData.likeCount = r[0].likeCount;
            currentData.commentCount = r[0].commentCount;
            this.paint();
            // 刷新广场数据
            const postlist = getStore('postReturn',[]);
            const ind = postlist.postList.findIndex(r => r.key.num === currentData.key.num && r.key.id === currentData.key.id);
            if (ind > -1) {
                postlist.postList[ind].commentCount = currentData.commentCount;
                postlist.postList[ind].likeCount = currentData.likeCount;
                setStore('postReturn',postlist);
            }
        });
        this.initData(currentData);
    }
    // 初始化数据
    public initData(data?:any) {
        console.log(data);
        this.props.dataList = [
            {
                banner : data ? (JSON.parse(data.body).imgs).toString() : '',
                title:data ? data.title :'',
                time:data ? timestampFormat(data.createtime) :'',
                commentCount: data ? data.commentCount :0,
                likeCount: data ? data.likeCount :0
            }
        ];
        this.props.articleData = [
            {
                banner : data ? (JSON.parse(data.body).imgs).toString() : '',
                title:data ? data.title :'',
                body: data ? (JSON.parse(data.body).msg).toString() : '',
                time:data ? timestampFormat(data.createtime) :'',
                commentCount: data ? data.commentCount :0,
                likeCount: data ? data.likeCount :0
            }
        ];
        console.log(this.props.articleData);
        console.log(this.props.dataList);         
    }
    public create() {
        super.create();
        this.props.showDataList = this.props.dataList.slice(0,this.props.perPage);
    }

    public attach() {
        const content = document.querySelector('#articleBody');
        // tslint:disable-next-line:no-inner-html
        content.innerHTML = this.props.articleData[0].body;
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
     * 组装squareItem的数据
     */
    public dealData(v:any,r:boolean) {
        return { 
            ...v,
            showUtils: r 
        };
    }
    // 切换标签
    public changeTab(tab:any) {
        this.props.active =  this.props.active === 'comment' ? '' :'comment';
        this.paint();
    }
}