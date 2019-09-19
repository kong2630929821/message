/**
 * 虚拟用户模块
 */
import { randomInt } from '../../../../pi/util/math';
import { sleep } from '../../../../pi_pt/rust/pi_serv/js_base';
import { Bucket } from '../../../utils/db';
import { genNewIdFromOld } from '../../../utils/util';
import * as CONSTANT from '../constant';
import { CommentKey, CommunityAccIndex, Post, PostKey } from '../db/community.s';
import { AddRobotArg, CommonComment, CommonCommentList, DailyRobotCount, PostRobotNum, RobotActiveSet, RobotActiveSwitch, RobotIndex, UserWeiboInfo, WeiboInfo } from '../db/robot.s';
import { AccountGenerator, UserInfo, VIP_LEVEL } from '../db/user.s';
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
            const newUserInfo = changeUserInfo(userChangeInfo);
            console.log('userInfo!!!!!!!!!!!!', userInfo);
            // 添加机器人标签
            const userInfoBucket = new Bucket(CONSTANT.WARE_NAME, UserInfo._$info.name);
            newUserInfo.level = VIP_LEVEL.VIP4;
            userInfoBucket.put(newUserInfo.uid, newUserInfo);
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
    initRobotSet();
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
export const addCommonCommernt = (arg: CommonCommentList): boolean => {
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

/**
 * 获取通用评论
 */
// #[rpc=rpcServer]
export const getCommonCommernt = (): string => {
    const commonCommentBucket = new Bucket(CONSTANT.WARE_NAME, CommonComment._$info.name);
    const iter = commonCommentBucket.iter(null, true);
    const commonCommentList = new CommonCommentList();
    commonCommentList.list = [];
    do {
        const v = iter.next();
        if (!v) break;
        const comment:CommonComment = v[1];
        commonCommentList.list.push(comment);
    } while (iter);

    return JSON.stringify(commonCommentList);
};

/**
 * 获取机器人行为设置
 */
// #[rpc=rpcServer]
export const getRobotSet = (active: string): string => {
    const robotActiveSetBucket = new Bucket(CONSTANT.WARE_NAME, RobotActiveSet._$info.name);
    const robotActiveSet = robotActiveSetBucket.get<string, RobotActiveSet[]>(active)[0];

    return JSON.stringify(robotActiveSet);
};

/**
 * 修改机器人行为设置
 */
// #[rpc=rpcServer]
export const modifyRobotSet = (activetSet: RobotActiveSet): boolean => {
    const robotActiveSetBucket = new Bucket(CONSTANT.WARE_NAME, RobotActiveSet._$info.name);

    return robotActiveSetBucket.put(activetSet.active, activetSet);
};

// 初始化机器人行为配置
// #[rpc=rpcServer]
export const initRobotSet = (): boolean => {
    const robotActiveSetBucket = new Bucket(CONSTANT.WARE_NAME, RobotActiveSet._$info.name);
    let robotPostSet = robotActiveSetBucket.get<string, RobotActiveSet[]>(CONSTANT.ROBOT_ACTIVE_POST)[0];
    if (!robotPostSet) {
        robotPostSet = new RobotActiveSet();
        robotPostSet.active = CONSTANT.ROBOT_ACTIVE_POST;
        robotPostSet.min_time = 5 * 60 * 1000;
        robotPostSet.max_time = 10 * 60 * 1000;
        robotPostSet.post_user_limit = 5;
        robotPostSet.daily_limit = 10;
        robotPostSet.weight = 1;
    }
    robotActiveSetBucket.put(CONSTANT.ROBOT_ACTIVE_POST, robotPostSet);
    let robotCommentSet = robotActiveSetBucket.get<string, RobotActiveSet[]>(CONSTANT.ROBOT_ACTIVE_COMMENT)[0];
    if (!robotCommentSet) {
        robotCommentSet = new RobotActiveSet();
        robotCommentSet.active = CONSTANT.ROBOT_ACTIVE_COMMENT;
        robotCommentSet.min_time = 5 * 60 * 1000;
        robotCommentSet.max_time = 10 * 60 * 1000;
        robotCommentSet.post_user_limit = 5;
        robotCommentSet.daily_limit = 20;
        robotCommentSet.weight = 1;
    }
    robotActiveSetBucket.put(CONSTANT.ROBOT_ACTIVE_COMMENT, robotCommentSet);
    let robotLaudSet = robotActiveSetBucket.get<string, RobotActiveSet[]>(CONSTANT.ROBOT_ACTIVE_LAUD)[0];
    if (!robotLaudSet) {
        robotLaudSet = new RobotActiveSet();
        robotLaudSet.active = CONSTANT.ROBOT_ACTIVE_LAUD;
        robotLaudSet.min_time = 5 * 60 * 1000;
        robotLaudSet.max_time = 10 * 60 * 1000;
        robotLaudSet.post_user_limit = 5;
        robotLaudSet.daily_limit = 20;
        robotLaudSet.weight = 1;
    }
    robotActiveSetBucket.put(CONSTANT.ROBOT_ACTIVE_LAUD, robotLaudSet);

    return true;
};

// 虚拟用户行为
export const robotActive = () => {
    console.log('!!!!!!!!!!!!robotActive:');
    const RobotActiveSwitchBucket = new Bucket(CONSTANT.WARE_NAME, RobotActiveSwitch._$info.name);
    const robotActiveSwitch = RobotActiveSwitchBucket.get<string, RobotActiveSwitch[]>('all')[0];
    console.log('!!!!!!!!!!!!robotActiveSwitch:', robotActiveSwitch);
    if (!robotActiveSwitch || robotActiveSwitch.state === 0) return false;
    // 随机获取虚拟用户id
    const robotIndex = getRandomRobot();
    if (!robotIndex) return false;
    // 获取用户社区号
    const num = getRobotCommNum(robotIndex.uid);
    if (!num) return false;
    // 根据设置的权重随机虚拟用户行为
    const weightList = getActiveWeight();
    const postWeight = weightList[0];
    const commentWeight = weightList[1];
    const laudWeight = weightList[2];
    // 所有行为权重都为0时关闭机器人
    if (postWeight === 0 && commentWeight === 0 && laudWeight === 0) return false;
    const activeId = randomInt(1, postWeight + commentWeight + laudWeight);
    console.log('!!!!!!!!!!!!activeId:', activeId, postWeight);
    if (activeId >= 1 && activeId <= postWeight) {
        // 发帖
        robotPost(robotIndex, num);
    } else if (activeId >= (postWeight + 1) && activeId <= (postWeight + commentWeight)) {
        // 评论 判断是否超过当天评论上限
        if (checkRobotActiveCount(CONSTANT.ROBOT_ACTIVE_COMMENT)) {
            const postKey = getRandomPost(CONSTANT.ROBOT_ACTIVE_COMMENT);
            if (postKey) robotComment(robotIndex, postKey);
        }
    } else if (activeId >= (postWeight + commentWeight + 1) && activeId <= (postWeight + commentWeight + laudWeight)) {
        // 点赞
        if (checkRobotActiveCount(CONSTANT.ROBOT_ACTIVE_LAUD)) {
            const postKey = getRandomPost(CONSTANT.ROBOT_ACTIVE_LAUD);
            if (postKey) robotLaud(robotIndex, postKey);
        }
    }
    const timeout = getRandomTime(CONSTANT.ROBOT_ACTIVE_ALL);
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
    console.log('!!!!!!!!!!!!userWeiboInfo:', robotIndex.rid, userWeiboInfo);
    if (!userWeiboInfo || userWeiboInfo.weibo_list.length === 0) return false;
    // 发送动态
    const wid = userWeiboInfo.weibo_list[0]; // 最新的微博
    const weiboInfo = weiboInfoBucket.get<string, WeiboInfo[]>(wid)[0];
    if (!weiboInfo) return false;
    const value: any = {
        msg: '',
        imgs: []
    };
    value.msg = weiboInfo.content;
    for (let i = 0; i < weiboInfo.imgs.length; i++) {
        const Image = {
            compressImg: '',
            originalImg: ''
        };
        Image.compressImg = weiboInfo.imgs[i];
        Image.originalImg = weiboInfo.imgs[i];
        value.imgs.push(Image);
    }
    const postArg = new AddPostArg();
    postArg.title = '';
    postArg.num = num;
    postArg.body = JSON.stringify(value);
    postArg.post_type = 0;
    const key = new PostKey();
    key.num = num;
    key.id = getIndexID(CONSTANT.POST_INDEX, 1);
    addPost(robotIndex.uid, postArg, key, CONSTANT.COMMUNITY_TYPE_PERSON);
    // 添加当天行为统计
    addDailyCount(CONSTANT.ROBOT_ACTIVE_POST);
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
        postRobotNum.comment_count = 0;
        postRobotNum.laud_count = 0;
    }
    postRobotNum.laud_count += 1;
    // 增加帖子下虚拟用户人数
    postRobotNumBucket.put(postKey, postRobotNum);
    addDailyCount(CONSTANT.ROBOT_ACTIVE_LAUD);

    console.log('!!!!!!!!!!!!robotLaud:', postKey);
    
    return postLaud(robotIndex.uid, postKey);
};

