import { Env } from '../../../../pi/lang/env';
import { Bucket } from '../../../utils/db';
import * as CONSTANT from '../constant';
import { AttentionIndex, Comment, CommentKey, CommentLaudLog, CommentLaudLogKey, CommunityBase, CommunityUser, CommunityUserKey, LaudPostIndex, Post, PostCount, PostKey, PostLaudLog, PostLaudLogKey } from '../db/community.s';
import { UserInfo } from '../db/user.s';
import { getIndexID } from '../util';
import { getUsersInfo } from './basic.r';
import { GetUserInfoReq } from './basic.s';
import { AddCommentArg, AddPostArg, CommentArr, CommentData, CreateCommunity, IterCommentArg, IterLaudArg, IterPostArg, LaudLogArr, LaudLogData, NumArr, PostArr, PostData, CommentIDList, IterSquarePostArg } from './community.s';
import { getUid } from './group.r';
import { SQUARE_ALL, SQUARE_FOLLOW } from '../constant';

declare var env: Env;
/**
 * 首次注册创建社区个人账号
 */
export const createCommNum = (uid:number,name:string,comm_type:number):string => {
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME, CommunityBase._$info.name);
    // 生成社区账号
    const num = getIndexID(CONSTANT.COMMUNITY_INDEX, 1).toString();
    const r = communityBaseBucket.get(num)[0];
    if (!r) {
        const communityBase = new CommunityBase();
        communityBase.num = num;
        communityBase.name = name;
        communityBase.desc = '';
        communityBase.owner = uid;
        communityBase.property = '';
        communityBase.createtime = Date.now();
        communityBase.comm_type = comm_type;
        console.log('!!!!!!!!!!!!!!!!createCommNum CommunityBase',communityBase);

        communityBaseBucket.put(num, communityBase);
        userfollow(uid, num);

        return num;
    } 
};

/**
 * 创建社区账号
 */
// #[rpc=rpcServer]
export const createCommunityNum = (arg:CreateCommunity):string => {
    console.log('!!!!!!!!!!!!!!!!CreateCommunity',arg);
    const uid = getUid();
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME, CommunityBase._$info.name);
    // 生成社区账号
    const num = getIndexID(CONSTANT.COMMUNITY_INDEX, 1).toString();
    const r = communityBaseBucket.get(num);
    if (!r[0]) {
        const communityBase = new CommunityBase();
        communityBase.num = num;
        communityBase.name = arg.name;
        communityBase.desc = arg.desc;
        communityBase.owner = uid;
        communityBase.property = '';
        communityBase.createtime = Date.now();
        communityBase.comm_type = arg.comm_type;
        console.log('!!!!!!!!!!!!!!!!CommunityBase',communityBase);

        communityBaseBucket.put(num, communityBase);
        // 创建成功自动关注公众号
        userFollow(num);

        return num;
    } 

};

/**
 * 关注 公众号
 */
// #[rpc=rpcServer]
export const userFollow = (communityNum:string):boolean => {
    console.log('!!!!!!!!!!!userFollow num',communityNum);
    const uid = getUid();
    // 公众号用户表
    const communityUserBucket = new Bucket(CONSTANT.WARE_NAME, CommunityUser._$info.name);
    const key = new CommunityUserKey();
    key.num = communityNum;
    key.uid = uid;
    const follow = communityUserBucket.get(key)[0];
    console.log('!!!!!!!!!!!userFollow CommunityUser',follow);
    if (follow) {
        communityUserBucket.delete(key);

        return addNumIndex(uid, communityNum, false);
    }
    const value = new CommunityUser();
    value.key = key;
    value.auth = CONSTANT.COMMUNITY_AUTH_DEF;
    value.createtime = Date.now();
    console.log('!!!!!!!!!!!userFollow CommunityUser',value);
    if (communityUserBucket.put(key, value)) {
        return addNumIndex(uid, communityNum, true);
    }
   
    return false;   
};

/**
 * 获取关注的公众号
 */
