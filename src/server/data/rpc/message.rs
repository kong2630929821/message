struct AnnounceSend {
    gid: u32,//组id
    sid: u32,//发布者id
    type: MSG_TYPE,
    msg: String,//内容
    time: u32,//时间
}

struct UserSend {
    rid: u32,//接受者id
    sid: u32,//发布者id    
    type: MSG_TYPE,
    msg: String,//内容
    time: u32,//时间
}

struct GroupSend {
    gid: u32,//组id
    sid: u32,//发布者id
    type: MSG_TYPE,
    msg: String,//内容
    time: u32,//时间
}