#[path=../db/]
use user.s::{UserInfo, FriendLink};
#[path=../db/]
use group.s::{GroupInfo, GroupUserLink};
#[path=../db/]
use message.s::{GroupHistory, UserHistory, AnnounceHistory};

struct RSBoolean{
    b:bool
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
    arr:&[UserInfo]
}

struct GroupArray{
    arr:&[GroupInfo]
}

struct FriendLinkArray{
    arr:&[FriendLink]
}

struct GroupUserLinkArray{
    arr:&[GroupUserLink]
}

struct GroupHistoryArray{
    arr:&[GroupHistory]
}

struct UserHistoryArray{
    arr:&[UserHistory]
}

struct AnnounceHistoryArray{
    arr:&[AnnounceHistory]
}