import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { perPage } from '../../../components/pagination';
import { getReportUserInfo } from '../../../net/rpc';
import { deepCopy } from '../../../store/memstore';
import { rippleShow } from '../../../utils/tools';

interface Props {
    sum:number;// 数据条数
    perPage:number;// 每页显示多少条数据
    currentIndex:number;// 当前页数
    expandIndex:boolean;// 控制分页显示隐藏
    perPageIndex:number;// 每页显示多少个的下标
    showDataList:any;// 表格内容
    showTitleList:any;// 表格标题
    dataList:any;// 全部数据
    official:string;// 官方
    uid:number;
    punish:any;// 当前惩罚
    status:boolean;// 是否展示2级页面
    list:any[];// 原始数据
    reportId:number;// 举报ID
    reportType:number;// 举报的类型
}

/**
 * 文章审核
 */
export class UserInfo extends Widget {
    public props:Props = {
        sum:20,
        perPage:perPage[0],
        currentIndex:0,
        expandIndex:false,
        perPageIndex:0,
        showDataList:[],
        showTitleList:['被投诉类别','被投诉原因','处理时间','处理结果'],
        dataList:[['','','','']],
        official:'',
        uid:0,
        punish:{},
        status:false,
        list:[],
        reportId:0,
        reportType:0
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.initData(props.official);
    }

    // 初始化数据
    public initData(official?:string) {

        // 当前惩罚
        
        // 获取被举报信息
        getReportUserInfo(this.props.uid).then(r => {
            this.props.dataList = r[0];
            this.props.list = r[1];
            this.props.showDataList = this.props.dataList.slice(0,this.props.perPage);
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
    
    // 返回
    public goBack(fg:boolean,e:any) {
        notify(e.node,'ev-goBack',{ fg });
    }

    // 表格查看详情
    public goDetail(e:any) {
        const index = e.num;
        this.props.status = true;
        const currentData = deepCopy(this.props.list[this.props.currentIndex * this.props.perPage + index]);
        this.props.reportId = currentData.id;
        this.props.reportType = JSON.parse(currentData.key.split('%')[0]);
        this.paint();
    }
}