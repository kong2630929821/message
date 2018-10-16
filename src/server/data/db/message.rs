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
    type: MSG_TYPE,
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
    type: MSG_TYPE,
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
    type: MSG_TYPE,
    msg: String,//内容
    time: u32,//时间
    send: bool,//是否发送
    cancel: bool,//是否撤销
}


/**
*用户历史记录
*/
#[primary=hid,db=file,dbMonitor=true]
struct UserHistory {
    hid: usize,//历史记录id全局唯一,使用底层接口
    msg: &[UserMsg],
}


/**
*群组历史记录
*/
#[primary=hid,db=file,dbMonitor=true]
struct GroupHistory {
    hid: u64,//历史记录id全局唯一
    msg: &[GroupMsg],
}


#[primary=hid,db=file,dbMonitor=true]
struct AnnounceHistory {
    aid: u32,//历史记录id全局唯一
    announce: &[Announcement],
}

/**
*消息锁
*/
#[primary=hid,db=file,dbMonitor=true]
struct MsgLock {
    hid: u64,//历史记录id
    current: u32,//当前消息锁编号
}