/**
 * 本地方法
 */
import { uploadFileUrlPrefix } from '../../../app/public/config';
import { popNew } from '../../../pi/ui/root';
import { buildupImgPath } from '../../client/app/logic/logic';
import { EMOJIS_MAP } from '../../client/app/widget1/emoji/emoji';

/**
 * 弹窗提示
 * @param content mess
 * @param itype success | warn | error | notice
 */
export const popNewMessage = (content:string, itype:string = 'success') => {
    popNew('chat-management-components-message', { itype, content, center: true });
};

/**
 * 时间戳格式化 毫秒为单位
 * timeType 1 返回时分， 2 返回月日， 3 返回月日时分， 4 返回月日时分 
 */ 
export const timestampFormat = (timestamp: number,timeType?: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    if (timeType === 1) {
        return `${hour}:${minutes}`;
    }
    if (timeType === 2) {
        return `${month}月${day}日`;
    }
    if (timeType === 3) {
        return `${month}月${day}日 ${hour}:${minutes}`;
    }
    if (timeType === 4) {
        return `${month}-${day} ${hour}:${minutes}`;
    }

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

/**
 * unicode转string
 */
export const unicode2Str = (infos:any) => {
    if (typeof infos !== 'object') return infos;
    let str = '';
    for (const v of infos) {
        str += String.fromCharCode(v);
    }

    return str;
};

// 价格格式化
export const priceFormat = (price:number) => {
    return (price / 100).toFixed(2);
};

/**
 * 时间控件的本地方法
 */
// 从某一天往前或往后加几天
// day可以为负数
const oneDay = 86400000; // 一天有多少毫秒
export const parseDate = (time:string,day:number,fg?:number) => {
    const timestamp = Date.parse(time) + day * oneDay;
    
    return dateToString(timestamp,fg);
};
// 将时间戳转换为字符串时间 
// fg为0或不传 返回日期'2019-01-01'
// fg为1 返回完整的时间'2019-01-01 10:00:00' 
// fg为2 不返回秒
export const dateToString = (timestamp:number,fg?:number) => {
    const virtualDate = new Date(timestamp);
    const year = virtualDate.getFullYear();
    const month = virtualDate.getMonth() + 1;
    const date = virtualDate.getDate();
    const hour = virtualDate.getHours();
    const minute = virtualDate.getMinutes();
    const second = virtualDate.getSeconds();

    const showYear = year >= 10 ? year :`0${year}` ;
    const showMonth = month >= 10 ? month :`0${month}`;
    const showDate = date >= 10 ? date :`0${date}`; 
    const showHour = hour >= 10 ? hour :`0${hour}`;
    const showminute = minute >= 10 ? minute :`0${minute}`;
    const showsecond = second >= 10 ? second :`0${second}`;
    if (fg === 1) {
        return `${showYear}-${showMonth}-${showDate} ${showHour}:${showminute}:${showsecond}`;
    } else if (fg === 2) {
        return `${showYear}-${showMonth}-${showDate} ${showHour}:${showminute}`;
    }
    
    return `${showYear}-${showMonth}-${showDate}`;
};
// 两个日期之间相差多少天
export const subtractDate = (time1:string,time2:string) => {
    return Math.abs(Date.parse(time2) - Date.parse(time1)) / oneDay;
};

// 判断两个日期的大小
export const compareDate = (time1:string,time2:string) => {
    return Date.parse(time1) > Date.parse(time2);
};
// 时间戳转标准日期
export const timeConvert = (time:any) => {
    const date = new Date(time);
    const year = date.getFullYear().toString().concat('-');
    const month = (date.getMonth() + 1 < 10 ? '0'.concat((date.getMonth() + 1).toString()) : date.getMonth() + 1).toString().concat('-');
    const day = (date.getDate() < 10 ? '0'.concat(date.getDate().toString()) : date.getDate()).toString().concat(' ');
    const hour = (date.getHours() < 10 ? '0'.concat(date.getHours().toString()) : date.getHours()).toString().concat(':');
    const minute = (date.getMinutes() < 10 ? '0'.concat(date.getMinutes().toString()) : date.getMinutes()).toString().concat(':');
    const second = (date.getSeconds() < 10 ? '0'.concat(date.getSeconds().toString()) : date.getSeconds()).toString();

    const showTime = year + month + day + hour + minute + second;
    console.log(showTime);

    return showTime;
};
// 标准日期转时间戳
export const transitTimeStamp = (time:any) => {
    let startTime = time.substring(0,19);    
    startTime = startTime.replace(/-/g,'/'); 

    return new Date(startTime).getTime();
};

/**
 * 将Unicode字符串转成可读字符串
 */
export const unicode2ReadStr = (item:any) => {
    try {
        if (item && typeof(item) === 'string') {
            return unicode2Str(JSON.parse(item));
        }
    
        return unicode2Str(item);
        
    } catch (e) {
        return item;
    }
    
};

export enum REPORT {
    REPORT_PERSON= 1,
    REPORT_PUBLIC,
    REPORT_POST,
    REPORT_ARTICLE,
    REPORT_COMMENT= 5
}
export enum REPORTTITLE {
    REPORT_PERSON= '玩家',
    REPORT_PUBLIC= '嗨嗨号',
    REPORT_POST= '动态',
    REPORT_ARTICLE= '文章',
    REPORT_COMMENT= '评论'
}
// 处理举报数据列表
export const deelReportList = (r:any,report_type:number) => {
    const list = r.list;
    if (list.length === 0) {
        return [[],[],[]];
    }
    const dataList = [];// 表格数据
    const idList = [];// 详情ID
    const processResult = [];// 处理结果
    list.forEach((v,i) => {
        const reportType = JSON.parse(JSON.parse(v.last_resaon).type).join(',');
        processResult.push((v.now_publish ? penaltyText([v.now_publish],'用户') :'不惩罚').split(' ')[0]);
        dataList.push([
            v.user_name, // 被举报人
            REPORTTITLE[REPORT[report_type]],// 举报类型
            reportType,// 举报原因
            v.report_ids.length,// 举报次数
            timestampFormat(JSON.parse(v.last_time)),// 举报时间
            v.last_user_name// 举报人
        ]);
        idList.push(v.report_ids);
    });
   
    return [dataList,idList,processResult];
};

export const deelReportListInfo = (r:any,state:number) => {
    const list = r.list;
    if (list.length === 0) {
        return [[],[]];
    }
    let userInfo = [];// 被举报人信息
    let dynamic = {};// 动态信息
    const reportInfo = [];// 举报信息
    const key = list[0].report_info.key;// 处罚的KEY
    let id = null;// 重置处罚
    if (state === 0) {
        // 被举报人信息处理
        userInfo = (deelReportedUser(list[0].reported_user));
        list.forEach(v => {
        // 处理举报信息
            reportInfo.push(deelUserReportInfo(v.report_info,v.report_user));
        });
        id = `${list[0].reported_user.punish_list.length ? list[0].reported_user.punish_list[0].id :0}%${list[0].reported_user.user_info.uid}`;
        
    } else if (state === 1) {
        dynamic = deelDynamic(list[0].report_info,list.length)[0];
        userInfo = (deelReportedUser(list[0].reported_user));
        list.forEach(v => {
            // 处理举报信息
            reportInfo.push(deelDynamicReport(v.report_info,v.report_user));
        });
        id = `${JSON.parse(list[0].report_info.evidence).state === 1 ? 0 :JSON.parse(list[0].report_info.evidence).state}%${JSON.stringify(JSON.parse(list[0].report_info.evidence).key)}`;
    }

    return [dynamic,userInfo,reportInfo,key,id];
};

export const deelDynamicReport = (reportInfo:any,reportedUser:any) => {
    const userPhone = reportedUser.user_info.tel ? reportedUser.user_info.tel :'无';
    const reason  = JSON.parse(reportInfo.reason);
    let origin = null;
    if (reason.type) {
        origin = JSON.parse(reason.type).join(',');
    } else {
        origin = reason.join(',');
    }
    let sex = '';
    if (reportedUser.user_info.sex === 0) {
        sex = 'chat/management/res/images/girl.png';
    } else if (reportedUser.user_info.sex === 1) {
        sex = 'chat/management/res/images/boy.png';
    } else {
        sex = 'chat/management/res/images/neutral.png';
    }

    return [
        { key:'好嗨ID',value:reportedUser.user_info.acc_id },
        { key:'用户昵称',value:reportedUser.user_info.name,fg:sex },
        { key:'手机号',value:userPhone },
        { key:'举报时间',value:timestampFormat(JSON.parse(reportInfo.time)) },
        { key:'举报原因',value:origin },
        { key:'被举报次数总计',value:reportedUser.reported_list.length },
        { key:'举报次数总计',value:reportedUser.report_list.length }
    ];
};

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

/**
 * 处理用户头像 
 */
export const getUserAvatar = (avatar:string) => {
    if (avatar && avatar.indexOf('data:image') < 0) {
        if (avatar.slice(0,4) === 'http') {
            avatar = avatar;   
        } else {
            avatar = `${uploadFileUrlPrefix}${avatar}`;
        }
            
    } else {
        avatar = 'app/res/image/default_avater_big.png';
    }

    return avatar;
};

// 处理动态数据
const deelDynamic = (reportInfo:any,count:number) => {
    const evidence = JSON.parse(reportInfo.evidence);
    const like = evidence.likeCount;// 点赞数
    const commentCount = evidence.commentCount;// 评论数
    const time = timestampFormat(evidence.createtime);// 发布时间
    const avatar = getUserAvatar(evidence.avatar);// 用户头像
    const userName = evidence.username;// 用户名
    const body = JSON.parse(evidence.body);
    const img = [];
    body.imgs.forEach(v => {
        img.push(buildupImgPath(v.originalImg));
    });

    return [
        {
            avatar,
            name:userName,
            like,
            commentCount,
            time,
            count,
            msg:parseManagementEmoji(body.msg),
            imgs:img
        }
    ];

};

// 被举报人信息处理
const deelReportedUser = (reportedUser:any) => {
    const userPhone = reportedUser.user_info.tel ? reportedUser.user_info.tel :'无';
    const gruel = reportedUser.punish_list.length ? penaltyText(reportedUser.punish_list,'用户') :'无';
    let sex = '';
    if (reportedUser.user_info.sex === 0) {
        sex = 'chat/management/res/images/girl.png';
    } else if (reportedUser.user_info.sex === 1) {
        sex = 'chat/management/res/images/boy.png';
    } else {
        sex = 'chat/management/res/images/neutral.png';
    }

    return [
        { key:'好嗨ID',value:reportedUser.user_info.acc_id },
        { key:'用户昵称',value:reportedUser.user_info.name,fg:sex },
        { key:'手机号',value:userPhone },
        { key:'被举报次数总计',value:reportedUser.reported_list.length },
        { key:'被惩罚次数总计',value:reportedUser.punish_history_list.length },
        { key:'举报次数总计',value:reportedUser.report_list.length },
        { key:'当前惩罚',value:gruel }
    ];
};

/**
 * 处理用户举报信息
 * @param reportInfo 举报信息
 * @param reportUser 举报人信息
 */
const deelUserReportInfo = (reportInfo:any,reportUser:any) => {
    const reason  = JSON.parse(reportInfo.reason);
    const imgList = JSON.parse(reason.img);
    const msg = reason.msg ? reason.msg :'无';
    let origin = null;
    const img = [];
    if (reason.type) {
        origin = JSON.parse(reason.type).join(',');
    } else {
        origin = reason.join(',');
    }
    imgList.forEach(v => {
        img.push(buildupImgPath(v));
    });
    let time = null;// 举报时间
    reportUser.report_list.forEach(v => {
        if (reportInfo.id === v.id) {
            time = timestampFormat(JSON.parse(v.time));
        }
    });
    let sex = '';
    if (reportUser.user_info.sex === 0) {
        sex = 'chat/management/res/images/girl.png';
    } else if (reportUser.user_info.sex === 1) {
        sex = 'chat/management/res/images/boy.png';
    } else {
        sex = 'chat/management/res/images/neutral.png';
    }
    const userInfo = [
        { key:'好嗨ID',value:reportUser.user_info.acc_id },
        { key:'用户昵称',value:reportUser.user_info.name,fg:sex },
        { key:'手机号',value:reportUser.user_info.tel ? reportUser.user_info.tel :'无' },
        { key:'举报时间',value:time },
        { key:'被举报次数总计',value:reportUser.reported_list.length },
        { key:'被惩罚次数总计',value:reportUser.punish_history_list.length },
        { key:'举报次数总计',value: reportUser.report_list.length }
    ];

    return [
        {
            key:'上传截图',
            value:img
        },
        {
            key:'举报原因',
            value:origin
        },
        {
            key:'举报描述',
            value:msg
        },
        {
            key:'举报人',
            value:userInfo
        }
    ];
};
export enum PENALTY {
    DELETE_CONTENT= 1,
    BAN_MESAAGE,
    BAN_POST,
    FREEZE= 4
}
export enum PENALTYTEXT {
    DELETE_CONTENT= '删除内容',
    BAN_MESAAGE= '禁言',
    BAN_POST= '禁止发动态',
    FREEZE= '禁言'
}
// 处理处罚文字
export const penaltyText = (res:any,str:string) => {
    const data = [];
    res.forEach(r => {
        const penType = PENALTYTEXT[PENALTY[r.punish_type]];
        const lastTime = (JSON.parse(r.end_time) - Date.now()) / 1000 / 60 / 60;
        const time = (JSON.parse(r.end_time) - JSON.parse(r.start_time)) / (60 * 60 * 1000);
        if (r.punish_type === PENALTY.DELETE_CONTENT) {
            data.push(`${penType}`);
        } else {
            data.push(`${penType}${str}${time}小时 （剩余${lastTime.toFixed(2)}小时）`);
        }
       
    });
    
    return data.join(',');
};