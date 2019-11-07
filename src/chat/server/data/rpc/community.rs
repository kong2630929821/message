#[path=../db/]
use community.s::{CommunityBase, Post, Comment, PostKey, CommentKey, PostLaudLogKey};
#[path=../db/]
use user.s::{UserInfo};

enum CommType {
    person = 0,  // 个人
    official = 1,    // 官方
    publicAcc = 2,    // 公众号
}
//创建社区
struct CreateCommunity {
    name: String,           //社区名
    comm_type: CommType,    //社区类型-公众号、个人、好嗨号
    desc: String,           //简介
    avatar: Option<String>, //头像
}

// 修改公众号信息
struct ChangeCommunity {
    num: String,            //社区编号
    name: String,           //社区名
    desc: String,           //简介
    avatar: Option<String>, //头像
}

// 修改公众号信息
struct ChaangeCommunity {
    num: String,            //社区编号
    name: String,           //社区名
    desc: String,           //简介
    avatar: Option<String>, //头像
}

//发帖
struct AddPostArg {
    num: String,           //社区编号
    post_type: u8,          //帖子类型
    title: String,         //帖子标题
    body: String,            //内容
}

//评论
struct AddCommentArg {
    num: String,            //社区编号
    post_id: u32,           //帖子ID
    comment_type: u8,       //评论类型
    msg: String,            //评论内容
    reply: u32,              //回复评论ID
}

//公众号列表
struct NumArr {
    arr: &[CommunityBase],  //公众号数组
}

//帖子数据
struct PostData {
    key: PostKey,       //key
    post_type:u8,       //帖子类型图文、语言、视频
    title: String,      //标题
    body: String,       //正文
    owner: u32,         //发送者
    comm_type: u32,     //社区类型
    createtime: u32,    //创建时间
    likeCount: u32,     //点赞数
    commentCount: u32,  //评论总数
    forwardCount: u32,  //转发数
    collectCount: u32,  //收藏数
    username: String,   //用户名
    avatar: String,     //用户头像
    gender: u8,         //性别
    state: u8,          //帖子状态
}

//帖子列表
struct PostArr {
    list: &[PostData],  //帖子
}

//帖子列表
struct PostArrWithTotal {
    list: &[PostData],  //帖子
    total: u32,     //帖子总数
}

// 评论回复数据
struct ReplyData{
    key: CommentKey,       //key
    comment_type: u8,      //帖子类型图文、语言、视频
    msg: String,        //消息
    reply: u32, //评论表中的id，表示回复那一条评论，可以为空
    owner: u32,         //发送者
    likeCount: u32,     //点赞数
    createtime: u32,     //创建时间
    username: String,   //用户名
    avatar: String,     //用户头像
    gender: u8,         //性别
}

// 评论数据
struct CommentData{
    key: CommentKey,       //key
    comment_type: u8,      //帖子类型图文、语言、视频
    msg: String,        //消息
    reply: Option<ReplyData>, //评论的评论信息，表示回复那一条评论，可以为空
    owner: u32,         //发送者
    likeCount: u32,     //点赞数
    createtime: u32,     //创建时间
    username: String,   //用户名
    avatar: String,     //用户头像
    gender: u8,         //性别
}

//评论列表
struct CommentArr {
    list: &[CommentData],  //评论
}

//迭代帖子参数
struct IterPostArg {
    count: u32,     //获取数量
    id: u32,       //指定key进行遍历
    num: String,    // 社区编号
}

//迭代广场帖子参数
struct IterSquarePostArg {
    count: u32,     //获取数量
    id: u32,       //指定key进行遍历
    num: String,    // 社区编号
    square_type: u32,      //广场分类
    label: String,  //标签
}

//迭代标签帖子参数
struct IterLabelPostArg {
    label: String,  //标签
    count: u32,     //获取数量
    id: u32,     //指定key进行遍历
    num: String,       //社区编号
}

//迭代评论参数
struct IterCommentArg {
    count: u32,     //获取数量
    post_id: u32,    //帖子ID
    id: u32,       //评论ID
    num: String,    //社区编号
}

// 迭代点赞参数
struct IterLaudArg{
    count: u32,     //获取数量
    post_id: u32,    //帖子ID
    num: String,    //社区编号
    uid: u32,       // 用户ID
}

// 点赞数据
struct LaudLogData {
    key: PostLaudLogKey, //key
    createtime: u32,    //创建时间
    username: String,   //用户名
    avatar: String,     //用户头像
    gender: u8,         //性别
}

// 点赞记录
struct LaudLogArr{
    list: &[LaudLogData]
}

// 评论id列表
struct CommentIDList{
    list: &[u32]
}

// 社区号列表
struct CommunityNumList{
    list: &[String]
}

// 社区和用户信息
struct CommUserInfo{
    comm_info: CommunityBase,     //社区信息
    user_info: UserInfo,     //用户信息
}

// 用户信息列表
struct CommUserInfoList{
    list: &[CommUserInfo]
}
// PostKey列表
struct PostKeyList{
    list: &[PostKey]
}