/**
*社区基础表
*/
#[primary=num,db=file,dbMonitor=true]
struct CommunityBase {
    num: String,            //社区编号
    name: String,           //社区名
    desc: String,           //简介
    comm_type: u8,          //社区类型-公众号、个人、好嗨号
    property: String,       //属性 公共、登录即可访问、私有  
    owner: u32,             //所有者(创建者)
    createtime: String         //创建时间
}

/**
*自增ID表
*/
#[primary=key,db=file,dbMonitor=true]
struct IndexID {
    key: String,      //自增IDkey
    id: u32,          //自增ID当前值
}

//社区用户key
struct CommunityUserKey {
    num: String,
    uid: u32
}

/**
*社区用户
*/
#[primary=key,db=file,dbMonitor=true]
struct CommunityUser {
    key: CommunityUserKey,   //key
    auth: u32,               //权限编号
    createtime: String          //创建时间
}

//帖子key
struct PostKey {
    id: u32,        //帖子ID
    num: String,   //社区编号
}

/**
*帖子和动态
*/
#[primary=key,db=file,dbMonitor=true]
struct Post {
    key: PostKey,       //key
    post_type:u8,       //帖子类型图文、语言、视频
    title: String,      //标题
    body: String,       //正文
    owner: u32,         //发送者
    createtime: String,    //创建时间
}

/**
*帖子和动态
*/
#[primary=key,db=file,dbMonitor=true]
struct PostCount {
    key: PostKey,       //key
    likeList: &[u32],     //点赞用户id列表
    commentList: &[u32],  //评论id列表
    forwardList: &[u32],  //转发id列表
    collectList: &[u32]  //收藏id列表
}

/**
*社区的帖子
*/
#[primary=num,db=file,dbMonitor=true]
struct CommunityPost {
    num: String,   // 社区编号
    id_list: &[u32] // 帖子id
}

//帖子点赞记录key
struct PostLaudLogKey {
    num: String,
    post_id: u32,
    uid: u32,
}

/**
*帖子点赞记录
*/
#[primary=key,db=file,dbMonitor=true]
struct PostLaudLog {
    key: PostLaudLogKey,       //key
    createtime: String,    //创建时间
}

//评论key
struct CommentKey {
    num: String,    //社区账号
    post_id: u32,   //文章ID
    id: u32         //评论id
}

/**
*评论
*/
#[primary=key,db=file,dbMonitor=true]
struct Comment {
    key: CommentKey,       //key
    comment_type: u8,      //帖子类型图文、语言、视频
    msg: String,        //消息
    reply: u32,         //评论表中的ID，表示回复那一条评论，可以为空
    owner: u32,         //发送者
    likeCount: u32,     //点赞数
    createtime: String     //创建时间
}

//评论点赞记录key
struct CommentLaudLogKey {
    uid: u32,
    num: String,
    post_id: u32,
    id: u32
}

/**
*评论点赞记录
*/
#[primary=key,db=file,dbMonitor=true]
struct CommentLaudLog {
    key: CommentLaudLogKey,       //key
    createtime: u32,    //创建时间
}

//收藏转发
struct CollectionKey {
    uid: u32,       //用户ID
    num: String,    //社区编号
    id: u32         //id
}

/**
*收藏评论
*/
#[primary=key,db=file,dbMonitor=true]
struct Collection {
    key: CollectionKey,       //key
    collection_type:u8,       //帖子类型图文、语言、视频
    msg: String,              //消息
    createtime: String           //创建时间
}

/**
*关注索引表
*/
#[primary=uid,db=file,dbMonitor=true]
struct AttentionIndex {
    uid: u32,                // 用户ID
    person_list: &[String],  // 个人用户社区编号
    public_list: &[String]   // 公众号
}

// 点赞索引表
#[primary=uid,db=file,dbMonitor=true]
struct LaudPostIndex{
    uid: u32,                 // 用户ID
    list: &[PostKey]   // 点赞过的帖子key
}

// 社区号索引
#[primary=uid,db=file,dbMonitor=true]
struct CommunityAccIndex{
    uid: u32,                 // 用户ID
    num: String,    //社区个人编号
    list: &[String]   // 社区公众号
}

// 粉丝索引表
#[primary=num,db=file,dbMonitor=true]
struct FansIndex{
    num: String,              // 用户ID
    list: &[String]           // 粉丝社区编号列表
}