#[path=../db/,enumc=MSG_TYPE]
use message.s::{MSG_TYPE};

struct AnnounceSend {
    gid: u32,//组id
    mtype: MSG_TYPE,
    msg: String,//内容
    time: usize,//时间
}

struct UserSend {
    rid: u32, //接受者id
    mtype: MSG_TYPE, // 消息类型
    msg: String,//内容
    time: usize,//时间
}

struct TempSend {
    rid: u32, //接受者id
    gid: u32, //群组id
    mtype: MSG_TYPE, // 消息类型
    msg: String,//内容
    time: usize,//时间
}

struct GroupSend {
    gid: u32,//组id
    mtype: MSG_TYPE,
    msg: String,//内容,可能是url
    time: usize,//时间
}

//获取游标和最新消息
struct HistoryCursor {
    code:u32,//返回状态
    cursor:u32,//用户游标
    last:u32,//最新消息
}

//推送新信息
struct SendMsg {
    code: u32, //返回状态
    rid: u32, //发送者ID
    last: u32, //最新消息ID
    gid: Option<u32>, //临时聊天的群组id
}
