import { Env } from '../../../../pi/lang/env';
import { Bucket } from '../../../utils/db';
import { send } from '../../../utils/send';
import * as CONSTANT from '../constant';
import { AttentionIndex, Comment, CommentKey, CommentLaudLog, CommentLaudLogKey, CommunityAccIndex, CommunityBase, CommunityPost, CommunityUser, CommunityUserKey, FansIndex, LaudPostIndex, Post, PostCount, PostKey, PostLaudLog, PostLaudLogKey } from '../db/community.s';
import { UserInfo } from '../db/user.s';
import { CANT_DETETE_OTHERS_COMMENT, CANT_DETETE_OTHERS_POST, COMMENT_NOT_EXIST, DB_ERROR, POST_NOT_EXIST } from '../errorNum';
import { getIndexID } from '../util';
import { getUsersInfo } from './basic.r';
import { GetUserInfoReq } from './basic.s';
import { AddCommentArg, AddPostArg, CommentArr, CommentData, CommentIDList, CommunityNumList, CommUserInfo, CommUserInfoList, CreateCommunity, IterCommentArg, IterLaudArg, IterPostArg, IterSquarePostArg, LaudLogArr, LaudLogData, NumArr, PostArr, PostArrWithTotal, PostData, ReplyData } from './community.s';
import { getUid } from './group.r';

declare var env: Env;
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
        communityBase.createtime = Date.now().toString();
        communityBase.comm_type = arg.comm_type;
        console.log('!!!!!!!!!!!!!!!!CommunityBase',communityBase);

        communityBaseBucket.put(num, communityBase);
        // 添加用户社区账号索引
        const publicAccIndexBucket = new Bucket(CONSTANT.WARE_NAME, CommunityAccIndex._$info.name);
        let publicAccIndex = publicAccIndexBucket.get<number, CommunityAccIndex[]>(uid)[0];
        if (!publicAccIndex) {
            publicAccIndex = new CommunityAccIndex();
            publicAccIndex.uid = uid;
            publicAccIndex.list = [];
        }
        if (arg.comm_type === CONSTANT.COMMUNITY_TYPE_PERSON) {
            publicAccIndex.num = num;
        } else {
            publicAccIndex.list.push(num);
        }
        publicAccIndexBucket.put(uid, publicAccIndex);
        
        // 创建成功自动关注公众号
        userFollow(num);

        return num;
    } 

};

/**
 *  获取用户的公众号id
 */
// #[rpc=rpcServer]
export const getUserPublicAcc = (): string => {
    const uid = getUid();
    const publicAccIndexBucket = new Bucket(CONSTANT.WARE_NAME, CommunityAccIndex._$info.name);
    const publicAccIndex = publicAccIndexBucket.get<number, CommunityAccIndex[]>(uid)[0];
    if (!publicAccIndex) return '';
    if (!publicAccIndex.list) return '';

    return publicAccIndex.list[0];
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
    // 公众号信息
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME, CommunityBase._$info.name);
    const communityBase = communityBaseBucket.get<string, CommunityBase[]>(communityNum)[0];
    console.log('!!!!!!!!!!!communityBase',communityBase);
    if (!communityBase) return false;
    if (follow) {
        communityUserBucket.delete(key);
        // 删除粉丝索引
        addFansIndex(communityNum, uid, false);
        // 删除关注索引

        return addNumIndex(uid, communityNum, false, communityBase.comm_type);
    }
    const value = new CommunityUser();
    value.key = key;
    value.auth = CONSTANT.COMMUNITY_AUTH_DEF;
    value.createtime = Date.now().toString();
    console.log('!!!!!!!!!!!userFollow CommunityUser',value);
    if (communityUserBucket.put(key, value)) {
        // 添加粉丝索引
        addFansIndex(communityNum, uid, true);
        // 添加关注索引

        return addNumIndex(uid, communityNum, true, communityBase.comm_type);
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
        const list = r.public_list;
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
 * 批量获取指定社区号的信息
 */
// #[rpc=rpcServer]
export const getUserInfoByComm = (arg: CommunityNumList): CommUserInfoList => {
    const commUserInfoList = new CommUserInfoList();
    commUserInfoList.list = [];
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME,CommunityBase._$info.name); 
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME,UserInfo._$info.name);
    for (let i = 0; i < arg.list.length; i++) {
        const community = communityBaseBucket.get<string, CommunityBase[]>(arg.list[i])[0];
        if (!community) continue;
        const uid = community.owner;
        const userinfo = userInfoBucket.get<number, UserInfo[]>(uid)[0];
        if (!userinfo) continue;
        const commUserInfo = new CommUserInfo();
        commUserInfo.user_info = userinfo;
        commUserInfo.comm_info = community;
        commUserInfoList.list.push(commUserInfo);
    }

    return commUserInfoList;
};

