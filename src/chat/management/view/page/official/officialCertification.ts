import { Widget } from '../../../../../pi/widget/widget';
import { perPage } from '../../../components/pagination';
import { reviewOfficial } from '../../../net/rpc';
import { deepCopy } from '../../../store/memstore';
import { timestampFormat } from '../../../utils/logic';
import { rippleShow } from '../../../utils/tools';

interface Props {
    dataList:any[];
    showTitleList:string[];
    sum:number;// 数据条数
    perPage:number;// 每页显示多少条数据
    currentIndex:number;// 当前页数
    expandIndex:boolean;// 控制分页显示隐藏
    perPageIndex:number;// 每页显示多少个的下标
    showDataList:any[];
    list:any;// 原始数据
    status:boolean;// 是否展示2级页面
    currentData:any;// 传给2级页面的数据
}

/**
 * 查询用户
 */
export class OfficialCertification extends Widget {
    public props:Props = {
        dataList:[],
        showTitleList:['申请人ID','简介','用户昵称','申请时间'],
        sum:20,
        perPage:perPage[0],
        currentIndex:0,
        expandIndex:false,
        perPageIndex:0,
        showDataList:[],
        list:[],
        status:false,
        currentData:{}
    };

    public create() {
        super.create();
        this.initData();
    }

    /**
     * 初始化数据
     */
    public initData() {
        this.props.dataList = [];
        reviewOfficial(0,1,0).then((r:any) => {
            const count = r.total;
            reviewOfficial(0,count,0).then((r:any) => {
                r.list.forEach(v => {
                    this.props.dataList.push([v.user_info.acc_id,v.apply_info.desc,v.user_info.name,timestampFormat(JSON.parse(v.apply_info.time))]);
                });
                this.props.showDataList = this.props.dataList.slice(0,this.props.perPage);
                this.props.list = r.list;
                this.paint();
            });
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

    // 表格查看详情
    public goDetail(e:any) {
        const index = e.num;
        this.props.status = true;
        this.props.currentData = deepCopy(this.props.list[this.props.currentIndex * this.props.perPage + index]);
        this.paint();
    }

    // 返回
    public goBack(e:any) {
        debugger;
        if (e.fg) {
            this.initData();
        }
        this.props.status = false;
        this.paint();
    }
}