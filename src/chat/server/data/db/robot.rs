use community.s::{PostKey};
/**
 * 虚拟用户id索引
 */
#[primary=rid,db=file,dbMonitor=true]
struct RobotIndex {
    rid: u32, // 虚拟用户id
    uid: u32, // 用户id
    wuid: String, //微博用户id
}

/**
 * 微博数据
 */
#[primary=wid,db=file,dbMonitor=true]
struct WeiboInfo {
    wid: String , //微博id
    rid: u32, // 虚拟用户id
    content: String , // 微博内容
    imgs: &[String],  // 图片
    time: String , // 发布时间
    publish_tool: String , //发布工具
    flag: String , // 状态
}

/**
 * 虚拟用户信息
 */
struct RobotUserInfo {
    weibo_id: String, // 微博id
    name: String, // 名字
    avatar: String , //头像
    sex: u8,  //性别
}

/**
 * 添加虚拟用户
 */
struct AddRobotArg {
    list: &[RobotUserInfo]
}

/**
 * 虚拟用户微博索引
 */
#[primary=rid,db=file,dbMonitor=true]
struct UserWeiboInfo {
    rid: u32, // 虚拟用户id
    weibo_list: &[String],  // 微博id
}

/**
 * 虚拟用户活动开关
 */
#[primary=name,db=file,dbMonitor=true]
struct RobotActiveSwitch {
    name: String,           //活动名称
    state: u8 ,          //状态
}

/**
 * 通用评论表
 */
#[primary=msg,db=file,dbMonitor=true]
struct CommonComment {
    msg: String , // 评论内容
    weight: u32, //权重
}

/**
 * 帖子下虚拟用户数量
 */
#[primary=post_key,db=file,dbMonitor=true]
struct PostRobotNum {
    post_key: PostKey , // 帖子主键
    laud_count: u32,    // 虚拟用户点赞数量
    comment_count: u32, // 虚拟用户评论数量
}

/**
 * 通用评论列表
 */
struct CommonCommentList {
    list: &[CommonComment]
}

/**
 * 机器人行为设置
 */
#[primary=active,db=file,dbMonitor=true]
struct RobotActiveSet {
    active: String ,        // 机器人活动类型
    min_time: u32 ,         // 最小时间间隔
    max_time: u32 ,         // 最大时间间隔
    weight: u32 ,           // 权重
    post_user_limit: u32 ,  // 单个帖子机器人上限
    daily_limit: u32 ,      // 每天限制数量
}

/**
 * 每天虚拟用户行为统计
 */
#[primary=key,db=file,dbMonitor=true]
struct DailyRobotCount {
    key: String ,   // 主键 拼接天数和行为类型 如'23135:robot_comment'
    count: u32 ,    // 数量
}