/**
 *  获取指定用户的关注
 */
// #[rpc=rpcServer]
export const getFollowId = (uid: number): CommunityNumList => {
    const communityNumList = new CommunityNumList();
    communityNumList.list = [];
    const indexBucket = new Bucket(CONSTANT.WARE_NAME, AttentionIndex._$info.name);
    const index = indexBucket.get<number, AttentionIndex[]>(uid)[0];
    console.log('!!!!!!!!!!!!!!!!!!index',index);
    if (!index) return communityNumList;
    // 去掉社区号是自己的个人号和公众号
    const communityAccIndexBucket = new Bucket(CONSTANT.WARE_NAME, CommunityAccIndex._$info.name);
    const communityAccIndex =  communityAccIndexBucket.get<number, CommunityAccIndex[]>(uid)[0];
    console.log('!!!!!!!!!!!!!!!!!!communityAccIndex',communityAccIndex);
    if (communityAccIndex) {
        const personIndex = index.person_list.indexOf(communityAccIndex.num);
        index.person_list.splice(personIndex, 1);
        for (let i = 0; i < communityAccIndex.list.length; i++) {
            const publicIndex = index.public_list.indexOf(communityAccIndex.list[i]);
            index.public_list.slice(publicIndex, 1);
        }
    }
    communityNumList.list = index.person_list.concat(index.public_list);

    return communityNumList;
};

/**
 * 获取指定社区的粉丝
 */
