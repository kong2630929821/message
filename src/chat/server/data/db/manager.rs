use message.s::{Report, ReportCount};
use user.s::{UserInfo};
use community.s::{PostKey}
/**
*超级管理员
*/
#[primary=user,db=file,dbMonitor=true]
struct RootUser {
    user: String,
    pwd: String
}

/**
*自动回复消息设置
*/
#[primary=key,db=file,dbMonitor=true]
struct MessageReply {
    key: String,
    msg: String
}

/**
*惩罚
*/
#[primary=id,db=file,dbMonitor=true]
struct Punish {
    id: u32,                   //惩罚id
    punish_type: u32,          //惩罚类型
    start_time: String,        //开始时间
    end_time: String,          //结束时间
    state: u8,                 //状态
}

/**
*累计惩罚
*/
#[primary=key,db=file,dbMonitor=true]
struct PunishCount {
    key: String,               //主键
    now_publish: u32,          //当前惩罚
    punish_history: &[u32],    //历史惩罚
}

/**
*累计惩罚信息
*/
struct PunishData {
    key: String,                  //主键
    now_publish: Punish,          //当前惩罚
    punish_history: &[Punish],    //历史惩罚
}

/**
*请求举报列表参数
*/
struct ReportListArg {
    report_type: u8,          //举报类型
    report_state: u8,         //举报状态
}

/**
*举报首页数据
*/
struct ReportIndex {
    key: String,                //根据举报类型定位到具体的人/公众号/帖子/评论
    user_name: String,          //用户名
    last_resaon: String,        //最近一次举报的原因
    last_user_name: String,     //最近一次举报的用户名
    last_time: String,          //最近一次举报的时间
    report_ids: &[u32],         //举报id列表
    now_publish: Option<Punish>,  //当前惩罚
}

/**
*举报首页数据列表
*/
struct ReportIndexList {
    list: &[ReportIndex]
}

/**
*被举报用户数据
*/
struct UserReportIndex {
    key: String,                //根据举报类型定位到具体的人/公众号/帖子/评论
    id: u32,                    //举报ID
    user_name: String,          //用户名
    reason: String,             //举报原因
    handle_time: String,        //处理时间
    now_publish: Option<Punish>,  //当前惩罚
}

/**
*举报首页数据列表
*/
struct UserReportIndexList {
    list: &[UserReportIndex]
}

/**
*获取举报详情列表参数
*/
struct ReportDetailListArg {
    report_ids: &[u32],      //举报id列表
}

/**
*举报用户信息
*/
struct ReportUserInfo {
    user_info: UserInfo,               //用户信息
    report_list: &[Report],            //举报列表
    reported_list: &[Report],          //被举报列表
    punish_history_list: &[Punish],     //历史被惩罚列表
    punish_list: &[Punish]             //当前惩罚列表
}

/**
*举报公众号信息
*/
struct ReportPublicInfo {
    num: String,                    //社区编号
    name: String,                   //社区名
    owner: u32,                     //所属用户
    reported_list: &[Report],       //被举报列表
    punish_history_list: &[Punish],  //历史被惩罚列表
    punish_list: &[Punish]          //当前惩罚列表
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
    list: &[ReportData]
}

/**
*惩罚参数
*/
struct PunishArg {
    key: String,         //举报对象
    punish_type: u32,    //惩罚类型
    time: Option<u32>,   //惩罚时间
}

/**
*惩罚列表
*/
struct PunishList {
    list: &[Punish],
}

/**
*管理端帖子列表
*/
#[primary=state,db=file,dbMonitor=true]
struct ManagerPostList {
    state: u32,       //状态
    list: &[PostKey]  // 帖子主键列表
}

/**
*获取指定状态的帖子列表参数
*/
struct PostListArg {
    postKey: PostKey,         //开始遍历的帖子主键
    count: u32,               //获取数量
    state: u32,               //帖子状态
}

/**
*公众号文章
*/
struct Article {
    key: PostKey,       //key
    post_type:u8,       //帖子类型图文、语言、视频
    title: String,      //标题
    body: String,       //正文
    owner: u32,         //发送者
    createtime: String,    //创建时间
    state: u8,          //帖子状态
    num: String,         // 社区编号
    name: String,       // 公众号名
    avatar: String,         //头像
}

/**
*指定状态的帖子列表
*/
struct PostList {
    list: &[Article], // 帖子列表
    total: u32,    // 总数
}

/**
*处理待审核文章
*/
struct handleArticleArg {
    postKey: PostKey,         //开始遍历的帖子主键
    result: bool,             //处理结果
    reason: String,           //驳回原因
}

/**
*处理待审核文章结果
*/
#[primary=postKey,db=file,dbMonitor=true]
struct HandleArticleResult {
    postKey: PostKey,         //开始遍历的帖子主键
    result: bool,             //处理结果
    time: String,             //处理时间
    reason: String,           //驳回原因
}

// 公众号待审核表
#[primary=uid,db=file,dbMonitor=true]
struct ApplyPublic{
    id: u32,                  // 申请id
    uid: u32,                 // 用户ID
    num: String,              // 社区编号
    name: String,             // 公众号名
    desc: String,             // 描述
    avatar: String,           // 头像
    state: u32,               // 状态
    time: String,             // 申请时间
    handle_time: String,      // 处理时间
    reason: String,           // 驳回原因
}

// 用户公众号申请历史
#[primary=uid,db=file,dbMonitor=true]
struct UserApplyPublic{
    uid: u32,                 // 用户ID
    list: &[u32]      // 申请记录
}

/**
*待审核公众号申请
*/
struct PublicApplyListArg {
    id: u32,                 // 开始遍历的申请id
    count: u32,              // 获取数量
    state: u32,              //状态
}

/**
*待审核公众号申请详情
*/
struct PublicApplyData {
    user_info: UserInfo,         //用户信息
    apply_info: ApplyPublic,     //当前申请信息
    apply_list: &[ApplyPublic]   //历史申请记录
}

/**
*待审核公众号申请列表
*/
struct PublicApplyList {
    list : &[PublicApplyData], // 申请详情列表
    total : u32,               // 总申请数量
}

/**
*处理公众号申请参数
*/
struct HandleApplyPublicArg {
    id: u32,                   // 申请id
    result : bool,             // 处理结果
    reason: String,            // 驳回原因
}

/**
* 社区信息
*/
struct CommunityDetail {
    num: String,                    // 社区编号
    name: String,                   // 社区名
    desc: String,                   // 描述
    avatar: String,                 // 头像
    comm_type: u8,                  // 类型
    time: String,                   // 创建时间
    attention_list: &[String],      // 关注的社区号列表
    fans_list: &[String],           // 粉丝的社区号列表
    post_list: &[PostKey],          // 帖子key列表
}

/**
* 用户举报和惩罚详情
*/
struct UserReportDetail {
    user_report: ReportUserInfo,                // 用户的举报和惩罚详情
    person_community: CommunityDetail,          // 个人社区详情
    user_public: Option<ReportPublicInfo>,      // 用户公众号的举报和惩罚详情
    public_community: Option<CommunityDetail>,  // 个人社区详情
}

/**
* 惩罚时间调整参数
*/
struct ModifyPunishArg {
    id: u32,             // 惩罚id
    uid: u32,            // 用户id
    rest_time: u32,      // 剩余惩罚时间
}