// 虚拟用户评论
const robotComment = (robotIndex: RobotIndex, postKey: PostKey): boolean => {
    console.log('!!!!!!!!!!!!robotComment:', postKey);
    const addCommentArg = new AddCommentArg();
    // 遍历通用评论表
    const commonCommentBucket = new Bucket(CONSTANT.WARE_NAME, CommonComment._$info.name);
    const iter = commonCommentBucket.iter(null, true);
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
    const value = {
        msg:comment_list[randomInt(0, max - 1)],
        img:''
    };
    addCommentArg.msg = JSON.stringify(value);
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
        postRobotNum.comment_count = 0;
        postRobotNum.laud_count = 0;
    }
    postRobotNum.comment_count += 1;
    postRobotNumBucket.put(postKey, postRobotNum);
    addDailyCount(CONSTANT.ROBOT_ACTIVE_COMMENT);
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
            const date1 = date.split('-');
            console.log('publish_time =====',date1);
            if (date1.length === 3) {
                const file_prefix = `${CONSTANT.WEIBO_SPIDER_HOST}${CONSTANT.SPIDER_WEIBO_IMG}${date1[0]}${date1[1]}${date1[2]}_${weibo_infos[i].id}`;
                console.log('origin_urls =====', weibo_infos[i].original_pictures);
                const origin_urls = weibo_infos[i].original_pictures;
                if (typeof(origin_urls) === 'object' && origin_urls.length > 1) {
                    // 图片命名规则：日期+微博id 
                    let file_prefixs = `${CONSTANT.WEIBO_SPIDER_HOST}${CONSTANT.SPIDER_WEIBO_IMG}${file_prefix}_1.jpg`;
                    console.log('file_prefixs =====',file_prefixs);
                    for (let index = 1; index < origin_urls.length; index++) {
                        file_prefixs = `${file_prefixs},${file_prefix}_${index + 1}.jpg`;
                    }
                    weibo_infos[i].original_pictures = file_prefixs;
                } else {
                    weibo_infos[i].original_pictures = `${file_prefix}.jpg`;
                }
                console.log('origin_urls22222222222222222 =====', weibo_infos[i].original_pictures);
            }
            weiboInfo.imgs = weibo_infos[i].original_pictures.split(',');
            console.log(' weiboInfo.imgs =====', weiboInfo.imgs);
        } else {
            weiboInfo.imgs = [];
        }
        // 写入数据库
        weiboInfo.wid = weibo_infos[i].id;
        weiboInfo.rid = rid;
        weiboInfo.content = weibo_infos[i].content;
        weiboInfo.publish_tool = weibo_infos[i].publish_tool;
        weiboInfo.time = new Date(weibo_infos[i].publish_time).getTime().toString();
        weiboInfoBucket.put(weiboInfo.wid, weiboInfo);
        userWeiboInfo.weibo_list.push(weiboInfo.wid);
        console.log('userWeiboInfo111111111111 =====',userWeiboInfo);
    }
    console.log('userWeiboInfo2222222222 =====',userWeiboInfo);
    userWeiboInfoBucket.put(rid, userWeiboInfo);

    return weibo_infos;
};