// #[rpc=rpcServer]
export const getFansId = (num: string): CommunityNumList => {
    const communityNumList = new CommunityNumList();
    communityNumList.list = [];
    const indexBucket = new Bucket(CONSTANT.WARE_NAME, FansIndex._$info.name);
    const fansIndex = indexBucket.get<string, FansIndex[]>(num)[0];
    console.log('!!!!!!!!!!!!!!!!!!fansIndex',fansIndex);
    if (!fansIndex) return communityNumList;
    // 去掉粉丝为自己的社区号
    const index = fansIndex.list.indexOf(num);
    fansIndex.list.splice(index, 1);
    communityNumList.list = fansIndex.list;

    return communityNumList;
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
    value.createtime = Date.now().toString().toString();
    value.state = CONSTANT.NORMAL_STATE;
    // 检查帖子是否存在
    if (!PostBucket.get(key)[0]) {
        // 写入帖子
        if (PostBucket.put(key, value)) {
            // 写入社区的帖子
            const communityPostBucket = new Bucket(CONSTANT.WARE_NAME,CommunityPost._$info.name);
            let communityPost = communityPostBucket.get<string, CommunityPost[]>(arg.num)[0];
            console.log('!!!!!!!!!!!!!!!!!!communityPost',communityPost);
            if (!communityPost) {
                communityPost = new CommunityPost();
                communityPost.num = arg.num;
                communityPost.id_list = [];
            }
            communityPost.id_list.push(key.id);
            communityPostBucket.put(arg.num, communityPost);
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
        postLaudLog.createtime = Date.now().toString();
        addLaudIndex(uid,postKey.id,postKey.num,true);
        // 推送
        const postBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
        const post = postBucket.get<PostKey, Post[]>(postKey)[0];
        if (!post) return false;
        const fuid = post.owner;
        send(fuid, CONSTANT.SEND_POST_LAUD, JSON.stringify(postLaudLog));

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
        commentData.createtime = parseInt(com.createtime, 10);
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
        if (post.state === CONSTANT.DELETE_STATE) continue;
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
 * @ param arg 
 */
// #[rpc=rpcServer]
export const getSquarePost = (arg: IterSquarePostArg): PostArr => {
    const uid = getUid();
    let postArr: PostArr;
    switch (arg.square_type) {
        case CONSTANT.SQUARE_ALL: // 所有
            const iterArg = new IterPostArg();
            iterArg.count = arg.count;
            iterArg.id = arg.id;
            iterArg.num = arg.num;
            postArr = showPostPort(iterArg);
            break;
        case CONSTANT.SQUARE_FOLLOW: // 关注
            // 获取关注的用户
            const indexBucket = new Bucket(CONSTANT.WARE_NAME, AttentionIndex._$info.name);
            const attentionIndex = indexBucket.get<number, AttentionIndex[]>(uid)[0];
            console.log('!!!!!!!!!!!!!!!!!!!!!!attentionIndex', attentionIndex);
            const post_id_list: PostKey[] = [];
            for (let i = 0; i < attentionIndex.person_list.length; i++) {
                // 获取关注社区账户的帖子
                const communityPostBucket = new Bucket(CONSTANT.WARE_NAME,CommunityPost._$info.name);
                let communityPost = communityPostBucket.get<string, CommunityPost[]>(attentionIndex.person_list[i])[0];
                if (!communityPost) {
                    communityPost = new CommunityPost();
                    communityPost.num = attentionIndex.person_list[i];
                    communityPost.id_list = [];
                }
                console.log('!!!!!!!!!!!!!!!!!!!!!!communityPost', communityPost);
                const post_id_list1 = communityPost.id_list;
                for (let j = 0; j < post_id_list1.length; j++) {
                    const postKey = new PostKey();
                    postKey.id = post_id_list1[j];
                    postKey.num = communityPost.num;
                    post_id_list.push(postKey);
                }
            }
            console.log('!!!!!!!!!!!!!!!!!!!!!!post_id_list', post_id_list);
            // 从所有关注的社区账户的帖子中获取最新的指定数量的帖子id
            postIdSort(post_id_list, 0, post_id_list.length - 1);
            let index = -1;
            for (let i = 0; i < post_id_list.length; i++) {
                if (post_id_list[i].id === arg.id && post_id_list[i].num === arg.num) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                post_id_list.splice(index, post_id_list.length - index + 1);
            }
            post_id_list.reverse();
            postArr = new PostArr();
            postArr.list = [];
            let count = 0;
            // 获取帖子内容
            for (let i = 0; i < post_id_list.length; i++) {
                if (count >= arg.count) break;
                const postData = getPostInfoById(post_id_list[i]);
                if (!postData) continue;
                postArr.list.push(postData);
                count ++;
            }
            break;
        case CONSTANT.SQUARE_PUBLIC: // 公众号
            const iterArg2 = new IterPostArg();
            iterArg2.count = arg.count;
            iterArg2.id = arg.id;
            iterArg2.num = arg.num;
            postArr = getAllPublicPost(iterArg2);
            break;
        case CONSTANT.SQUARE_HOT: // 热门
            const iterArg1 = new IterPostArg();
            iterArg1.count = arg.count;
            iterArg1.id = arg.id;
            iterArg1.num = arg.num;
            postArr = getHotPost(iterArg1);
            break;
        default:

            return;
    }

    return postArr;
};

/**
 * 获取指定社区编号的帖子
 */
// #[rpc=rpcServer]
export const getUserPost = (arg: IterPostArg): PostArrWithTotal => {
    // 获取的帖子id
    const postArrWithTotal = new PostArrWithTotal();
    postArrWithTotal.list = [];
    postArrWithTotal.total = 0;
    const communityPostBucket = new Bucket(CONSTANT.WARE_NAME,CommunityPost._$info.name);
    const communityPost = communityPostBucket.get<string, CommunityPost[]>(arg.num)[0];
    if (!communityPost) {
        return postArrWithTotal;
    }
    // 帖子总数
    postArrWithTotal.total = communityPost.id_list.length;
    const post_id_list: PostKey[] = [];
    for (let i = 0; i < communityPost.id_list.length; i++) {
        const postKey = new PostKey();
        postKey.id = communityPost.id_list[i];
        postKey.num = communityPost.num;
        post_id_list.push(postKey);
    }
    postIdSort(post_id_list, 0, post_id_list.length - 1);
    let index = -1;
    for (let i = 0; i < post_id_list.length; i++) {
        if (post_id_list[i].id === arg.id && post_id_list[i].num === arg.num) {
            index = i;
            break;
        }
    }
    if (index >= 0) {
        post_id_list.splice(index, post_id_list.length - index + 1);
    }
    post_id_list.reverse();
    // 获取帖子内容
    let count = 0;
    for (let i = 0; i < post_id_list.length; i++) {
        if (count >= arg.count) break;
        const postData = getPostInfoById(post_id_list[i]);
        postArrWithTotal.list.push(postData);
        count ++;
    }

    return postArrWithTotal;
};

/**
 * 删除帖子
 */
// #[rpc=rpcServer]
export const deletePost = (postKey: PostKey): number => {
    const uid = getUid();
    const postBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
    const post = postBucket.get<PostKey, Post[]>(postKey)[0];
    if (!post) return POST_NOT_EXIST;
    if (uid !== post.owner) return CANT_DETETE_OTHERS_POST;
    post.state = CONSTANT.DELETE_STATE;
    if (!postBucket.put(postKey, post)) return DB_ERROR;

    return CONSTANT.RESULT_SUCCESS;
};

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
    value.createtime = Date.now().toString();
    // 检查评论是否存在
    if (!commentBucket.get(key)[0]) {
        const postkey = new PostKey();
        postkey.id = arg.post_id;
        postkey.num = arg.num;
        const postCount = postCountBucket.get<PostKey, PostCount[]>(postkey)[0];
        console.log('!!!!!!!!!!!!!!!!!!!!!!commentList', postCount);
        postCount.commentList.push(key.id);
        // 添加评论计数
        if (!postCountBucket.put(postkey, postCount)) {
            key.num = '';
            
            return key;
        }
        // 添加评论记录
        if (commentBucket.put(key, value)) {
            if (arg.reply === 0) {
                // 评论帖子,推送给发帖人
                const postBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
                const post = postBucket.get<PostKey, Post[]>(postkey)[0];
                if (!post) return;
                const fuid = post.owner;
                send(fuid, CONSTANT.SEND_COMMENT, JSON.stringify(value));
            } else {
                // 评论帖子的评论,推送给原评论者
                const originCommentKey = new CommentKey();
                originCommentKey.post_id = arg.post_id;
                originCommentKey.num = arg.num;
                originCommentKey.id = arg.reply;
                const originComment = commentBucket.get<CommentKey, Comment[]>(originCommentKey)[0];
                const fuid1 = originComment.owner;
                send(fuid1, CONSTANT.SEND_COMMENT_TO_COMMENT, JSON.stringify(value));
            }
           
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
    if (!comment) {
        return COMMENT_NOT_EXIST;
    }
    // 不能删除其他人发的评论
    if (uid !== comment.owner) { 
        return CANT_DETETE_OTHERS_COMMENT;
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
        
        return DB_ERROR;
    }
    // 删除评论记录
    if (!commentBucket.delete(arg)) {
       
        return DB_ERROR;
    }
    
    return CONSTANT.RESULT_SUCCESS;
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
    const postCount:PostCount = postCountBucket.get<PostKey, PostCount[]>(postKey)[0];
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
            const com = commentBucket.get<CommentKey, Comment[]>(commentKey)[0];
            const user = new GetUserInfoReq();
            user.uids = [com.owner];
            const userinfo:UserInfo = getUsersInfo(user).arr[0];  // 用户信息
            // 评论数据
            const commentData = new CommentData();
            commentData.key = commentKey;
            commentData.msg = com.msg;
            commentData.createtime = parseInt(com.createtime, 10);
            commentData.likeCount = com.likeCount;
            commentData.owner = com.owner;
            commentData.comment_type = com.comment_type;
            commentData.username = userinfo.name;
            commentData.avatar = userinfo.avatar;
            commentData.gender = userinfo.sex;
            // commentData.reply = new ReplyData();
            if (com.reply !== 0) { // 如果评论为其他评论的回复 获取原评论信息
                const commentKey1 = new CommentKey();
                commentKey1.id = com.reply;
                commentKey1.num = arg.num;
                commentKey1.post_id = arg.post_id;
                const com1 = commentBucket.get<CommentKey, Comment[]>(commentKey1)[0];
                // 原评论用户信息
                const user1 = new GetUserInfoReq();
                user1.uids = [com1.owner];
                const userinfo1:UserInfo = getUsersInfo(user1).arr[0];  // 用户信息
                const replyData = new ReplyData();
                replyData.key = commentKey1;
                replyData.msg = com1.msg;
                replyData.createtime = parseInt(com1.createtime, 10);
                replyData.likeCount = com1.likeCount;
                replyData.owner = com1.owner;
                replyData.comment_type = com1.comment_type;
                replyData.username = userinfo1.name;
                replyData.avatar = userinfo1.avatar;
                replyData.gender = userinfo1.sex;
                replyData.reply = com1.reply;
                commentData.reply = replyData;
            }
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
        const fuid = commentCount.owner;
        send(fuid, CONSTANT.SEND_COMMENT_LAUD, JSON.stringify(commentLaudLog));

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
                commentIdList.list.push(postCount.commentList[i]);
            }
        }
    }

    return commentIdList;
};

// 添加关注索引
const addNumIndex = (uid: number, num: string, addFg:boolean, comm_type: number):boolean => {
    // 关注索引表
    const indexBucket = new Bucket(CONSTANT.WARE_NAME, AttentionIndex._$info.name);
    const r = indexBucket.get<number, AttentionIndex[]>(uid)[0];
    console.log('!!!!!!!!!!!addNumIndex AttentionIndex',r);
    if (!r && addFg) {
        const index = new AttentionIndex();
        index.uid = uid;
        // 不存在关注的用户或公众号时 根据类型添加到用户的关注列表
        if (comm_type === CONSTANT.COMMUNITY_TYPE_PERSON) {
            index.person_list = [num];
            index.public_list = [];
        } else {
            index.person_list = [];
            index.public_list = [num];
        }
        
        indexBucket.put(uid, index);
    } else if (r) {
        // 不存在指定关注的用户或公众号时 根据类型和addFg从指定的关注列表中添加或删除id
        if (comm_type === CONSTANT.COMMUNITY_TYPE_PERSON) {
            const arr = r.person_list;
            const ind = arr.indexOf(num);
            if (addFg && ind === -1) {
                arr.push(num);
                r.person_list = arr;
            
                indexBucket.put(uid, r);
            } else if (!addFg && ind > -1) {
                arr.splice(ind,1);
                r.person_list = arr;
    
                indexBucket.put(uid,r);
            }
        } else {
            const arr = r.public_list;
            const ind = arr.indexOf(num);
            if (addFg && ind === -1) {
                arr.push(num);
                r.public_list = arr;
            
                indexBucket.put(uid, r);
            } else if (!addFg && ind > -1) {
                arr.splice(ind,1);
                r.public_list = arr;
    
                indexBucket.put(uid,r);
            }
        }
    }
    console.log('!!!!!!!!!!!addNumIndex AttentionIndex',r);

    return true;

};

// 添加/删除粉丝索引
const addFansIndex = (num: string, uid: number, addFg:boolean): boolean => {
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME,UserInfo._$info.name);
    const userinfo = userInfoBucket.get<number, UserInfo[]>(uid)[0];
    if (!userinfo) return false;
    const fansNum = userinfo.comm_num;
    const indexBucket = new Bucket(CONSTANT.WARE_NAME, FansIndex._$info.name);
    let fansIndex = indexBucket.get<string, FansIndex[]>(num)[0];
    if (!fansIndex) {
        fansIndex = new FansIndex();
        fansIndex.num = num;
        fansIndex.list = [];
    }
    // 添加
    if (addFg) {
        fansIndex.list.push(fansNum);
    } else { // 删除
        const index = fansIndex.list.indexOf(fansNum);
        if (index > -1) {
            fansIndex.list.splice(index, 1);
        }
    }

    return indexBucket.put(fansIndex.num, fansIndex);
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
        communityBase.createtime = Date.now().toString();
        communityBase.comm_type = comm_type;
        communityBaseBucket.put(num, communityBase);
        // 添加用户社区账号索引
        const publicAccIndexBucket = new Bucket(CONSTANT.WARE_NAME, CommunityAccIndex._$info.name);
        let publicAccIndex = publicAccIndexBucket.get<number, CommunityAccIndex[]>(uid)[0];
        if (!publicAccIndex) {
            publicAccIndex = new CommunityAccIndex();
            publicAccIndex.uid = uid;
            publicAccIndex.list = [];
        }
        if (comm_type === CONSTANT.COMMUNITY_TYPE_PERSON) {
            publicAccIndex.num = num;
        } else {
            publicAccIndex.list.push(num);
        }
        publicAccIndexBucket.put(uid, publicAccIndex);
        userfollow(uid, num);

        return num;
    } 
};

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
    // 公众号信息
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME, CommunityBase._$info.name);
    const communityBase = communityBaseBucket.get<string, CommunityBase[]>(communityNum)[0];
    console.log('!!!!!!!!!!!communityBase',communityBase);
    if (!communityBase) return false;
    if (follow) {
        communityUserBucket.delete(key);
        // 删除粉丝索引
        addFansIndex(communityNum, uid, false);
        // 删除关注索引

        return addNumIndex(uid, communityNum, false, communityBase.comm_type);
    }
    const value = new CommunityUser();
    value.key = key;
    value.auth = CONSTANT.COMMUNITY_AUTH_DEF;
    value.createtime = Date.now().toString();
    console.log('!!!!!!!!!!!userFollow CommunityUser',value);
    if (communityUserBucket.put(key, value)) {
        // 添加粉丝索引
        addFansIndex(communityNum, uid, true);
        // 添加关注索引
        
        return addNumIndex(uid, communityNum, true, communityBase.comm_type);
    }
   
    return false;   
};

