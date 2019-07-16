import { Bucket } from '../../../utils/db';
import * as CONSTANT from '../constant';
import { AttentionIndex, Comment, CommentKey, CommentLaudLog, CommentLaudLogKey, CommunityBase, CommunityUser, CommunityUserKey, Post, PostCount, PostKey, PostLaudLog, PostLaudLogKey } from '../db/community.s';
import { getIndexID } from '../util';
import { AddCommentArg, AddPostArg, CommentArr, CreateCommunity, IterCommentArg, IterPostArg, NumArr, PostArr, PostData } from './community.s';
import { getUid } from './group.r';

/**
 * 创建社区账号
 */
// #[rpc=rpcServer]
export const createCommunityNum = (arg:CreateCommunity):string => {
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
        communityBaseBucket.put(num, communityBase);
        // 创建成功自动关注公众号
        userFollow(num);

        return num;
    } 

};

/**
 * 关注公众号
 */
// #[rpc=rpcServer]
export const userFollow = (communityNum:string):boolean => {
    const uid = getUid();
    // 公众号用户表
    const communityUserBucket = new Bucket(CONSTANT.WARE_NAME, CommunityUser._$info.name);
    const key = new CommunityUserKey();
    key.num = communityNum;
    key.uid = uid;
    const value = new CommunityUser();
    value.key = key;
    value.auth = CONSTANT.COMMUNITY_AUTH_DEF;
    value.createtime = Date.now();
    if (communityUserBucket.put(key, value)) {
        return addNumIndex(uid, communityNum);
    }
    
    return false;   
};

/**
 * 获取关注的公众号
 * 
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
    
    const PostBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
    const key = new PostKey();
    key.num = arg.num;
    key.id = getIndexID(CONSTANT.POST_INDEX, 1);
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
            postCount.likeCount = 0;
            postCount.collectCount = 0;
            postCount.forwardCount = 0;
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
    logKey.id = postKey.id;
    const logR = postLaudLogBucket.get(logKey)[0];
    if (!logR) {
        // 不存在则添加点赞记录
        const postCount = postCountBucket.get<PostKey, PostCount>(postKey)[0];
        postCount.likeCount += 1;
        // 添加计数
        if (!postCountBucket.put(postKey, postCount)) {
            
            return false;
        }
        // 添加记录
        const postLaudLog = new PostLaudLog();
        postLaudLog.key = logKey;
        postLaudLog.createtime = Date.now();

        return postLaudLogBucket.put(logKey, postLaudLog);
    } else {
        // 已经点赞则取消
        const postCount = postCountBucket.get<PostKey, PostCount>(postKey)[0];
        postCount.likeCount -= 1;
        // 添加计数
        if (!postCountBucket.put(postKey, postCount)) {
            
            return false;
        }
        // 删除记录

        return postLaudLogBucket.delete(logKey);
    }

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
    const postCountBucket = new Bucket(CONSTANT.WARE_NAME, PostCount._$info.name);
    const iter = postBucket.iter(key, true);
    const arr:PostData[] = [];
    for (let i = 0; i < count; i++) {
        const v = iter.next();
        console.log('!!!!!!!!!!!!post:', v);
        if (!v) {
            break;
        }
        const post:Post = v[1];
        // 读取点赞等数据
        const valueCount = postCountBucket.get<PostKey, PostCount[]>(v[0])[0];
        const postData = new PostData();
        postData.key = v[0];
        postData.body = post.body;
        postData.collectCount = valueCount.collectCount;
        postData.createtime = post.createtime;
        postData.forwardCount = valueCount.forwardCount;
        postData.likeCount = valueCount.likeCount;
        postData.owner = post.owner;
        postData.post_type = post.post_type;
        postData.title = post.title;
        arr.push(postData);
    }

    const postList = new PostArr();
    postList.list = arr;
    console.log('!!!!!!!!!!!!!!!!!!!!!!', postList);

    return postList;
};

/**
 * 评论
 */
// #[rpc=rpcServer]
export const addCommentPost = (arg: AddCommentArg): CommentKey => {
    const uid = getUid();
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
        if (commentBucket.put(key, value)) {

            return key;
        }
    }
    key.num = '';
    
    return key;
};

/**
 * 获取最新评论
 * 
 */
// #[rpc=rpcServer]
export const showCommentPort = (arg: IterCommentArg) :CommentArr => {
    const count = arg.count;
    const id = arg.id;
    let key:CommentKey;
    if (id <= 0) {
        key = undefined;
    } else {
        key = new CommentKey();
        key.id = arg.id;
        key.num = arg.num;
        key.post_id = arg.post_id;
    }

    const list = new CommentArr();

    const commentBucket = new Bucket(CONSTANT.WARE_NAME, Comment._$info.name);
    const iter = commentBucket.iter(key, true);
    const arr:Comment[] = [];
    for (let i = 0; i < count; i++) {
        const v = iter.next();
        console.log('!!!!!!!!!!!!comment:', v);
        if (!v) {
            break;
        }
        const com:Comment = v[1];
        arr.push(com);
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

// 添加公众号索引
const addNumIndex = (uid: number, num: string):boolean => {
    // 关注索引表
    const indexBucket = new Bucket(CONSTANT.WARE_NAME, AttentionIndex._$info.name);
    const r = indexBucket.get<number, AttentionIndex[]>(uid)[0];
    if (!r) {
        const index = new AttentionIndex();
        index.uid = uid;
        index.list = [num];
        
        return indexBucket.put(uid, index);
    } else {
        const arr = r.list;
        if (arr.indexOf(num) >= 0) {

            return true;
        } else {
            arr.push(num);
            r.list = arr;
        
            return indexBucket.put(uid, r);
        }
    }

};