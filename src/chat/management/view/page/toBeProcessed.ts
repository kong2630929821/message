import { deepCopy } from '../../../../app/store/memstore';
import { Widget } from '../../../../pi/widget/widget';
import { perPage } from '../../components/pagination';
import { getAllReport } from '../../net/rpc';
import { REPORT } from '../../utils/logic';
import { rippleShow } from '../../utils/tools';

interface Props {
    sum:number;// 数据条数
    perPage:number;// 每页显示多少条数据
    currentIndex:number;// 当前页数
    expandIndex:boolean;// 控制分页显示隐藏
    perPageIndex:number;// 每页显示多少个的下标
    returnStatus:number;// 选择的类型
    showDataList:any;// 表格内容
    showTitleList:any;// 表格标题
    status:boolean;// true列表页面 false详情页面
    reportDataListId:any;// 表格原始数据
    reportDataList:any;// 举报当前原始数据
    allList:any;// 举报全部数据
    allId:any;// 举报全部的ID
    currentDataId:any;// 当前处理的数据ID
    returnDeel:number;// 0待处理  1已处理
    allBtnGroup:any;// 按钮组全部
    btnGroup:any;// 按钮组
    showDataBtn:any;// 当前按钮组
}

const title = [
    ['被举报人','类别','举报原因','被举报次数','举报时间','举报人'],
    ['关联用户','类别','举报原因','被举报次数','举报时间','举报人']
];
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
        showTitleList:title[0],
        status:true,
        reportDataListId:[],
        reportDataList:[],
        allId:[[],[]],
        allList:[[],[]],
        currentDataId:[],
        returnDeel:0,
        allBtnGroup:[],
        btnGroup:[],
        showDataBtn:[]  
    };

    public create() {
        super.create();
        this.props.allList.forEach((v,i) => {
            this.initData(i);
        });
    }

    /**
     * 初始化数据
     */
    public initData(i:number) {
        let dataType = 0;
        switch (i) {
            case 0:
                // 玩家
                dataType = REPORT.REPORT_PERSON;
                break;
            case 1:
                // 动态
                dataType = REPORT.REPORT_POST;
                break;
            default:
        }
        getAllReport(this.props.returnDeel,dataType).then((r:any) => {
            this.props.allList[i] = r[0];
            this.props.allId[i] = r[1];
            this.props.allBtnGroup[i] = r[2];
            this.props.showTitleList = title[this.props.returnDeel];
            if (i === this.props.returnStatus) {
                this.props.reportDataListId = this.props.allId[i];
                this.props.reportDataList = this.props.allList[i];
                this.props.btnGroup = this.props.allBtnGroup[i];
                this.props.showDataList = this.props.reportDataList.slice(0,this.props.perPage);
                this.props.showDataBtn = this.props.btnGroup.slice(0,this.props.perPage);
                this.props.sum = this.props.showDataList.length;
            }
            this.paint();
        });
        
    }

    // 切换tab
    public checkType(index:number) {
        this.props.returnStatus = index;
        this.props.reportDataList = this.props.allList[this.props.returnStatus];
        this.props.reportDataListId = this.props.allId[this.props.returnStatus];
        this.props.btnGroup = this.props.allBtnGroup[this.props.returnStatus];
        this.props.sum = this.props.reportDataList.length;
        this.pageChange({ value:this.props.currentIndex });   
        this.paint();
    }

    // 切换待处理  已处理
    public checkDeel(index:number) {
        this.props.returnDeel = index;
        this.props.allList.forEach((v,i) => {
            this.initData(i);
        });
    }
    // 表格查看详情
    public goDetail(e:any) {
        const index = e.num;
        this.props.status = false;
        this.props.currentDataId = deepCopy(this.props.reportDataListId[this.props.currentIndex * this.props.perPage + index]);
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
        this.props.showDataList = this.props.reportDataList.slice(e.value * this.props.perPage,(e.value + 1) * this.props.perPage);
        this.props.showDataBtn = this.props.btnGroup.slice(e.value * this.props.perPage,(e.value + 1) * this.props.perPage);
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
        this.props.allList.forEach((v,i) => {
            this.initData(i);
        });
    }
}