/**
*群组信息
*/

/**
*群组状态
*/
enum GROUP_STATE {
    CREATED = 0,//已创建
    DISSOLVE = 1,//已解散
}

/**
*入群方式
*/
enum JOIN_METHOD {
    USER_APPLY = 0,//用户主动申请
    MEMBER_INVITE = 1,//群成员邀请
}

/**
*群组中的用户id
*/
struct Guid {
    gid: u32,
    uid: u32,
}

/**
*群组信息
*/
#[primary=gid,db=file,dbMonitor=true,hasmgr=false]
struct GroupInfo {
    gid:u32,//群组id,全局唯一,-1代表不存在
    ownerid:u32,//群主id
    adminids:&[u32],//管理员id
    memberids:&[u32],//成员id
    annoceid:usize,//公告id
    create_time:u32,//创建时间
    dissolve_time:u32,//解散时间
    join_method:JOIN_METHOD,//加入方式
    note:String,//群描述
    state:GROUP_STATE,//当前状态
}

/**
*群组中的用户信息
*/
#[primary=guid,db=file,dbMonitor=true]
struct GroupUserLink {
    guid:Guid,//用户在当前群组的唯一id,{gid:-1, uid:-1}代表不存在
    groupAlias:String,//群在该用户账号上的别名
    userAlias:String,//该用户在群里的别名
    hid:usize,//群历史记录id
    join_time: u32,//加入时间
}