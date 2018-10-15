/**
 * 用户信息表
 */

/**
*性别
*/
enum SEXY{
    FAMALE = 0,//女性
    MALE = 1//男性
}


/**
*用户本人的基本信息
*/
#[primary=uid,,db=file,dbMonitor=true]
struct User {
    uid: u32,//用户id
    name:String,//用户自己设置的用户名
    avator:String,//头像
    sex:SEXY,//性别
    tel: String,//电话
    note: String//用户自己的备注信息
}

/**
*好友链接信息
*/
#[primary=uid,,db=file,dbMonitor=true]
struct FriendLink {
    uid:u32,//用户id
    alias:String,//别名    
    hid:u64,//历史记录id
}

/**
*联系人信息
*/
#[primary=uid,,db=file,dbMonitor=true]
struct Contact {
    uid:u32,//用户id
    friends:&[FriendLink],//好友
    temp_chat:&[FriendLink],//临时会话
    group:&[GroupLink]//群组
}


