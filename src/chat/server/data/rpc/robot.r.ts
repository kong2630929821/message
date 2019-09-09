/**
 * 虚拟用户模块
 */
import { randomInt } from '../../../../pi/util/math';
import { sleep } from '../../../../pi_pt/rust/pi_serv/js_base';
import { Bucket } from '../../../utils/db';
import { genNewIdFromOld } from '../../../utils/util';
import * as CONSTANT from '../constant';
import { CommentKey, CommunityAccIndex, Post, PostKey } from '../db/community.s';
import { AddCommonComment, AddRobotArg, CommonComment, PostRobotNum, RobotActiveSwitch, RobotIndex, UserWeiboInfo, WeiboInfo } from '../db/robot.s';
import { AccountGenerator } from '../db/user.s';
import * as http from '../http_client';
import { getIndexID } from '../util';
import { registerUser } from './basic.r';
import { UserRegister } from './basic.s';
import { addComment, addPost, get_day, getPostInfo, postLaud } from './community.r';
import { AddCommentArg, AddPostArg, PostData } from './community.s';
import { changeUserInfo } from './user.r';
import { UserChangeInfo } from './user.s';

/**
 * 选取指定用户，从该用户的粉丝列表中获取指定数量符合条件的用户作为机器人
 */
// #[rpc=rpcServer]
export const getRobotUserInfo = (arg: AddRobotArg): number => {
    console.log('getRobotUserInfo', arg);
    if (arg && arg.list.length > 0) {
        const robotIndexBucket = new Bucket(CONSTANT.WARE_NAME, RobotIndex._$info.name);
        for (let i = 0; i < arg.list.length; i++) {
            const robotInfo = arg.list[i];
            const robotId = getRobotId();
            console.log('robotId!!!!!!!!!!!!', robotId);
            // 注册用户聊天账号
            const userRegister = new UserRegister();
            userRegister.name = robotInfo.name;
            userRegister.passwdHash = `robot${robotId}`;
            const userInfo = registerUser(userRegister);
            const userChangeInfo = new UserChangeInfo();
            userChangeInfo.name = robotInfo.avatar;
            userChangeInfo.sex = robotInfo.sex;
            userChangeInfo.acc_id = '';
            userChangeInfo.note = '';
            userChangeInfo.tel = '';
            userChangeInfo.wallet_addr = '';
            changeUserInfo(userChangeInfo);
            console.log('userInfo!!!!!!!!!!!!', userInfo);
            // 添加机器人id索引
            const robotIndex = new RobotIndex();
            robotIndex.rid = robotId;
            robotIndex.uid = userInfo.uid;
            robotIndex.wuid = arg.list[i].weibo_id;
            robotIndexBucket.put(robotId, robotIndex);
        }
    }

    return 1;
};

/**
 * 开启虚拟用户活动
 */
// #[rpc=rpcServer]
export const startRobot = (active: string): boolean => {
    const RobotActiveSwitchBucket = new Bucket(CONSTANT.WARE_NAME, RobotActiveSwitch._$info.name);
    const robotActiveSwitch = new RobotActiveSwitch();
    robotActiveSwitch.name = active;
    robotActiveSwitch.state = 1;
    RobotActiveSwitchBucket.put(active, robotActiveSwitch);
    robotActive();
    
    return true;
};

/**
 * 关闭虚拟用户活动
 */
// #[rpc=rpcServer]
export const closeRobot = (active: string): boolean => {
    const RobotActiveSwitchBucket = new Bucket(CONSTANT.WARE_NAME, RobotActiveSwitch._$info.name);
    const robotActiveSwitch = new RobotActiveSwitch();
    robotActiveSwitch.name = active;
    robotActiveSwitch.state = 0;
    RobotActiveSwitchBucket.put(active, robotActiveSwitch);
    
    return true;
};

/**
 * 添加通用评论
 */
// #[rpc=rpcServer]
export const addCommonCommernt = (arg: AddCommonComment): boolean => {
    console.log('addCommonCommernt', arg);
    const commonCommentBucket = new Bucket(CONSTANT.WARE_NAME, CommonComment._$info.name);
    const commentList = arg.list;
    if (commentList.length > 0) {
        for (let i = 0; i < commentList.length; i++) {
            commonCommentBucket.put(commentList[i].msg, commentList[i]);
        }
    } else {
        return false;
    }

    return true;
};

