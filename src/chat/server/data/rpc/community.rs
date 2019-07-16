#[path=../db/]
use community.s::{CommunityBase, Post, Comment, PostKey};

//创建社区
struct CreateCommunity {
    name: String,           //社区名
    comm_type: u8,          //社区类型-公众号、个人、好嗨号
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
    createtime: u32,    //创建时间
    likeCount: u32,     //点赞数
    forwardCount: u32,  //转发数
    collectCount: u32,  //收藏数
}

//帖子列表
struct PostArr {
    list: &[PostData],  //帖子
}

//评论列表
struct CommentArr {
    list: &[Comment],  //评论
}

//迭代帖子参数
struct IterPostArg {
    count: u32,     //获取数量
    id: u32,       //指定key进行遍历
    num: String,
}

//迭代评论参数
struct IterCommentArg {
    count: u32,     //获取数量
    post_id: u32,    //帖子ID
    id: u32,       //评论ID
    num: String,    //社区编号
}