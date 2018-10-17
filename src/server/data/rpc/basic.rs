#[path=../data/]
use user.s::{UserInfo}; 

#[path=../data/]
use user.s::{FriendLink}; 

#[path=../data/]
use group.s::{GroupInfo}; 

#[path=../data/]
use message.s::{GroupHistory}; 

#[path=../data/]
use message.s::{UserHistory}; 

#[path=../data/]
use message.s::{AnnounceHistory}; 

#[path=../data/]
use group.s::{GroupUserLink}; 


struct Result{
    r:u32//1代表成功，其他值都有特殊意义，需要后端提供一个映射表
}

enum ORDER {
    INC = 0,//顺序
    DEC = 1//逆序
}

struct MessageFragment{
    hid:usize,//历史记录id
    from:u32,//开始条数,-1代表最近一条
    order:ORDER,//顺序还是逆序,一般是逆序
    size:u32//总共取多少条
}

struct AnnouceFragment{
    aid:usize,//公告id
    from:u32,//开始条数,-1代表最近一条
    order:ORDER,//顺序还是逆序,一般是逆序
    size:u32//总共取多少条
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