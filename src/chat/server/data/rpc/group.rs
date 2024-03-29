#[path=../db/]
use group.s::{GroupInfo};

struct MemberIdArray{
    arr:&[u32]//用户id数组
}

struct GroupCreate{
    name:String,
    note:String,
    avatar:String,
    need_agree:bool,       // 入群是否需要被同意
    level: Option<u8>,     // 指定群等级，但不可高于用户等级，默认群等级等于用户等级
}

struct GroupAgree{
    gid:u32,//群组id
    uid:u32,//用户id
    agree:bool//是否同意
}

struct Invite{
    gid:u32,//群组
    rid:u32//接受邀请方
}
/**
*邀请入群方式
*/
enum INVITE_TYPE {
    normal=0,//普通邀请，需要同意
    game=1,//游戏邀请，不需要同意
}
struct InviteArray{
    arr:&[Invite],//被邀请的用户数组
}

struct NotifyAdmin {
    uid: u32
}

struct GroupMembers {
    members: &[u32]
}

struct GuidsAdminArray{
    guids:&[String]//被添加的管理员数组
}

struct NewGroup{
    gid:u32,
    name:String,
    avatar:String,
    note:String
}

struct NeedAgree {
    gid: u32, // 群组id
    need_agree: bool // 进群是否需要验证
}

// 群信息列表
struct GroupInfoList {
    list: &[GroupInfo]
}