// #[rpc=rpcServer]
export const showUserFollowPort = (num_type:number):NumArr => {
    const uid = getUid();
    const indexBucket = new Bucket(CONSTANT.WARE_NAME, AttentionIndex._$info.name);
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME, CommunityBase._$info.name);
    const arr = new NumArr();
    arr.arr = [];
    const r = indexBucket.get<number, AttentionIndex[]>(uid)[0];
    console.log('!!!!!!!!', r);
    if (r) {
        const list = r.list;
        for (let i = 0; i < list.length; i++) {
            const num = list[i];
            console.log('!!!!!!!!num:', num);
            // 获取公众号数据
            const data = communityBaseBucket.get<string, CommunityBase[]>(num)[0];
            console.log('!!!!!!!!num:', num);
            arr.arr.push(data);
        }
    }
    console.log('showUserFollowPort!!!!!', arr);
    
    return arr;
};

/**
 * 添加动态
 */
// #[rpc=rpcServer]
export const addPostPort = (arg: AddPostArg): PostKey => {
    const uid = getUid();
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME,CommunityBase._$info.name);
    const community = communityBaseBucket.get(arg.num)[0];
    console.log('!!!!!!!!!!!!!!!!!!addPostPort communityBase',arg,community);
    const key = new PostKey();
    key.num = arg.num;
    key.id = getIndexID(CONSTANT.POST_INDEX, 1);
    // 不能用别人的社区账号发帖
    if (community && community.owner !== uid) {
        key.num = '';

        return key;
    }
    const PostBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
    const value = new Post();
    value.key = key;
    value.title = arg.title;
    value.body = arg.body;
    value.post_type = arg.post_type;
    value.owner = uid;
    value.createtime = Date.now();
    // 检查帖子是否存在
    if (!PostBucket.get(key)[0]) {
        // 写入帖子
        if (PostBucket.put(key, value)) {
            // 初始化计数表
            const postCountBucket = new Bucket(CONSTANT.WARE_NAME, PostCount._$info.name);
            const postCount = new PostCount();
            postCount.key = key;
            postCount.likeList = [];
            postCount.collectList = [];
            postCount.commentList = [];
            postCount.forwardList = [];
            if (postCountBucket.put(key, postCount)) {

                return key;
            }
        }
    }
    key.num = '';

    return key;
};

/**
 * 帖子点赞或取消点赞
 */
// #[rpc=rpcServer]
export const postLaudPost = (postKey: PostKey): boolean => {
    const uid = getUid();
    // 点赞计数表
    const postCountBucket = new Bucket(CONSTANT.WARE_NAME, PostCount._$info.name);
    // 点赞记录
    const postLaudLogBucket = new Bucket(CONSTANT.WARE_NAME, PostLaudLog._$info.name);
    // 获取用户是否已经点赞
    const logKey = new PostLaudLogKey();
    logKey.uid = uid;
    logKey.num = postKey.num;
    logKey.post_id = postKey.id;
    const logR = postLaudLogBucket.get(logKey)[0];
    console.log('!!!!!!!!!!!!!!!!postLaudPost logR',logR);
    if (!logR) {
        // 不存在则添加点赞记录
        const postCount:PostCount = postCountBucket.get<PostKey, PostCount>(postKey)[0];
        postCount.likeList.push(uid);
        // 添加计数
        if (!postCountBucket.put(postKey, postCount)) {
            
            return false;
        }
        // 添加记录
        const postLaudLog = new PostLaudLog();
        postLaudLog.key = logKey;
        postLaudLog.createtime = Date.now();
        addLaudIndex(uid,postKey.id,postKey.num,true);

        return postLaudLogBucket.put(logKey, postLaudLog);
    } else {
        // 已经点赞则取消
        const postCount:PostCount = postCountBucket.get<PostKey, PostCount>(postKey)[0];
        // 从用户点赞列表中删除uid
        const index = postCount.likeList.indexOf(uid);
        if (index >= 0) postCount.likeList.splice(index, 1);
        // 添加计数
        if (!postCountBucket.put(postKey, postCount)) {
            
            return false;
        }
        // 删除记录
        addLaudIndex(uid,postKey.id,postKey.num,false);

        return postLaudLogBucket.delete(logKey);
    }

};

/**
 * 获取帖子点赞记录
 */