// 虚拟用户行为
export const robotActive = () => {
    console.log('!!!!!!!!!!!!robotActive:');
    const RobotActiveSwitchBucket = new Bucket(CONSTANT.WARE_NAME, RobotActiveSwitch._$info.name);
    const robotActiveSwitch = RobotActiveSwitchBucket.get<string, RobotActiveSwitch[]>('all')[0];
    const indexBucket = new Bucket(CONSTANT.WARE_NAME, AccountGenerator._$info.name);
    const postRobotNumBucket = new Bucket(CONSTANT.WARE_NAME, PostRobotNum._$info.name);
    console.log('!!!!!!!!!!!!robotActiveSwitch:', robotActiveSwitch);
    if (!robotActiveSwitch || robotActiveSwitch.state === 0) return false;
    // 随机获取虚拟用户id
    const accountGenerator = indexBucket.get<string, AccountGenerator[]>('robot')[0];
    console.log('!!!!!!!!!!!!accountGenerator:', accountGenerator);
    if (!accountGenerator) return false;
    const robotMaxId = accountGenerator.currentIndex;
    const robotId = randomInt(1, robotMaxId);
    const robotIndexBucket = new Bucket(CONSTANT.WARE_NAME, RobotIndex._$info.name);
    const robotIndex = robotIndexBucket.get<number, RobotIndex[]>(robotId)[0];
    console.log('!!!!!!!!!!!!robotIndex:', robotIndex);
    if (!robotIndex) return false;
    // 获取用户社区号
    const communityAccIndexBucket = new Bucket(CONSTANT.WARE_NAME, CommunityAccIndex._$info.name);
    const communityAccIndex =  communityAccIndexBucket.get<number, CommunityAccIndex[]>(robotIndex.uid)[0];
    console.log('!!!!!!!!!!!!communityAccIndex:', communityAccIndex);
    if (!communityAccIndex) return false;
    const num = communityAccIndex.num;
    // 随机选取虚拟用户行为 0发帖 1评论 2,3,4,5点赞
    // TODO 可设置行为权重
    const activeId = randomInt(0, 5);
    // const activeId = 0;
    let r = true;
    if (activeId === 0) {
        r = robotPost(robotIndex, num);
    } else {
        // 遍历最近的帖子 随机从最近n条帖子选择一条
        const postBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
        const iter = postBucket.iter(null, false);
        let count = randomInt(0, CONSTANT.LAST_POST_NUM);
        do {
            const v = iter.next();
            console.log('!!!!!!!!!!!!post:', v);
            if (!v) break;
            if (count < 0) break;
            const post:Post = v[1];
            const postRobotNum = postRobotNumBucket.get<PostKey, PostRobotNum[]>(post.key)[0];
            if (postRobotNum && postRobotNum.count >= CONSTANT.MAX_POST_ROBOTS) break; // 帖子下虚拟用户人数超过限制 
            if (post.state === CONSTANT.DELETE_STATE) continue;
            if (activeId < 2) { // 点赞
                r = robotLaud(robotIndex, post.key);
            } else { // 评论
                r = robotComment(robotIndex, post.key);
            }
            count --;
        } while (iter);
        console.log('!!!!!!!!!!!!next loop:');
    }
    const timeout = randomInt(1 * 60 * 1000, 3 * 60 * 1000);
    setTimeout(() => { 
        robotActive();
    }, timeout);
};

// 虚拟用户发帖
const robotPost = (robotIndex: RobotIndex, num: string): boolean => {
    console.log('!!!!!!!!!!!!robotPost:', robotIndex);
    const weiboInfoBucket = new Bucket(CONSTANT.WARE_NAME, WeiboInfo._$info.name);
    const userWeiboInfoBucket = new Bucket(CONSTANT.WARE_NAME, UserWeiboInfo._$info.name);
    let userWeiboInfo = userWeiboInfoBucket.get<number, UserWeiboInfo[]>(robotIndex.rid)[0];
    // 不存在微博数据 爬取用户微博
    if (!userWeiboInfo) {
        getRobotWeiboInfo(robotIndex.rid);
    }
    userWeiboInfo = userWeiboInfoBucket.get<number, UserWeiboInfo[]>(robotIndex.rid)[0];
    console.log('!!!!!!!!!!!!userWeiboInfo:', userWeiboInfo);
    if (userWeiboInfo.weibo_list.length === 0) return false;
    // 发送动态
    const wid = userWeiboInfo.weibo_list[0]; // 最新的微博
    const weiboInfo = weiboInfoBucket.get<string, WeiboInfo[]>(wid)[0];
    if (!weiboInfo) return false;
    const value = {
        msg:weiboInfo.content,
        imgs:weiboInfo.imgs
    };
    const postArg = new AddPostArg();
    postArg.title = '';
    postArg.num = num;
    postArg.body = JSON.stringify(value);
    postArg.post_type = 0;
    const key = new PostKey();
    key.num = num;
    key.id = getIndexID(CONSTANT.POST_INDEX, 1);
    addPost(robotIndex.uid, postArg, key);
    // 微博已使用从userWeiboInfo中删除
    userWeiboInfo.weibo_list.splice(0, 1);
    userWeiboInfoBucket.put(robotIndex.rid, userWeiboInfo);

    return true;
};

