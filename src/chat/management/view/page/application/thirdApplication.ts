import { Widget } from '../../../../../pi/widget/widget';
import { perPage } from '../../../components/pagination';
import { rippleShow } from '../../../utils/tools';

interface Props {
    dataList:any[];
    sum:number;// 数据条数
    perPage:number;// 每页显示多少条数据
    currentIndex:number;// 当前页数
    expandIndex:boolean;// 控制分页显示隐藏
    perPageIndex:number;// 每页显示多少个的下标
    showDataList:any[];// 页面展示的数据
}

/**
 * 第三方应用列表
 */
export class ThirdApplication extends Widget {
    public props:Props = {
        dataList:[
            {
                icon:'chat/management/res/images/xianzhixiadao.png',
                name:'仙之侠道',
                desc:'2019最玄幻网游',
                customerId:'000000',
                appId:'000000',
                time:'2019-11-20'
            },
            {
                icon:'chat/management/res/images/xianzhixiadao.png',
                name:'仙之侠道',
                desc:'2019最玄幻网游',
                customerId:'000000',
                appId:'000000',
                time:'2019-11-20'
            },
            {
                icon:'chat/management/res/images/xianzhixiadao.png',
                name:'仙之侠道',
                desc:'2019最玄幻网游',
                customerId:'000000',
                appId:'000000',
                time:'2019-11-20'
            },
            {
                icon:'chat/management/res/images/xianzhixiadao.png',
                name:'仙之侠道',
                desc:'2019最玄幻网游',
                customerId:'000000',
                appId:'000000',
                time:'2019-11-20'
            },
            {
                icon:'chat/management/res/images/xianzhixiadao.png',
                name:'仙之侠道',
                desc:'2019最玄幻网游',
                customerId:'000000',
                appId:'000000',
                time:'2019-11-20'
            },
            {
                icon:'chat/management/res/images/xianzhixiadao.png',
                name:'仙之侠道',
                desc:'2019最玄幻网游',
                customerId:'000000',
                appId:'000000',
                time:'2019-11-20'
            },
            {
                icon:'chat/management/res/images/xianzhixiadao.png',
                name:'仙之侠道',
                desc:'2019最玄幻网游',
                customerId:'000000',
                appId:'000000',
                time:'2019-11-20'
            }
        ],
        sum:20,
        perPage:perPage[0],
        currentIndex:0,
        expandIndex:false,
        perPageIndex:0,
        showDataList:[]
    };

    public create() {
        super.create();
        this.props.showDataList = this.props.dataList.slice(0,this.props.perPage);
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
     * 查看应用
     * @param index 应用下标
     */
    public goAppInif(index:number) {
        
    }
}