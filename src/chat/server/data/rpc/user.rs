struct UserAgree{
    uid:u32,//被同意方
    agree:bool//是否同意
}
struct FriendAlias{
    rid:u32,
    alias:String
}
struct SetOfficial{
    accId:String,
    appId:String
}

// 修改用户信息
struct UserChangeInfo{
    name: String,        //用户自己设置的用户名
    avatar: String,      //头像
    sex: u32,            //性别
    tel: String,         //电话
    note: String,        //用户自己的备注信息
    wallet_addr: String, //钱包地址
    acc_id:String,        // 钱包账户ID
}