#[path=../db/]
use user.s::{UserInfo};
use manager.s::{RootUser};

// 管理端用户列表
struct MgrUserList {
    list: &[RootUser],
}

// 官方账号列表
struct OfficialUserInfo {
    app_id: String,
    user_info: UserInfo,
    create_time: String, //注册时间
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

