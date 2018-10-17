/**
*聊天信息表
*/


/**
*消息类型
*/
enum MSG_TYPE {
    TXT = 1,//文本
    IMG = 2,//图片
    VOICE = 3,//声音
    TXT_IMG = 4,//文本和图片
}

/**
* 用户消息
*/
struct UserMsg {
    sid: u32,//发信人id
    mtype: MSG_TYPE,
    msg: String,//内容
    time: u32,//时间
    send: bool,//是否发送
    read: bool,//是否已读
    cancel: bool,//是否撤回
}

/*
*群组消息
*/
struct GroupMsg {
    sid: u32,//发信人id
    mtype: MSG_TYPE,
    msg: String,//内容
    time: u32,//时间
    send: bool,//是否发送
    cancel: bool,//是否撤回
}

/**
*群组公告
*/
struct Announcement {
    sid: u32,//发布者id
    mtype: MSG_TYPE,
    msg: String,//内容
    time: u32,//时间
    send: bool,//是否发送
    cancel: bool,//是否撤销
}

/**
*用来标识每一条聊天记录
*/
struct HIncId {
    hid: usize,
    index: u32,
}

/**
*用来标识每一条公告
*/
struct AIncId {
    aid: usize,
    index:u32,
}

/**
*用户历史记录
*/
#[primary=hIncid,db=file,dbMonitor=true]
struct UserHistory {
    hIncid: HIncId,
    msg: UserMsg,
}


/**
*群组历史记录
*/
#[primary=hIncid,db=file,dbMonitor=true]
struct GroupHistory {
    hIncid: HIncId,
    msg: GroupMsg,
}

/**
*所有公告
*/
#[primary=aIncId,db=file,dbMonitor=true]
struct AnnounceHistory {
    aIncId: AIncId,
    announce: Announcement,
}

/**
*消息锁,用于消息和公告
*/
#[primary=hid,db=file,dbMonitor=true]
struct MsgLock {
    hid: usize,//历史记录id
    current: u32,//当前消息锁编号
}