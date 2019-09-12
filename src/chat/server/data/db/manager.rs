use message.s::{Report, ReportCount};
use user.s::{UserInfo};
/**
*超级管理员
*/
#[primary=user,db=file,dbMonitor=true]
struct RootUser {
    user: String,
    pwd: String
}

/**
*惩罚
*/
#[primary=id,db=file,dbMonitor=true]
struct Punish {
    id: u32,                   //惩罚id
    punish_type: u32,          //惩罚类型
    time: String,              //时间
    report_id: u32,            //举报id
    state: u8,                 //状态
}

/**
*累计惩罚
*/
#[primary=key,db=file,dbMonitor=true]
struct PunishCount {
    key: String,               //主键
    punish_list: &[u32],       //当前惩罚
    punish_history: &[u32],    //历史惩罚
}

/**
*累计惩罚信息
*/
struct PunishData {
    key: String,                  //主键
    punish_list: &[Punish],       //当前惩罚
    punish_history: &[Punish],    //历史惩罚
}

/**
*请求举报列表参数
*/
struct ReportListArg {
    id: u32,        //开始遍历的id
    count: u32,     //获取数量
    state: u8 ,     //状态
}

/**
*举报用户信息
*/
struct ReportUserInfo {
    user_info: UserInfo,         //用户信息
    report_count: u32,           //举报次数
    reported_count: u32,         //被举报次数
    punish_count: u32,           //被惩罚次数
    punish_list: &[Punish]       //当前惩罚列表
}

/**
*举报公众号信息
*/
struct ReportPublicInfo {
    num: String,                 //社区编号
    name: String,                //社区名
    owner: u32,                  //所属用户
    reported_count: u32,         //被举报次数
    punish_count: u32,           //被惩罚次数
    punish_list: &[Punish]       //当前惩罚列表
}

/**
*举报内容
*/
struct ReportContentInfo {
    key: String,                 //帖子或评论主键
    reported_count: u32,         //被举报次数
}

/**
*举报数据
*/
struct ReportData {
    report_info: Report,   //举报详情
    report_user: ReportUserInfo, //举报人用户信息
    reported_user: ReportUserInfo, //被举报人用户信息
    reported_public: Option<ReportPublicInfo>, //被举报公众号信息
    reported_content: Option<ReportContentInfo>, //被举报内容信息
}

/**
*举报列表
*/
struct ReportList {
    list: &[ReportData],
}