// 虚拟用户点赞
const robotLaud = (robotIndex: RobotIndex, postKey: PostKey): boolean => {
    const postRobotNumBucket = new Bucket(CONSTANT.WARE_NAME, PostRobotNum._$info.name);
    let postRobotNum = postRobotNumBucket.get<PostKey, PostRobotNum[]>(postKey)[0];
    if (!postRobotNum) {
        postRobotNum = new PostRobotNum();
        postRobotNum.post_key = postKey;
        postRobotNum.count = 0;
    }
    postRobotNum.count += 1;
    // 增加帖子下虚拟用户人数
    postRobotNumBucket.put(postKey, postRobotNum);

    console.log('!!!!!!!!!!!!robotLaud:', postKey);
    
    return postLaud(robotIndex.uid, postKey);
};

// 虚拟用户评论
const robotComment = (robotIndex: RobotIndex, postKey: PostKey): boolean => {
    console.log('!!!!!!!!!!!!robotComment:', postKey);
    const addCommentArg = new AddCommentArg();
    // 遍历通用评论表
    const commonCommentBucket = new Bucket(CONSTANT.WARE_NAME, CommonComment._$info.name);
    const iter = commonCommentBucket.iter(null, false);
    // let count = randomInt(0, CONSTANT.LAST_POST_NUM);
    console.log('!!!!!!!!!!!!showPostPort iter:', iter);
    const comment_list = [];
    do {
        const v = iter.next();
        console.log('!!!!!!!!!!!!post:', v);
        if (!v) break;
        const comment:CommonComment = v[1];
        for (let i = 0; i < comment.weight; i++) {
            // 根据权重添加多个相同的评论内容到数组,再随机获取数组的角标来达到根据权重获取的效果
            comment_list.push(comment.msg);
        }       
    } while (iter);
    const max = comment_list.length;
    addCommentArg.msg = comment_list[randomInt(0, max)];
    addCommentArg.comment_type = 0; 
    addCommentArg.num = postKey.num;
    addCommentArg.post_id = postKey.id;
    addCommentArg.reply = 0; 
    // 增加帖子下虚拟用户人数
    const postRobotNumBucket = new Bucket(CONSTANT.WARE_NAME, PostRobotNum._$info.name);
    let postRobotNum = postRobotNumBucket.get<PostKey, PostRobotNum[]>(postKey)[0];
    if (!postRobotNum) {
        postRobotNum = new PostRobotNum();
        postRobotNum.post_key = postKey;
        postRobotNum.count = 0;
    }
    postRobotNum.count += 1;
    postRobotNumBucket.put(postKey, postRobotNum);
    addComment(robotIndex.uid, addCommentArg);

    return true;
};

// 获取虚拟用户id
const getRobotId = () : number => {
    const indexBucket = new Bucket(CONSTANT.WARE_NAME, AccountGenerator._$info.name);
    let accountGenerator = indexBucket.get<string, AccountGenerator[]>('robot')[0];
    if (!accountGenerator) {
        accountGenerator = new AccountGenerator();
        accountGenerator.index = 'robot';
        accountGenerator.currentIndex = 0;
    }
    accountGenerator.currentIndex += 1;
    indexBucket.put('robot', accountGenerator);

    return accountGenerator.currentIndex;
};