/**
 * 获取热门帖子
 * @ param arg 
 */
export const getHotPost = (arg: IterPostArg) :PostArr => {
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
    // 遍历一个月内的帖子
    const timestamps = new Date().getTime();
    const today = get_day(timestamps);
    do {
        const v = iter.next();
        console.log('!!!!!!!!!!!!post:', v);
        if (!v) {
            break;
        }
        const post:Post = v[1];
        if (post.state === CONSTANT.DELETE_STATE) continue;
        const postKey = v[0];
        const postData = getPostInfo(postKey, post);
        if (today - get_day(postData.createtime) > 30) break;
        arr.push(postData);
    } while (iter);
    // 按热度排序
    postHotSort(arr, 0, arr.length - 1);
    console.log('!!!!!!!!!!!!Sortedarr:', arr);
    // 从请求参数中的帖子id获取之后的n条帖子
    let index = false;
    const postList = new PostArr();
    postList.list = [];
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (count >= arg.count) break;
        if (arr[i].key.id === arg.id && arr[i].key.num === arg.num) {
            index = true;
        }
        if (index || !key) {
            postList.list.push(arr[i]);
            count ++;
        }
    }

    return postList;
};

/**
 * 获取所有公众号帖子
 * @ param arg 
 */
export const getAllPublicPost = (arg: IterPostArg) :PostArr => {
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
    // 遍历一个月内的帖子
    const timestamps = new Date().getTime();
    const today = get_day(timestamps);
    let count = 0;
    do {
        const v = iter.next();
        console.log('!!!!!!!!!!!!post:', v);
        if (!v) {
            break;
        }
        const post:Post = v[1];
        if (post.state === CONSTANT.DELETE_STATE) continue;
        const postKey = v[0];
        const postData = getPostInfo(postKey, post);
        if (today - get_day(postData.createtime) > 30) break;
        // 获取社区账户类型
        const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME, CommunityBase._$info.name);
        const communityBase = communityBaseBucket.get<string, CommunityBase[]>(postData.key.num)[0];
        console.log('!!!!!!!!!!!!communityBase.comm_type:', communityBase.comm_type);
        if (communityBase.comm_type === CONSTANT.COMMUNITY_TYPE_PERSON) {
            arr.push(postData);
            count ++;
        }
    } while (count < arg.count);
    // 从请求参数中的帖子id获取之后的n条帖子
    const postList = new PostArr();
    postList.list = arr;

    return postList;
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
    postData.createtime = parseInt(post.createtime, 10);
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
};