// 获取随机虚拟用户id索引
export const getRandomRobot = (): RobotIndex => {
    const indexBucket = new Bucket(CONSTANT.WARE_NAME, AccountGenerator._$info.name);
    // 随机获取虚拟用户id
    const accountGenerator = indexBucket.get<string, AccountGenerator[]>('robot')[0];
    console.log('!!!!!!!!!!!!accountGenerator:', accountGenerator);
    if (!accountGenerator) return;
    const robotMaxId = accountGenerator.currentIndex;
    const robotId = randomInt(1, robotMaxId);
    const robotIndexBucket = new Bucket(CONSTANT.WARE_NAME, RobotIndex._$info.name);

    return robotIndexBucket.get<number, RobotIndex[]>(robotId)[0];
};

// 获取虚拟用户社区号
export const getRobotCommNum = (uid: number): string => {
    const communityAccIndexBucket = new Bucket(CONSTANT.WARE_NAME, CommunityAccIndex._$info.name);
    const communityAccIndex =  communityAccIndexBucket.get<number, CommunityAccIndex[]>(uid)[0];
    console.log('!!!!!!!!!!!!communityAccIndex:', communityAccIndex);
    if (!communityAccIndex) return;
    
    return communityAccIndex.num;
};

// 获取随机活动时间
export const getRandomTime = (active_type: string): number => {
    const robotActiveSetBucket = new Bucket(CONSTANT.WARE_NAME, RobotActiveSet._$info.name);
    const robotActiveSet = robotActiveSetBucket.get<string, RobotActiveSet[]>(active_type)[0];
    if (!robotActiveSet) {
        return randomInt(5 * 60 * 1000, 10 * 60 * 1000);
    }
    
    return randomInt(robotActiveSet.min_time, robotActiveSet.max_time);
};

