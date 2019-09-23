import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { perPage } from '../../components/pagination';
import { getAllPostList } from '../../net/rpc';
import { rippleShow } from '../../utils/tools';

interface Props {
    sum:number;// 总页数
    perPage:number;// 每页显示多少条数据
    currentIndex:number;// 当前页数
    expandIndex:boolean;// 控制分页显示隐藏
    perPageIndex:number;// 每页显示多少个的下标
    showDataList:any;// 数据列表
    activeData:any;// 右侧选中的文章
    dataList:any;// 全部文章
}

/**
 * 文章审核
 */
export class ArticleReview extends Widget {
    public props:Props = {
        sum:20,
        perPage:perPage[0],
        currentIndex:0,
        expandIndex:false,
        perPageIndex:0,
        showDataList:[],
        activeData:{
            avatar: '',
            body: '',
            createtime: '',
            key: { id: 0, num: '0' },
            owner: 0,
            post_type: 0,
            state: 0,
            title: ''
        },
        dataList:[]
    };

    public create() {
        super.create();
        this.initData(0,'');
    }

    /**
     * 初始化数据
     */
    public initData(id:number,num:string) {
        getAllPostList(900000,id,num).then((r:any) => {
            this.props.dataList = r.list;
            this.props.showDataList = this.props.dataList.slice(0,this.props.perPage);
            this.props.sum = r.total;
            this.props.activeData = this.props.showDataList[0];
            this.paint();
        });
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

    // 点击审核
    public review(index:number) {
        const data = this.props.showDataList[index];
        popNew('chat-management-components-modalBox',{ data },() => {
            this.initData(0,'');
            this.paint();
        });
    }

}