import { popNew } from '../../../../pi/ui/root';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';
import { perPage } from '../../components/pagination';
import { getAllReportInfo } from '../../net/rpc';
import { rippleShow } from '../../utils/tools';

interface Props {
    data:any;// 处理的数据
    userName:any;// 被举报人
    state:number;// 处理的类型
    reportInfoList:any;// 举报信息列表
    sum:number;// 数据条数
    perPage:number;// 每页显示多少条数据
    currentIndex:number;// 当前页数
    expandIndex:boolean;// 控制分页显示隐藏
    perPageIndex:number;// 每页显示多少个的下标
    showDataList:any[];// 当前页展示的数据
    dynamic:any;// 动态文章评论详情
    key:string;// 惩罚所需要key

}

/**
 * 待处理详情
 */
export class ToBeProcessedInfo extends Widget {
    public props:Props = {
        data:[],
        state:0,
        userName:[],
// ==================================================
        reportInfoList:[],
        sum:20,
        perPage:perPage[0],
        currentIndex:0,
        expandIndex:false,
        perPageIndex:0,
        showDataList:[],
        dynamic:{
            avatar:'',
            name:'',
            like:0,
            commentCount:0,
            time:'',
            count:0,
            msg:'',
            imgs:[]
        },
        key:''
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.initData();
    }

    // 初始化数据
    public initData() {
        getAllReportInfo(this.props.data,this.props.state).then(r => {
            this.props.dynamic = r[0];
            this.props.userName = r[1];
            this.props.reportInfoList = r[2];
            this.props.key = r[3];
            this.props.showDataList = this.props.reportInfoList.slice(0,this.props.perPage);
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
        this.props.showDataList = this.props.reportInfoList.slice(e.value * this.props.perPage,(e.value + 1) * this.props.perPage);
        this.paint();
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

    // 投诉不成立
    public unDeel(e:any) {
        popNew('chat-management-components-confirmBox',{ title:'不处理',content:'投诉没有问题，不做惩罚处理',invalid:1,key:this.props.key },() => {
            notify(e.node,'ev-ok',null);
        });
    }

    // 点击处理
    public deel(e:any) {
        if (this.props.state === 0) {
            // 处理用户
            const userInfo = {
                id:this.props.userName[0].value,
                name:this.props.userName[1].value,
                sex:this.props.userName[1].fg,
                key:this.props.key
            };
            const punishment = this.props.userName[6];
            popNew('chat-management-components-reportBox',{ userInfo,punishment },() => {
                notify(e.node,'ev-ok',null);
            });
        } else if (this.props.state === 1) {
            // 撤回动态
            popNew('chat-management-components-confirmBox',{ title:'撤回动态',content:'撤回所有相关内容和评论',prompt:'处理结果将通过客服通知用户',invalid:0,key:this.props.key },() => {
                notify(e.node,'ev-ok',null);
            });
        }
        
    }
    // 返回
    public exit(e:any) {
        notify(e.node,'ev-exit',null);
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}
