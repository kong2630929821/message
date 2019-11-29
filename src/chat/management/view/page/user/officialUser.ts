import { Widget } from '../../../../../pi/widget/widget';
import { perPage } from '../../../components/pagination';
import { getOfficialList } from '../../../net/rpc';
import { deepCopy } from '../../../store/memstore';
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
    list:any[];// 原始数据
    status:boolean;// 是否展示二级页面
    official:string;// 官方
    uid:number;
    punish:any;// 当前惩罚
}

/**
 * 查询用户
 */
export class OfficalUser extends Widget {
    public props:Props = {
        dataList:[
            ['用户昵称用户昵称用户昵称','10001','17555555544','2015-05-42 14:20','个人']
        ],
        showTitleList:['昵称','ID','手机号','注册时间','绑定应用'],
        sum:20,
        perPage:perPage[0],
        currentIndex:0,
        expandIndex:false,
        perPageIndex:0,
        showDataList:[],
        list:[],
        status:false,
        official:'',
        uid:0,
        punish:{}
    };

    public create() {
        super.create();
        this.initData();
        
    }

    public initData() {
        this.props.dataList = [];
        getOfficialList().then((r:any) => {
            this.props.list = r.data;
            this.props.dataList = r.tableData;
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

    // 表格查看详情
    public goDetail(e:any) {
        const index = e.num;
        this.props.status = true;
        const currentData = deepCopy(this.props.dataList[this.props.currentIndex * this.props.perPage + index]);
        const data = deepCopy(this.props.list[this.props.currentIndex * this.props.perPage + index]);
        this.props.official = currentData[currentData.length - 1] === '无' ? '' :currentData[currentData.length - 1];
        this.props.uid = data.user_info.uid;
        this.props.punish = data.now_publish;
        this.paint();
    }

    // 返回
    public goBack(e:any) {
    // fg判斷是否需要刷新頁面數據
        if (e.fg) {
            this.initData();
        }
        this.props.status = false;
        this.paint();
    }
}