// 获取指定虚拟用户的微博信息
// #[rpc=rpcServer]
export const getRobotWeiboInfo = (rid: number) => {
    const robotIndexBucket = new Bucket(CONSTANT.WARE_NAME, RobotIndex._$info.name);
    const robotIndex = robotIndexBucket.get<number, RobotIndex[]>(rid)[0];
    const wuid = robotIndex.wuid;
    const src = `${CONSTANT.WEIBO_SPIDER_HOST}${CONSTANT.SPIDER_WEIBO_INFO}?user_id=${wuid}`;
    console.log('=========Start scrapy weibo info!==========');
    const client = http.createClient();
    const param: any = { user_id: wuid };
    const r = http.http_get(client, src, param);
    if (r.ok) {
        try {
            const info = JSON.parse(r.ok);
            let weibo_infos = info.weibo_list;
            // console.log('weibo_infos =====',weibo_infos);
            // 数据清洗
            weibo_infos = weiboDataFilter(weibo_infos, rid);
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
    
};

// 微博数据清洗并写入数据库
export const weiboDataFilter = (weibo_infos: any, rid: number): any => {
    const weiboInfoBucket = new Bucket(CONSTANT.WARE_NAME, WeiboInfo._$info.name);
    const userWeiboInfoBucket = new Bucket(CONSTANT.WARE_NAME, UserWeiboInfo._$info.name);
    const userWeiboInfo = new UserWeiboInfo();
    userWeiboInfo.rid = rid;
    userWeiboInfo.weibo_list = [];
    for (let i = 0; i < weibo_infos.length; i++) {
        // 微博发布类型筛选
        if (weiboTypeFilter(weibo_infos[i].publish_tool)) {
            console.log('delete by publish_tool =====',weibo_infos[i].publish_tool);
            weibo_infos.splice(i, 1);
            i --;
            continue;
        }
        // 微博内容数据清洗
        const weiboInfo = new WeiboInfo();
        weibo_infos[i].content = weiboMsgFilter(weibo_infos[i].content);
        // 微博图片url更改为爬虫服务器(图片由爬虫服务器下载)
        if (weibo_infos[i].original_pictures !== '无') {
            const publish_time = weibo_infos[i].publish_time;
            const date = publish_time.split(' ')[0];
            console.log('publish_time =====',date);
            const date1 = date.split('-');
            if (date1.length === 3) {
                const file_prefix = `${date1[0]}${date1[1]}${date1[2]}_${weibo_infos[i].id}`;
                const origin_urls = weibo_infos[i].original_pictures.split(',');
                if (origin_urls.length > 1) {
                    // 图片命名规则：日期+微博id 
                    let file_prefixs = `${CONSTANT.WEIBO_SPIDER_HOST}${CONSTANT.SPIDER_WEIBO_IMG}${file_prefix}_1.jpg`;
                    for (let index = 1; index < origin_urls.length; index++) {
                        file_prefixs = `${file_prefixs},${file_prefix}_${index + 1}.jpg`;
                    }
                    weibo_infos[i].original_pictures = file_prefixs;
                } else {
                    weibo_infos[i].original_pictures = `${CONSTANT.WEIBO_SPIDER_HOST}${CONSTANT.SPIDER_WEIBO_IMG}${file_prefix}.jpg`;
                }
            }
            weiboInfo.imgs = weibo_infos[i].original_pictures.split(',');
        } else {
            weiboInfo.imgs = [];
        }
        // 写入数据库
        weiboInfo.wid = weibo_infos[i].id;
        weiboInfo.rid = rid;
        weiboInfo.content = weibo_infos[i].content;
        weiboInfo.publish_tool = weibo_infos[i].publish_tool;
        weiboInfo.time = new Date(weibo_infos[i].publish_time).getTime().toString();
        console.log('weiboInfo =====',weiboInfo);
        weiboInfoBucket.put(weiboInfo.wid, weiboInfo);
        userWeiboInfo.weibo_list.push(weiboInfo.wid);
        console.log('userWeiboInfo111111111111 =====',userWeiboInfo);
    }
    console.log('userWeiboInfo2222222222 =====',userWeiboInfo);
    userWeiboInfoBucket.put(rid, userWeiboInfo);

    return weibo_infos;
};

// 微博发布类型筛选
export const weiboTypeFilter = (weibo_type: string): boolean => {
    if (weibo_type.indexOf('微博') >= 0) return true;
    if (weibo_type.indexOf('活动') >= 0) return true;
    switch (weibo_type) {
        case 'ShareSDK':
            return true;
        default:
            return false;
    }
};

// 微博内容数据清洗
export const weiboMsgFilter = (msg: string): string => {
    // 去除多余文字
    msg = msg.replace(/原图+/g, '');
    msg = msg.replace(/\[组图.*?张\]+/g, '');
    msg = msg.replace(/显示地图+/g, '');
    // 去除所有空格:
    msg = msg.replace(/\s+/g, '');

    return msg;
};