// #[rpc=rpcServer]
export const showLaudLog = (arg:IterLaudArg):LaudLogArr => {
    const count = arg.count;
    const uid = arg.uid;
    let key:PostLaudLogKey;
    if (uid <= 0) {
        key = undefined;
    } else {
        key = new PostLaudLogKey();
        key.post_id = arg.post_id;
        key.num = arg.num;
        key.uid = arg.uid;
    }
    console.log('!!!!!!!!!!!!!showLaudLog arg',arg);
    const list = new LaudLogArr();
    const laudLogBucket = new Bucket(CONSTANT.WARE_NAME, PostLaudLog._$info.name);
    const iter = laudLogBucket.iter(key, true);
    const arr:LaudLogData[] = [];
    for (let i = 0; i < count; i++) {
        const v = iter.next();
        console.log('!!!!!!!!!!!!showLaudLog PostLaudLog:', v);
        if (!v) {
            break;
        }
        const com:PostLaudLog = v[1];
        const user = new GetUserInfoReq();
        user.uids = [v[0].uid];
        const userinfo:UserInfo = getUsersInfo(user).arr[0];  // 用户信息

        // 评论数据
        const commentData = new LaudLogData();
        commentData.key = v[0];
        commentData.createtime = com.createtime;
        commentData.username = userinfo.name;
        commentData.avatar = userinfo.avatar;
        commentData.gender = userinfo.sex;
        arr.push(commentData);
    }

    list.list = arr;
    console.log('!!!!!!!!!!!!showLaudLog LaudLogList:', list);    

    return list;
};

/**
 * 获取最新的帖子
 * @param arg count:number
 */
// #[rpc=rpcServer]
export const showPostPort = (arg: IterPostArg) :PostArr => {
    const count = arg.count;
    const id = arg.id;
    const num = arg.num;
    let key:PostKey;
    if (id <= 0) {
        key = undefined;
    } else {
        key = new PostKey();
        key.id = id;
        key.num = num;
    }
    const postBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
    const iter = postBucket.iter(key, false);
    console.log('!!!!!!!!!!!!showPostPort iter:', iter);
    const arr:PostData[] = [];
    for (let i = 0; i < count; i++) {
        const v = iter.next();
        console.log('!!!!!!!!!!!!post:', v);
        if (!v) {
            break;
        }
        const post:Post = v[1];
        const postKey = v[0];
        const postData = getPostInfo(postKey, post);
        arr.push(postData);
        console.log('!!!!!!!!!!!!!!!!!!!!!!showPostPort PostData', postData);
    }

    const postList = new PostArr();
    postList.list = arr;
    console.log('!!!!!!!!!!!!!!!!!!!!!!showPostPort PostArr', postList);

    return postList;
};

/**
 * 获取广场指定类型的帖子
 * @param arg 
 */
// export const getSquarePost = (arg: IterSquarePostArg): PostArr => {
//     const uid = getUid();
//     let postArr: PostArr;
//     switch(arg.square_type) {
//         case SQUARE_ALL:
//             const iterArg = new IterPostArg();
//             iterArg.count = arg.count;
//             iterArg.id = arg.id;
//             iterArg.num = arg.num;
//             postArr = showPostPort(iterArg);
//             break;
//         case SQUARE_FOLLOW:
//             const indexBucket = new Bucket(CONSTANT.WARE_NAME, AttentionIndex._$info.name);
//             const attentionIndex = indexBucket.get<number, AttentionIndex[]>(uid)[0];
//             for (let i = 0; i < attentionIndex.list.length; i++) {
//                 const iterArg = new IterPostArg();
//                 iterArg.count = arg.count;
//                 iterArg.id = arg.id;
//                 iterArg.num = arg.num;
                
//             }
//     }
// }

/**
 * 评论
 */
