/**
*群组信息
*/

/**
*群组链接信息
*/
#[primary=gid,,db=file,dbMonitor=true]
struct GroupLink{
    gid:u32,//群组id,全局唯一
    alias：String,//群组别名
    hid:u64,//历史记录id
}

/**
*群组状态
*/
enum GROUP_STATE {
    CREATED = 0,//已创建
    DISSOLVE = 1//已解散
}

/**
*入群方式
*/
enum JOIN_METHOD{
    USER_APPLY = 0,//用户主动申请
    MEMBER_INVITE = 1//群成员邀请
}

/**
*群组信息
*/
#[primary=gid,db=file,dbMonitor=true]
struct Group {
    gid:u32,//群组id,全局唯一
    ownerid:u32,//群主id
    adminids:&[u32],//管理员id
    memberids:&[u32],//成员id
    aids:&[u32],//公告id
    create_time:u32,//创建时间
    dissolve_time:u32,//解散时间
    join_method:JOIN_METHOD,//加入方式
    state:GROUP_STATE//当前状态
}

#[primary=guid,db=file,dbMonitor=true]
struct GroupUserLink {
    guid:u64,//用户在当前群组的唯一id,全局唯一
    alias:String,//别名
    join_time：u32//加入时间
}