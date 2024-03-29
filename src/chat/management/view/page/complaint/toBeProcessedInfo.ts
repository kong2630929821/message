import { popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { perPage } from '../../../components/pagination';
import { getAllReportInfo, modifyPunishTime, reversePosts } from '../../../net/rpc';
import { popNewMessage } from '../../../utils/logic';
import { rippleShow } from '../../../utils/tools';

interface Props {
    data:[];// 处理的数据
    userName:UserName[];// 被举报人
    state:number;// 处理的类型
    reportInfoList:[];// 举报信息列表
    sum:number;// 数据条数
    perPage:number;// 每页显示多少条数据
    currentIndex:number;// 当前页数
    expandIndex:boolean;// 控制分页显示隐藏
    perPageIndex:number;// 每页显示多少个的下标
    showDataList:any[];// 当前页展示的数据
    dynamic:Dynamic;// 动态文章评论详情
    key:string;// 惩罚所需要key
    returnDeel:number;// 0待处理  1已处理
    id:string;// 处罚id%用户ID
    isShowBtn:boolean;// 是否显示处罚按钮

}
interface UserName {
    key:string;
    value:any;
    fg?:number;
}

// 动态文章评论详情
interface Dynamic {
    avatar:string;// 头像
    name:string;// 名字
    like:number;// 点赞
    commentCount:number;// 评论数
    time:string;// 时间
    count:number;
    msg:string;// 内容
    imgs:string[];// 图片
    title:string;// 标题
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
            imgs:[],
            title:''
        },
        key:'',
        returnDeel:0,
        id:'',
        isShowBtn:true
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
            // 动态文章评论详情
            this.props.dynamic = r[0];
            // 被举报人
            this.props.userName = r[1];
            // 举报信息列表
            this.props.reportInfoList = r[2];
            // 惩罚所需要key
            this.props.key = r[3];
            // 处罚id%用户ID
            this.props.id = r[4];
            // 判断是否显示操作按钮
            if (JSON.parse(r[4].split('%')[0]) === 0 && this.props.returnDeel === 1) {
                this.props.isShowBtn = false;
            }
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
        } else if (this.props.state === 2) {
            // 撤回文章
            popNew('chat-management-components-confirmBox',{ title:'撤回文章',content:'撤回所有相关内容和评论',prompt:'处理结果将通过客服通知用户',invalid:0,key:this.props.key },() => {
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

    // 释放
    public freed(e:any) {
        const id = this.props.id.split('%');
        popNew('chat-management-components-confirmBox',{ title:'解除惩罚',invalid:-1 },() => {
            modifyPunishTime(JSON.parse(id[0]),JSON.parse(id[1]),0).then(r => {
                if (r) {
                    popNewMessage('解除处罚成功');
                    notify(e.node,'ev-ok',null);
                } else {
                    popNewMessage('解除处罚失败');
                }
            });
        });
    }

    // 是否动态
    public freedPost(e:any) {
        const key = JSON.parse(this.props.id.split('%')[1]);

        popNew('chat-management-components-confirmBox',{ title:'放出动态',invalid:-1 },() => {
            reversePosts(key.id,key.num).then(r => {
                if (r) {
                    popNewMessage('放出动态成功');
                    notify(e.node,'ev-ok',null);
                } else {
                    popNewMessage('放出动态失败');
                }
            });
        });
    }

    // 查看大图
    public bigImg(src:string) {
        popNew('chat-management-components-imgBox',{ src });
    }
}