// #[rpc=rpcServer]
export const addCommentPost = (arg: AddCommentArg): CommentKey => {
    console.log('!!!!!!!!!!!!!!!!!!!!!!addCommentPost', arg);
    const uid = getUid();
    const postCountBucket = new Bucket(CONSTANT.WARE_NAME, PostCount._$info.name);
    const commentBucket = new Bucket(CONSTANT.WARE_NAME, Comment._$info.name);
    const key = new CommentKey();
    key.num = arg.num;
    key.post_id = arg.post_id;
    key.id = getIndexID(CONSTANT.COMMENT_INDEX, 1);
    const value = new Comment();
    value.key = key;
    value.comment_type = arg.comment_type;
    value.msg = arg.msg;
    value.likeCount = 0;
    value.reply = arg.reply;
    value.owner = uid;
    value.createtime = Date.now();
    // 检查评论是否存在
    if (!commentBucket.get(key)[0]) {
        const postkey = new PostKey();
        postkey.id = arg.post_id;
        postkey.num = arg.num;
        const postCount:PostCount = postCountBucket.get<PostKey, PostCount>(postkey)[0];
        postCount.commentList.push(key.id),
        console.log('!!!!!!!!!!!!!!!!!!!!!!addCommentPost', postCount);
        // 添加评论计数
        if (!postCountBucket.put(postkey, postCount)) {
            key.num = '';
            
            return key;
        }
        // 添加评论记录
        if (commentBucket.put(key, value)) {
           
            return key;
        }
    }
    key.num = '';
    
    return key;
};

/**
 * 删除评论
 */
// #[rpc=rpcServer]
export const delCommentPost = (arg: CommentKey): number => {
    const uid = getUid();
    const postCountBucket = new Bucket(CONSTANT.WARE_NAME, PostCount._$info.name);
    const commentBucket = new Bucket(CONSTANT.WARE_NAME, Comment._$info.name);
    const comment = commentBucket.get(arg)[0];
    // 检查评论是否存在
    if (comment) {
        return 0;
    }
    // 不能删除其他人发的评论
    if (uid !== comment.owner) { 
        return -1;
    }
    const postkey = new PostKey();
    postkey.id = arg.post_id;
    postkey.num = arg.num;
    const postCount:PostCount = postCountBucket.get<PostKey, PostCount>(postkey)[0];
    // 从用户评论列表中删除uid
    const index = postCount.commentList.indexOf(arg.id);
    if (index >= 0) postCount.commentList.splice(index, 1);
    // 添加评论计数
    if (!postCountBucket.put(postkey, postCount)) {
        
        return 0;
    }
    // 删除评论记录
    if (!commentBucket.delete(arg)) {
       
        return 0;
    }
    
    return 1;
};

/**
 * 获取最新评论
 * 
 */
// #[rpc=rpcServer]
export const showCommentPort = (arg: IterCommentArg) :CommentArr => {
    const postKey = new PostKey();
    postKey.id = arg.post_id;
    postKey.num = arg.num;
    console.log('!!!!!!!!!!!!!showCommentPort arg',arg);
    const list = new CommentArr();
    const commentBucket = new Bucket(CONSTANT.WARE_NAME, Comment._$info.name);
    const postCountBucket = new Bucket(CONSTANT.WARE_NAME, PostCount._$info.name);
    const postCount:PostCount = postCountBucket.get<PostKey, PostCount>(postKey)[0];
    const arr:CommentData[] = [];
    let count = 0;
    if (postCount) {
        const commentList = postCount.commentList.reverse();
        // 获取初始位置
        let index = commentList.indexOf(arg.id) + 1;
        if (index < 0) index = 0;
        for (let i = index; i < commentList.length; i++) {
            if (count >= arg.count) break;
            const commentKey = new CommentKey();
            commentKey.id = postCount.commentList[i];
            commentKey.num = arg.num;
            commentKey.post_id = arg.post_id;
            const com = commentBucket.get<CommentKey, Comment>(commentKey)[0];
            const user = new GetUserInfoReq();
            user.uids = [com.owner];
            const userinfo:UserInfo = getUsersInfo(user).arr[0];  // 用户信息
            // 评论数据
            const commentData = new CommentData();
            commentData.key = commentKey;
            commentData.msg = com.msg;
            commentData.createtime = com.createtime;
            commentData.likeCount = com.likeCount;
            commentData.owner = com.owner;
            commentData.reply = com.reply;
            commentData.comment_type = com.comment_type;
            commentData.username = userinfo.name;
            commentData.avatar = userinfo.avatar;
            commentData.gender = userinfo.sex;
            arr.push(commentData);
            count ++;
        }
    }

    list.list = arr;
    console.log('!!!!!!!!!!!!commentlist:', list);    

    return list;
};

