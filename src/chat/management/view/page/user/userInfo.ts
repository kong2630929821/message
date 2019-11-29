import { popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { buildupImgPath } from '../../../../client/app/logic/logic';
import { perPage } from '../../../components/pagination';
import { HAOHAIAPPID } from '../../../config';
import { getReportUserInfo, getUserDetail, modifyPunishTime, setCancelOfficial, setOfficial } from '../../../net/rpc';
import { deepCopy, getStore, setStore } from '../../../store/memstore';
import { popNewMessage } from '../../../utils/logic';
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
    reportId:number[];// 举报ID
    reportType:number;// 举报的类型
    userInfo:any;// 用户信息
    buildupImgPath:any;  // 组装图片路径
    appId:string;//
    key:string;// 处罚的key

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
        reportId:[],
        reportType:0,
        userInfo:{
            acc_id:'',
            name:'',
            avatar:'',
            sex:2,
            tel:'',
            fans:0,
            attention:0,
            post:0,
            report:0,
            reported:0,
            punish:0,
            nowPublish:'',
            id:0
        },
        buildupImgPath:buildupImgPath,
        appId:'',
        key:''
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.props.appId = deepCopy(this.props.official);
        this.initData(props.official);
    }

    // 初始化数据
    public initData(official?:string) {
        // 判断官方
        if (official) {
            const appList = getStore('appList',[]);
            appList.forEach(v => {
                if (v.appid === official) {
                    this.props.official = v.title;
                }
            });

            if (official === HAOHAIAPPID) {
                this.props.official = '好嗨客服';
            }
        }
        // 用户信息
        getUserDetail(this.props.uid).then((r:any) => {
            this.props.userInfo = r[0];
            this.props.key = r[1];
            this.paint();
        });
        
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
        this.props.reportId = [currentData.id];
        const id = JSON.parse(currentData.key.split('%')[0]);

        // 对应审核惩罚的列标下标
        if (id === 1) {
            this.props.reportType = 0;
        } else if (id === 3) {
            this.props.reportType = 1;
        }
        this.paint();
    }

    // 返回
    public exit(fg:boolean,e:any) {
        if (fg) {
            this.initData();
        }
        this.props.status = false;
        this.paint();
    }

    /**
     * 取消官方认证
     */
    public cancelOfficial(e:any) {
        popNew('chat-management-components-confirmBox',{ title:'确认取消官方身份',prompt:'同时解除第三方绑定关系',invalid:-1 },() => {
            setCancelOfficial(this.props.userInfo.acc_id).then(r => {
                if (r === 1) {
                    this.props.official = '';
                    popNewMessage('取消官方认证成功');
                    // 修改绑定信息
                    const appId = getStore('bindApp');
                    appId.splice(appId.indexOf(this.props.appId),1);
                    setStore('bindApp',appId);
                    this.paint();
                    this.goBack(true,e);
                } else {
                    popNewMessage('取消官方认证失败');
                }
            });
        });
       
    }

    /**
     * 设置官方账号
     */
    public setOfficial(e:any) {
        popNew('chat-management-components-addApplicationModule',{ title:'绑定第三方应用' },(appId:string) => {
            setOfficial(appId,this.props.userInfo.acc_id).then(r => {
                if (r === 1) {
                    this.props.official = '';
                    popNewMessage('设置成功');
                    // 添加一个绑定应用
                    const appIds = getStore('bindApp');
                    appIds.push(appId);
                    setStore('bindApp',appIds);
                    this.paint();
                    this.goBack(true,e);
                } else {
                    popNewMessage('设置失败');
                }
            });
        });
    }

    /**
     * 重新绑定app
     */
    public rebind(e:any) {
        popNew('chat-management-components-addApplicationModule',{ title:'更换第三方应用' },(appId:string) => {
            setCancelOfficial(this.props.userInfo.acc_id).then(r => {
                if (r === 1) {
                    this.props.official = '';
                    popNewMessage('取消官方认证成功');
                     // 修改绑定信息
                    const appIds = getStore('bindApp');
                    appIds.splice(appIds.indexOf(this.props.appId),1);
                    setStore('bindApp',appIds);
                    setOfficial(appId,this.props.userInfo.acc_id).then(r => {
                        if (r === 1) {
                            this.props.official = '';
                            popNewMessage('设置成功');
                             // 添加一个绑定应用
                            const appIds = getStore('bindApp');
                            appIds.push(appId);
                            setStore('bindApp',appIds);
                            this.paint();
                            this.goBack(true,e);
                        } else {
                            popNewMessage('设置失败');
                        }
                    });
                } else {
                    popNewMessage('取消官方认证失败');
                }
            });
        });
    }
    // 解除处罚
    public freed() {
        popNew('chat-management-components-confirmBox',{ title:'解除惩罚',invalid:-1 },() => {
            modifyPunishTime(this.props.userInfo.id,this.props.uid,0).then(r => {
                if (r) {
                    popNewMessage('解除处罚成功');
                    this.initData();
                } else {
                    popNewMessage('解除处罚失败');
                }
            });
        });
    }

    // 处理用户
    public deel() {
        const userInfo = {
            id:this.props.userInfo.acc_id,
            name:this.props.userInfo.name,
            sex:this.props.userInfo.sex,
            key:this.props.key
        };
        const punishment = { key:'当前惩罚',value:this.props.userInfo.nowPublish };
        popNew('chat-management-components-reportBox',{ userInfo,punishment },() => {
            this.initData();
        });
    }

}