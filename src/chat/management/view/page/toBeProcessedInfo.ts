import { popNew } from '../../../../pi/ui/root';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';
import { buildupImgPath } from '../../../client/app/logic/logic';
import { penaltyText, REPORT, REPORTTITLE, timestampFormat } from '../../utils/logic';

interface Props {
    data:any;// 处理的数据
    state:number;// 处理的类型
    deelObj:any;// 处理对象
    deelObjName:string;// 处理对象的按钮
    dynamic:any;// 动态文章评论详情
    haiHaiName:any;// 关联的嗨嗨号
    userName:any;// 关联用户
    reporterName:any;// 举报人
    reply:number;// 评论数
    likeCount:number;// 点赞数
}

/**
 * 待处理详情
 */
export class ToBeProcessedInfo extends Widget {
    public props:Props = {
        data:[],
        state:0,
        deelObj:[],
        deelObjName:'',
        dynamic:{
            title:'',
            msg:'',
            imgs:[],
            time:''
        },
        haiHaiName:[],
        userName:[],
        reporterName:[],
        reply:0,
        likeCount:0
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
        const key = this.props.data.reported_content.key.split('%');
        this.props.state = JSON.parse(key[0]);
        const state = this.props.state;
        const data = this.props.data;
        if (state === 1) {
            // 处理用户
        } else if (state === 2) {
            // 处理嗨嗨号
        } else {
            // 处理内容
            this.deelContent(data,state);
        }
    }

    // 处理内容
    public deelContent(data:any,state:number) {
        // 处理内容
        this.props.deelObj = [
            {
                key:'举报原因',
                value:JSON.parse(data.report_info.reason).join(',')
            },
            {
                key:'被举报次数总计',
                value:data.reported_content.reported_count
            }
        ];
        this.props.deelObjName = `处理${REPORTTITLE[REPORT[state]]}`;
        // 文章动态评论内容
        const evidence = JSON.parse(data.report_info.evidence);
        const imgs = [];
        if (state === 5) {
            if (JSON.parse(evidence.msg).img) {
                imgs.push(buildupImgPath(JSON.parse(evidence.msg).img));
            }
            this.props.likeCount = evidence.likeCount;
            this.props.reply = evidence.reply;
        } else {
            JSON.parse(evidence.body).imgs.forEach(v => {
                imgs.push(buildupImgPath(v));
            });
        }
        this.props.dynamic = {
            title:state === 4 ? evidence.title  :'',
            msg:state === 5 ? JSON.parse(evidence.msg).msg :JSON.parse(evidence.body).msg,
            imgs:imgs,
            time:timestampFormat(JSON.parse(evidence.createtime))
        };
    
        // 处理被举报用户
        const reportPeople = data.reported_user;
        let sex = '';
        if (reportPeople.user_info.sex === 0) {
            sex = '../../res/images/boy.png';
        } else if (reportPeople.user_info.sex === 1) {
            sex = '../../res/images/girl.png';
        } else {
            sex = '';
        }
        this.props.userName = [
            { key:'好嗨ID',value:reportPeople.user_info.acc_id },
            { key:'用户昵称',value:reportPeople.user_info.name,fg:sex },
            { key:'手机号',value:reportPeople.user_info.tel ? reportPeople.user_info.tel :'无' },
            { key:'被举报次数总计',value:reportPeople.reported_list.length },
            { key:'被惩罚次数总计',value:reportPeople.punish_history_list.length },
            { key:'举报次数总计',value:reportPeople.report_list.length },
            { key:'当前惩罚',value:reportPeople.punish_list.length ? penaltyText(reportPeople.punish_list,'用户') :'无' }
        ];

        // 处理举报人
        const haihaiList = data.report_user;
        this.props.reporterName = [
            { key:'好嗨ID',value:haihaiList.user_info.acc_id },
            { key:'用户昵称',value:haihaiList.user_info.name,fg:sex },
            { key:'手机号',value:haihaiList.user_info.tel ? haihaiList.user_info.tel :'无' },
            { key:'被举报次数总计',value:haihaiList.reported_list.length },
            { key:'被惩罚次数总计',value:haihaiList.punish_history_list.length },
            { key:'举报次数总计',value:haihaiList.report_list.length }
        ];
    }
    // 点击处理
    public deelClick() {
        // popNew('chat-management-components-reportBox');
        // popNew('chat-management-components-confirmBox');
    }

    // 返回
    public exit(e:any) {
        notify(e.node,'ev-exit',null);
    }
}