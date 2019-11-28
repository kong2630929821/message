import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { perPage } from '../../../components/pagination';
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
        uid:0
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.initData(props.official);
        this.props.showDataList = this.props.dataList.slice(0,this.props.perPage);
    }

    // 初始化数据
    public initData(official?:string) {
        debugger;
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
}