/**
 * 评论点赞
 */
// #[rpc=rpcServer]
export const commentLaudPost = (commentKey: CommentKey): boolean => {
    const uid = getUid();
    // 评论表
    const CommentBucket = new Bucket(CONSTANT.WARE_NAME, Comment._$info.name);
    // 点赞记录
    const CommentLaudLogBucket = new Bucket(CONSTANT.WARE_NAME, CommentLaudLog._$info.name);
    // 获取用户是否已经点赞
    const logKey = new CommentLaudLogKey();
    logKey.uid = uid;
    logKey.num = commentKey.num;
    logKey.post_id = commentKey.post_id;
    logKey.id = commentKey.id;
    const logR = CommentLaudLogBucket.get(logKey)[0];
    if (!logR) {
        // 不存在则添加点赞记录
        const commentCount = CommentBucket.get<CommentKey, Comment[]>(commentKey)[0];
        commentCount.likeCount += 1;
        // 添加计数
        if (!CommentBucket.put(commentKey, commentCount)) {
            
            return false;
        }
        // 添加记录
        const commentLaudLog = new CommentLaudLog();
        commentLaudLog.key = logKey;
        commentLaudLog.createtime = Date.now();

        return CommentLaudLogBucket.put(logKey, commentLaudLog);
    } else {
        // 已经点赞则取消
        const commentCount = CommentBucket.get<CommentKey, Comment[]>(commentKey)[0];
        commentCount.likeCount -= 1;
        // 添加计数
        if (!CommentBucket.put(commentKey, commentCount)) {
            
            return false;
        }
        // 删除记录

        return CommentLaudLogBucket.delete(logKey);
    }

};

/**
 * 获取指定帖子下已点赞的评论
 * @param commentKey 评论的key
 */
// #[rpc=rpcServer]
export const getCommentLaud = (postKey: PostKey): CommentIDList => {
    console.log('!!!!!!!!!!!!getCommentLaud:', postKey);
    const uid = getUid();
    const postCountBucket = new Bucket(CONSTANT.WARE_NAME, PostCount._$info.name);
    const postCount:PostCount = postCountBucket.get<PostKey, PostCount>(postKey)[0];
    const commentIdList = new CommentIDList();
    commentIdList.list = [];
    // 点赞记录
    const CommentLaudLogBucket = new Bucket(CONSTANT.WARE_NAME, CommentLaudLog._$info.name);
    // 获取用户是否已经点赞
    const logKey = new CommentLaudLogKey();
    logKey.uid = uid;
    logKey.num = postKey.num;
    logKey.post_id = postKey.id;
    if (postCount) {
        console.log('!!!!!!!!!!!!postCount:', postCount);
        for (let i = 0; i < postCount.commentList.length; i++) {
            logKey.id = postCount.commentList[i];
            const logR = CommentLaudLogBucket.get(logKey)[0];
            if (logR) {
                commentIdList.list.push(postCount.commentList[i])
            }
        }
    }

    return commentIdList;
}

// 添加公众号索引
const addNumIndex = (uid: number, num: string, addFg:boolean):boolean => {
    // 关注索引表
    const indexBucket = new Bucket(CONSTANT.WARE_NAME, AttentionIndex._$info.name);
    const r = indexBucket.get<number, AttentionIndex[]>(uid)[0];
    console.log('!!!!!!!!!!!addNumIndex AttentionIndex',r);
    if (!r && addFg) {
        const index = new AttentionIndex();
        index.uid = uid;
        index.list = [num];
        
        indexBucket.put(uid, index);
    } else if (r) {
        const arr = r.list;
        const ind = arr.indexOf(num);
        if (addFg && ind === -1) {
            arr.push(num);
            r.list = arr;
        
            indexBucket.put(uid, r);
        } else if (!addFg && ind > -1) {
            arr.splice(ind,1);
            r.list = arr;

            indexBucket.put(uid,r);
        }
    }
    console.log('!!!!!!!!!!!addNumIndex AttentionIndex',r);

    return true;

};

