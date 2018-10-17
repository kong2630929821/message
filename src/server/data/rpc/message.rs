struct AnnounceSend {
    gid: u32,//组id
    type: MSG_TYPE,
    msg: String,//内容
    time: u32,//时间
}

struct UserSend {
    rid: u32,//接受者id  
    type: MSG_TYPE,
    msg: String,//内容
    time: u32,//时间
}

struct GroupSend {
    gid: u32,//组id
    type: MSG_TYPE,
    msg: String,//内容
    time: u32,//时间
}