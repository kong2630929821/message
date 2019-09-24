/**
 * 本地方法
 */
import { popNew } from '../../../pi/ui/root';

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
    REPORT_PERSON= '用户',
    REPORT_PUBLIC= '嗨嗨号',
    REPORT_POST= '动态',
    REPORT_ARTICLE= '文章',
    REPORT_COMMENT= '评论'
}
// 处理举报数据列表
export const deelReportList = (r:any) => {
    if (r.total === 0) {
        return r;
    }
    const list = r.list;
    const showDataList = [[],[],[],[],[],[]];
    const dataList = [[],[],[],[],[],[]];
    list.forEach((v,i) => {
        const key = v.report_info.key.split('%');
        const reportInfo = JSON.parse(v.report_info.reason);
        let reportInfos = null;
        if (reportInfo.type) {
            reportInfos = JSON.parse(reportInfo.type).join(',');
        } else {
            reportInfos = reportInfo.join(',');
        }
        const reportTime = timestampFormat(JSON.parse(v.report_info.time));
        const reportPeople = v.report_user.user_info.name;
        let count = 0;
        if (v.reported_content) {
            count = v.reported_content.reported_count;
        } else if (v.reported_public) {
            count = v.reported_public.reported_list.length;
        } else {
            count = v.reported_user.reported_list.length;
        }
        const data = [v.reported_user.user_info.name,REPORTTITLE[REPORT[key[0]]],reportInfos,count,reportTime,reportPeople];
        showDataList[0].push(data);
        showDataList[key[0]].push(data); 
        dataList[0].push(v);
        dataList[key[0]].push(v);
    });
    r.showDataList = showDataList;
    r.list = dataList;

    return r;
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
    FREEZE= '冻结'
}
// 处理处罚文字
export const penaltyText = (res:any,str:string) => {
    const data = [];
    res.forEach(r => {
        const penType = PENALTYTEXT[PENALTY[r.punish_type]];
        const lastTime = (JSON.parse(r.end_time) - Date.now()) / 1000 / 60 / 60;
        const time = (JSON.parse(r.end_time) - JSON.parse(r.start_time)) / (60 * 60 * 1000);
        data.push(`${penType}${str}${time}小时 （剩余${lastTime.toFixed(2)}小时）`);
    });
    
    return data.join(',');
};