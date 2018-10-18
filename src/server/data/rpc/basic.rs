#[path=../db/]
use user.s::{UserInfo, FriendLink};
#[path=../db/]
use group.s::{GroupInfo, GroupUserLink};
#[path=../db/]
use message.s::{GroupHistory, UserHistory, AnnounceHistory};

struct Result{
    r:u32//1代表成功，其他值都有特殊意义，需要后端提供一个映射表
}

struct UserRegister{
    name:String,
    passwdHash:String,
}

struct UserInfoSet {
    name: String,//用户自己设置的用户名
    avator: String,//头像
    sex: SEXY,//性别
    tel: String,//电话
    note: String,//用户自己的备注信息
}

enum ORDER {
    INC = 0,//顺序
    DEC = 1,//逆序
}

struct MessageFragment{
    hid:usize,//历史记录id
    from:u32,//开始条数,-1代表最近一条
    order:ORDER,//顺序还是逆序,一般是逆序
    size:u32,//总共取多少条
}

struct AnnouceFragment{
    aid:usize,//公告id
    from:u32,//开始条数,-1代表最近一条
    order:ORDER,//顺序还是逆序,一般是逆序
    size:u32,//总共取多少条
}

struct UserArray{
    arr:&[UserInfo]//用户信息表
}

struct GroupArray{
    arr:&[GroupInfo]//群组信息表
}

struct FriendLinkArray{
    arr:&[FriendLink]//好友链接表
}

struct GroupUserLinkArray{
    arr:&[GroupUserLink]//群组链接表
}

struct GroupHistoryArray{
    arr:&[GroupHistory]//群组历史记录表
}

struct UserHistoryArray{
    arr:&[UserHistory]//用户历史记录表
}

struct AnnounceHistoryArray{
    arr:&[AnnounceHistory]//公告表
}