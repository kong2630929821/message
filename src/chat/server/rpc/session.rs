//自动登录
struct AutoLogin {
    uid: String,
    token: String,
}

//自动登录返回
struct AutoLoginResult {
    code: u32,
}

//获取TOKEN
struct GetToken {
    uid: String,
}

//获取TOKEN
struct Token {
    code: u32,
    token: String,
}
