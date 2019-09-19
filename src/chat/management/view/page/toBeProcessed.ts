import { Widget } from '../../../../pi/widget/widget';
import { perPage } from '../../components/pagination';
import { rippleShow } from '../../utils/tools';

interface Props {
    sum:number;// 总页数
    perPage:number;// 每页显示多少条数据
    currentIndex:number;// 当前页数
    expandIndex:boolean;// 控制分页显示隐藏
    perPageIndex:number;// 每页显示多少个的下标
    returnStatus:number;// 选择的类型
    showDataList:any;// 表格内容
    showTitleList:any;// 表格标题
}

/**
 * 文章审核
 */
export class ToBeProcessed extends Widget {
    public props:Props = {
        sum:20,
        perPage:perPage[0],
        currentIndex:0,
        expandIndex:false,
        perPageIndex:0,
        returnStatus:0,
        showDataList:[],
        showTitleList:['名称','类别','举报原因','被举报次数','举报时间','举报人']
    };

    public create() {
        super.create();
        this.initData();
    }

    /**
     * 初始化数据
     */
    public initData() {
        //
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
        // console.log('当前页数据：',this.props.showDataList);
        // const index = (e.value) * this.props.perPage;
        // this.init(index === 0 ? 1 :index);
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
        this.paint();  
    }
}