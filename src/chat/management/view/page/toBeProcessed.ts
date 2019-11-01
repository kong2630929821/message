import { deepCopy } from '../../../../app/store/memstore';
import { Widget } from '../../../../pi/widget/widget';
import { perPage } from '../../components/pagination';
import { getAllReport } from '../../net/rpc';
import { PENALTY } from '../../utils/logic';
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
    status:boolean;// true列表页面 false详情页面
    dataList:any;// 表格原始数据
    reportDataList:any;// 举报当前原始数据
    allList:any;// 举报全部原始数据
    allId:any;// 举报全部的ID
    currentData:any;// 当前处理的数据
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
        showTitleList:['被举报人','类别','举报原因','被举报次数','举报时间','举报人'],
        status:true,
        dataList:[],
        reportDataList:[],
        allId:[[],[]],
        allList:[[],[]],
        currentData:[]
    };

    public create() {
        super.create();
        this.initData();
    }

    /**
     * 初始化数据
     */
    public initData() {
        getAllReport(0,PENALTY.DELETE_CONTENT).then((r:any) => {
            this.props.allList[0] = r[0];
            this.props.allId[0] = r[1];
            // this.props.dataList = this.props.list[this.props.returnStatus];
            // this.props.reportDataList = this.props.allList[this.props.returnStatus];
            // this.props.showDataList = this.props.dataList.slice(0,this.props.perPage);
            // this.paint();
        });
    }

    // 切换tab
    public checkType(index:number) {
        this.props.returnStatus = index;
        this.props.dataList = this.props.list[this.props.returnStatus];
        this.props.reportDataList = this.props.allList[this.props.returnStatus];
        this.pageChange({ value:this.props.currentIndex });   
        this.paint();
    }

    // 表格查看详情
    public goDetail(e:any) {
        const index = e.num;
        this.props.status = false;
        this.props.currentData = deepCopy(this.props.reportDataList[this.props.currentIndex * this.props.perPage + index]);
        this.paint();
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

    // 返回
    public exit() {
        this.props.status = true;
        this.paint();
    }

    // 刷新页面
    public ok() {
        this.props.status = true;
        this.initData();
    }
}