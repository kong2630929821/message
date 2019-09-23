import { popNew } from '../../../../pi/ui/root';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';
import { buildupImgPath } from '../../../client/app/logic/logic';
import { parseEmoji } from '../../../client/app/view/home/square';
import { EMOJIS_MAP } from '../../../client/app/widget/emoji/emoji';
import { REPORT_PERSON, REPORT_PUBLIC } from '../../../server/data/constant';
import { penaltyText, REPORT, REPORTTITLE, timestampFormat } from '../../utils/logic';
import { rippleShow } from '../../utils/tools';

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
        const key = this.props.data.report_info.key.split('%');
        this.props.state = JSON.parse(key[0]);
        const state = this.props.state;
        const data = this.props.data;
        if (state === 1) {
            // 处理用户
            this.reportUser(state);
        } else if (state === 2) {
            // 处理用户
            this.reportUser(state);
            // 处理嗨嗨号
            this.deelHaiHai();
        } else {
            // 处理内容
            this.reportContent(data,state);
        }
    }

    // 举报内容
    public reportContent(data:any,state:number) {
        // 处理内容
        const reportInfo = JSON.parse(data.report_info.reason);
        let reportInfos = null;
        if (reportInfo.type) {
            reportInfos = JSON.parse(reportInfo.type).join(',');
        } else {
            reportInfos = reportInfo.join(',');
        }
        this.props.deelObj = [
            {
                key:'举报原因',
                value:reportInfos
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
            this.props.likeCount = evidence.likeCount;
            this.props.reply = evidence.commentCount;
        }
        this.props.dynamic = {
            title:state === 4 ? evidence.title  :'',
            msg:state === 5 ? parseManagementEmoji(JSON.parse(evidence.msg).msg) :parseManagementEmoji(JSON.parse(evidence.body).msg),
            imgs:imgs,
            time:timestampFormat(JSON.parse(evidence.createtime))
        };
    
        // 处理被举报用户
        this.deelReported();
        // 处理举报人
        this.deelInformer();
        // 处理嗨嗨号
        if (state === 4) {
            this.deelHaiHai();
        }
    }

    // 举报用户
    public reportUser(state:number) {
        // 处理举报详细图片
        this.deelReportImg(state);
        // 处理被举报用户
        this.deelReported();
         // 处理举报人
        this.deelInformer();
    }

    // 处理被举报人
    public deelReported() {
        const reportPeople = this.props.data.reported_user;
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
    }

    // 处理举报人
    public deelInformer() {
        const haihaiList = this.props.data.report_user;
        const reportPeople = this.props.data.report_user;
        let sex = '';
        if (reportPeople.user_info.sex === 0) {
            sex = '../../res/images/boy.png';
        } else if (reportPeople.user_info.sex === 1) {
            sex = '../../res/images/girl.png';
        } else {
            sex = '';
        }
        this.props.reporterName = [
            { key:'好嗨ID',value:haihaiList.user_info.acc_id },
            { key:'用户昵称',value:haihaiList.user_info.name,fg:sex },
            { key:'手机号',value:haihaiList.user_info.tel ? haihaiList.user_info.tel :'无' },
            { key:'被举报次数总计',value:haihaiList.reported_list.length },
            { key:'被惩罚次数总计',value:haihaiList.punish_history_list.length },
            { key:'举报次数总计',value:haihaiList.report_list.length }
        ];
    }

    // 处理嗨嗨号
    public deelHaiHai() {
        const reportPeople = this.props.data.reported_user;
        const reportPublic = this.props.data.reported_public;
        this.props.haiHaiName = [
                { key:'嗨嗨号ID',value:reportPublic.num },
                { key:'嗨嗨号昵称',value:reportPublic.name,fg:true },
                { key:'手机号',value:reportPeople.user_info.tel ? reportPeople.user_info.tel :'无' },
                { key:'被举报次数总计',value:reportPublic.reported_list.length },
                { key:'被惩罚次数总计',value:reportPublic.punish_history_list.length },
                { key:'当前惩罚',value:reportPeople.punish_list.length ? penaltyText(reportPublic.punish_list,'嗨嗨号') :'无' }
        ];
    }

    // 处理举报图片
    public deelReportImg(state:number) {
        const reportInfo = JSON.parse(this.props.data.report_info.reason);
        let reportInfos = null;
        if (reportInfo.type) {
            reportInfos = JSON.parse(reportInfo.type).join(',');
        } else {
            reportInfos = reportInfo.join(',');
        }
        const imgs = [];
        JSON.parse(reportInfo.img).forEach(v => {
            imgs.push(buildupImgPath(v));
        });
        this.props.deelObj = [
            {
                key:'上传截图',
                value:imgs
            },
            {
                key:'举报原因',
                value:reportInfos
            },
            {
                key:'举报描述',
                value:reportInfo.msg
            }
        ];
        this.props.deelObjName = `处理${REPORTTITLE[REPORT[state]]}`;
    }
    // 点击处理对象
    public deelClick(e:any) {
        if (this.props.state === 1) {
            this.deelClickUser(e);
        } else if (this.props.state === 2) {
            this.deelClickHaiHai(e);
        } else if (this.props.state === 3) {
            popNew('chat-management-components-confirmBox',{ title:'撤回动态',content:'撤回相关内容和评论等',prompt:'发送惩罚通知',id:this.props.data.report_info.id,key:this.props.data.report_info.key },() => {
                notify(e.node,'ev-ok',null);
            });
        } else if (this.props.state === 4) {
            popNew('chat-management-components-confirmBox',{ title:'撤回文章',content:'撤回相关内容和评论等',prompt:'发送惩罚通知',id:this.props.data.report_info.id,key:this.props.data.report_info.key },() => {
                notify(e.node,'ev-ok',null);
            });
        } else {
            popNew('chat-management-components-confirmBox',{ title:'撤回回复',content:'撤回相关内容和评论等',prompt:'发送惩罚通知',id:this.props.data.report_info.id,key:this.props.data.report_info.key },() => {
                notify(e.node,'ev-ok',null);
            });
        }
    }

    // 处理用户
    public deelClickUser(e:any) {
        const data = this.props.data;
        const user = data.reported_user.user_info;
        let sex = '';
        if (user.sex === 0) {
            sex = '../../res/images/boy.png';
        } else if (user.sex === 1) {
            sex = '../../res/images/girl.png';
        } else {
            sex = '';
        }
        const userInfo = {
            id:user.acc_id,
            name:user.name,
            sex,
            report_id:data.report_info.id,
            key:`${REPORT_PERSON}%${user.uid}`,
            isPublic:false,
            uid:user.uid
        };
        popNew('chat-management-components-reportBox',{ userInfo },() => {
            notify(e.node,'ev-ok',null);
        });
    }

    // 处理嗨嗨号
    public deelClickHaiHai(e:any) {
        const data = this.props.data;
        const publicInfo = data.reported_public;
        const userInfo = {
            id:data.reported_public.num,
            name:data.reported_public.name,
            sex:'',
            report_id:data.report_info.id,
            key:`${REPORT_PUBLIC}%${publicInfo.num}`,
            isPublic:true,
            uid:data.reported_user.user_info.uid
        };
        popNew('chat-management-components-reportBox',{ userInfo,state:1 },() => {
            notify(e.node,'ev-ok',null);
        });
    }

    // 投诉不成立
    public invalid(e:any) {
        popNew('chat-management-components-confirmBox',{ title:'投诉不成立',content:'不处理',invalid:true,id:this.props.data.report_info.id },() => {
            notify(e.node,'ev-ok',null);
        });
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
// 转换文字中的链接
const httpHtml = (str:string) => {
    const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|:|#)+)/g;
    
    return str.replace(reg, '<a href="javascript:;" class="linkMsg">$1$2</a>');
};
// 转换表情包
export const parseManagementEmoji = (msg:any) => {    
    msg = httpHtml(msg);
    msg = msg.replace(/\[(\S+?)\]/ig, (match, capture) => {
        const url = EMOJIS_MAP.get(capture) || undefined;
        if (url) {
            return `<img src="../../../chat/client/app/res/emoji/${url}" alt="${capture}" class='emojiMsg'></img>`;
        } else {
            return match;
        }
    });

    return msg;
};