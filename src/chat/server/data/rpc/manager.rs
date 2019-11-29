#[path=../db/]
use user.s::{UserInfo};
#[path=../db/]
use manager.s::{RootUser, Punish};

// 管理端用户列表
struct MgrUserList {
    list: &[RootUser],
}

// 官方账号列表
struct OfficialUserInfo {
    app_id: String,
    user_info: UserInfo,
    create_time: String, //注册时间
    now_publish: &[Punish], //当前惩罚
}
struct OfficialAccList {
    list: &[OfficialUserInfo]
}

// 添加应用
struct AddAppArg {
    appid: String,      // 应用ID
    name: String,       // 应用名
    imgs: String,       // 图片路径
    desc: String,       // 描述
    url: String,        // 地址
    pk: String,         // 公钥
    mch_id: String,     // 商户ID
    notify_url: String, // 回调地址
}

// 编辑应用推荐
struct SetAppConfig {
    cfg_type: u8,
    appids: String,     // 应用ID列表 "[\"1\", \"2\"]"
}

// 获取指定类型的文章
struct GetpostTypeArg {
    count: u32,     //获取数量
    id: u32,       //指定key进行遍历
    num: String,    // 社区编号
    post_type: u32, //帖子类型
}