// 获取所有虚拟用户行为权重
export const getActiveWeight = (): number[] => {
    const robotActiveSetBucket = new Bucket(CONSTANT.WARE_NAME, RobotActiveSet._$info.name);
    const robotPostSet = robotActiveSetBucket.get<string, RobotActiveSet[]>(CONSTANT.ROBOT_ACTIVE_POST)[0];
    const robotCommentSet = robotActiveSetBucket.get<string, RobotActiveSet[]>(CONSTANT.ROBOT_ACTIVE_COMMENT)[0];
    const robotLaudSet = robotActiveSetBucket.get<string, RobotActiveSet[]>(CONSTANT.ROBOT_ACTIVE_LAUD)[0];

    return [robotPostSet.weight, robotCommentSet.weight, robotLaudSet.weight];
};

// 获取设定机器人行为类型设定时间范围的随机帖子
export const getRandomPost = (active: string): PostKey => {
    const robotActiveSetBucket = new Bucket(CONSTANT.WARE_NAME, RobotActiveSet._$info.name);
    const postRobotNumBucket = new Bucket(CONSTANT.WARE_NAME, PostRobotNum._$info.name);
    const robotActiveSet = robotActiveSetBucket.get<string, RobotActiveSet[]>(active)[0];
    const postBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
    const iter = postBucket.iter(null, true);
    const postList = [];
    // 遍历最新的帖子
    do {
        const v = iter.next();
        if (!v) break;
        const post:Post = v[1];
        const postRobotNum = postRobotNumBucket.get<PostKey, PostRobotNum[]>(post.key)[0];
        // 判断帖子下面的用户数量是否超过上限
        if (!postRobotNum) {
            postList.push(post.key);
            continue;
        }
        let postRobotCount = 0;
        if (active === CONSTANT.ROBOT_ACTIVE_LAUD) postRobotCount = postRobotNum.laud_count;
        if (active === CONSTANT.ROBOT_ACTIVE_COMMENT) postRobotCount = postRobotNum.comment_count;
        if (postRobotCount >= robotActiveSet.post_user_limit) continue; // 帖子下虚拟用户人数超过限制 
        if (post.state !== CONSTANT.NORMAL_STATE) continue;
        postList.push(post.key);
    } while (iter);
    if (postList.length === 0) return;
    const index = randomInt(0, postList.length - 1);
    
    return postList[index];
};

// 判断机器人行为是否达到当天评论上限
export const checkRobotActiveCount = (active: string): boolean => {
    const robotActiveSetBucket = new Bucket(CONSTANT.WARE_NAME, RobotActiveSet._$info.name);
    const robotActiveSet = robotActiveSetBucket.get<string, RobotActiveSet[]>(active)[0];
    const dailyRobotCountBucket = new Bucket(CONSTANT.WARE_NAME, DailyRobotCount._$info.name);
    const dailyRobotCount = dailyRobotCountBucket.get<string, DailyRobotCount[]>(`${get_day(Date.now())}:${active}`)[0];
    if (!dailyRobotCount) return true;
    if (dailyRobotCount.count < robotActiveSet.daily_limit) {
        return true;
    } else {
        return false;
    }
};

// 添加当天虚拟用户行为计数
export const addDailyCount = (active: string): boolean => {
    const dailyRobotCountBucket = new Bucket(CONSTANT.WARE_NAME, DailyRobotCount._$info.name);
    const key = `${get_day(Date.now())}:${active}`;
    let dailyRobotCount = dailyRobotCountBucket.get<string, DailyRobotCount[]>(key)[0];
    if (!dailyRobotCount) {
        dailyRobotCount = new DailyRobotCount();
        dailyRobotCount.key = key;
        dailyRobotCount.count = 0;
    }
    dailyRobotCount.count ++;

    return dailyRobotCountBucket.put(key, dailyRobotCount);
};

// 微博发布类型筛选
export const weiboTypeFilter = (weibo_type: string): boolean => {
    if (weibo_type.indexOf('微博') >= 0) return true;
    if (weibo_type.indexOf('活动') >= 0) return true;
    if (weibo_type.indexOf('任务') >= 0) return true;
    if (weibo_type.indexOf('超话') >= 0) return true;
    if (weibo_type.indexOf('应用') >= 0) return true;
    if (weibo_type.indexOf('生日') >= 0) return true;
    if (weibo_type.indexOf('联通') >= 0) return true;
    if (weibo_type.indexOf('移动') >= 0) return true;
    if (weibo_type.indexOf('电信') >= 0) return true;
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