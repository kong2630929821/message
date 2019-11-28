import { Widget } from '../../../../../pi/widget/widget';
import { perPage } from '../../../components/pagination';
import { queryUser } from '../../../net/rpc';
import { deepCopy } from '../../../store/memstore';
import { popNewMessage } from '../../../utils/logic';
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
    input:string;// 搜索值
}

/**
 * 查询用户
 */
export class QueryUser extends Widget {
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
        input:''
    };

    public inputChange(e:any) {
        this.props.input = e.value;
    }

    /**
     * 搜索
     */
    public search() {
        if (!this.props.input) {
            popNewMessage('请输入搜索值');

            return;
        }

        queryUser(this.props.input).then(r => {
            debugger;
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
        const currentData = deepCopy(this.props.dataList[this.props.currentIndex * this.props.perPage + index]);
        this.paint();
    }
}