/**
 * 获取指定社区账户帖子信息
 * @ param postKey
 */
export const getPostInfoById = (postKey: PostKey): PostData => {
    const postBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
    const postCountBucket = new Bucket(CONSTANT.WARE_NAME, PostCount._$info.name);
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME,CommunityBase._$info.name);
    const post = postBucket.get<PostKey, Post[]>(postKey)[0];
    if (post.state === CONSTANT.DELETE_STATE) return; // 帖子已删除
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
    postData.createtime = parseInt(post.createtime, 10);
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
};

// postKey根据帖子id快速排序
const postIdSort = (list: any[], left: number, right: number) => {
    console.log('sort in!!!!!!!!!!!!!!!!!', { left, right });
    if (left > right) return;
    let i = left;
    let j = right;
    const temp = list[i];
    if (i < j) {
        while (i < j && list[j].id > temp.id) {
            j --;
        }
        list[i] = list[j];
        while (i < j && list[i].id < temp.id) {
            i ++;
        }
        list[j] = list[i];
    }
    list[i] = temp;
    postIdSort(list, left, i - 1);
    postIdSort(list, i + 1, right);
};

// postKey根据帖子热度快速排序
const postHotSort = (list: any[], left: number, right: number) => {
    if (left > right) return;
    let i = left;
    let j = right;
    const temp = list[i];
    console.log('likeCount!!!!!!!!!!!!!!!!!', temp.likeCount);
    if (i < j) {
        while (i < j && ((list[j].likeCount + list[j].commentCount) <= (temp.likeCount + temp.commentCount))) {
            j --;
        }
        list[i] = list[j];
        while (i < j && ((list[i].likeCount + list[i].commentCount) > (temp.likeCount + temp.commentCount))) {
            i ++;
        }
        list[j] = list[i];
    }
    list[i] = temp;
    postHotSort(list, left, i - 1);
    postHotSort(list, i + 1, right);
};

// 获取1970年1月1日距今的时间(单位：天)
export const get_day  = (timestamps: number):number => {
    const time = timestamps + 28800000;
    console.log('timestamps !!!!!!!!!!!!!!!', time);

    return Math.floor(time / (1000 * 60 * 60 * 24));
};