// 为点赞帖子添加索引
const addLaudIndex = (uid:number,id:number,num:string,addFg:boolean):boolean => {
    // 点赞索引表
    const indexBucket = new Bucket(CONSTANT.WARE_NAME, LaudPostIndex._$info.name);
    const r = indexBucket.get<number, LaudPostIndex[]>(uid)[0];
    const postkey = new PostKey();
    postkey.id = id;
    postkey.num = num;
    console.log('!!!!!!!!!!!addLaudIndex LaudPostIndex',r);
    if (!r && addFg) {
        const index = new LaudPostIndex();
        index.uid = uid;
        index.list = [postkey];
        
        indexBucket.put(uid, index);
        
    } else if (r) {
        const arr = r.list;
        const ind = arr.findIndex(v => v.id === id && v.num === num);
        if (addFg && ind === -1) {
            arr.push(postkey);
            r.list = arr;
        
            indexBucket.put(uid, r);

        } else if (!addFg && ind > -1) {
            arr.splice(ind,1);
            r.list = arr;
        
            indexBucket.put(uid, r);
        }
        
    }
    console.log('!!!!!!!!!!!addLaudIndex LaudPostIndex',r);
   
    return true;
};

/**
 * 获取点赞帖子列表
 */
// #[rpc=rpcServer]
export const getLaudPostList = ():LaudPostIndex => {
    const uid = getUid();
    // 点赞索引表
    const indexBucket = new Bucket(CONSTANT.WARE_NAME, LaudPostIndex._$info.name);
    const list = indexBucket.get<number, LaudPostIndex[]>(uid)[0];
    if (!list) {
        const r = new LaudPostIndex();
        r.uid = uid;
        r.list = [];
        indexBucket.put(uid,r);

        return r;
    }

    return list;
};

// ==============================Internal functions ==============================
/**
 * 关注 公众号
 */
export const userfollow = (uid: number, communityNum:string):boolean => {
    console.log('!!!!!!!!!!!userFollow num',communityNum);
    // 公众号用户表
    const communityUserBucket = new Bucket(CONSTANT.WARE_NAME, CommunityUser._$info.name);
    const key = new CommunityUserKey();
    key.num = communityNum;
    key.uid = uid;
    const follow = communityUserBucket.get(key)[0];
    console.log('!!!!!!!!!!!userFollow CommunityUser',follow);
    if (follow) {
        communityUserBucket.delete(key);

        return addNumIndex(uid, communityNum, false);
    }
    const value = new CommunityUser();
    value.key = key;
    value.auth = CONSTANT.COMMUNITY_AUTH_DEF;
    value.createtime = Date.now();
    console.log('!!!!!!!!!!!userFollow CommunityUser',value);
    if (communityUserBucket.put(key, value)) {
        return addNumIndex(uid, communityNum, true);
    }
   
    return false;   
};

/**
 * 获取帖子信息
 */
export const getPostInfo = (postKey: PostKey, post: Post): PostData => {
    const postCountBucket = new Bucket(CONSTANT.WARE_NAME, PostCount._$info.name);
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME,CommunityBase._$info.name);
    const user = new GetUserInfoReq();
    user.uids = [post.owner];
    const userinfo:UserInfo = getUsersInfo(user).arr[0];  // 用户信息
    const commBase:CommunityBase = communityBaseBucket.get(postKey.num)[0]; // 社区基础信息

    // 读取点赞等数据
    const valueCount = postCountBucket.get<PostKey, PostCount[]>(postKey)[0];
    const postData = new PostData();
    postData.key = postKey;
    postData.body = post.body;
    postData.collectCount = valueCount.collectList.length;
    postData.createtime = post.createtime;
    postData.forwardCount = valueCount.forwardList.length;
    postData.likeCount = valueCount.likeList.length;
    postData.commentCount = valueCount.commentList.length;
    postData.owner = post.owner;
    postData.post_type = post.post_type;
    postData.title = post.title;
    postData.username = userinfo.name;
    postData.avatar = userinfo.avatar;
    postData.gender = userinfo.sex;
    postData.comm_type = commBase.comm_type;

    return postData;
}