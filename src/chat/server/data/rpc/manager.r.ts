/**
 * 管理后端
 */

import { getSession } from '../../../../pi_pt/util/autologin.r';
import { Bucket } from '../../../utils/db';
import { add_app, del_app, set_app_config } from '../../../utils/oauth_lib';
import { send } from '../../../utils/send';
import { randomWord } from '../../../utils/util';
import { setSession } from '../../rpc/session.r';
import * as CONSTANT from '../constant';
import { AttentionIndex, Comment, CommentKey, CommunityAccIndex, CommunityBase, CommunityPost, FansIndex, Post, PostCount, PostKey, PublicNameIndex } from '../db/community.s';
import { ApplyPublic, Article, CommunityDetail, HandleApplyPublicArg, handleArticleArg, HandleArticleResult, ManagerPostList, MessageReply, ModifyPunishArg, PostList, PostListArg, PublicApplyData, PublicApplyList, PublicApplyListArg, Punish, PunishArg, PunishCount, PunishData, PunishList, ReportContentInfo, ReportData, ReportDetailListArg, ReportIndex, ReportIndexList, ReportList, ReportListArg, ReportPublicInfo, ReportUserInfo, RootUser, UserApplyPublic, UserReportDetail, UserReportIndex, UserReportIndexList } from '../db/manager.s';
import { Report, ReportCount, ReportListTab, UserReportKeyTab } from '../db/message.s';
import { AccountGenerator, OfficialUsers, UserInfo } from '../db/user.s';
import * as ERROR_NUM from '../errorNum';
import { getIndexID } from '../util';
import { getUserInfoById, getUsersInfo } from './basic.r';
import { GetUserInfoReq, Result } from './basic.s';
import { addPost } from './community.r';
import { AddPostArg, PostData } from './community.s';
import { AddAppArg, MgrUserList, OfficialAccList, OfficialUserInfo, SetAppConfig } from './manager.s';
import { getReportListR } from './message.s';
import { getRealUid, sendFirstWelcomeMessage, setOfficialAccount } from './user.r';
import { SetOfficial } from './user.s';

/**
 * 创建管理员
 * 账号格式为 xx@xx表示公众号用户 "number":为好嗨客服
 */
// #[rpc=rpcServer]
export const createRoot = (user: RootUser): number => {
    const rootUserBucket = new Bucket(CONSTANT.WARE_NAME, RootUser._$info.name);
    if (user.user && user.pwd) {
        rootUserBucket.put(user.user, user);

        return CONSTANT.RESULT_SUCCESS;
    } else {
        return CONSTANT.DEFAULT_ERROR_NUMBER;
    }
};

/**
 * 修改密码
 */
// #[rpc=rpcServer]
export const mdfPwd = (user: RootUser): number => {
    const rootUserBucket = new Bucket(CONSTANT.WARE_NAME, RootUser._$info.name);
    if (user.user && user.pwd) {
        if (rootUserBucket.get(user.user)[0]) {
            rootUserBucket.put(user.user, user);

            return CONSTANT.RESULT_SUCCESS;
        }
    } else {

        return CONSTANT.DEFAULT_ERROR_NUMBER;
    }
};

/**
 * 获取所有用户
 */
// #[rpc=rpcServer]
export const showUsers = (arg: string): MgrUserList => {
    const userList = new MgrUserList();
    userList.list = [];
    const rootUserBucket = new Bucket(CONSTANT.WARE_NAME, RootUser._$info.name);
    const iter = rootUserBucket.iter(null, true);
    const publicApplyList = new PublicApplyList();
    publicApplyList.list = [];
    publicApplyList.total = 0;
    do {
        const v = iter.next();
        if (!v) break;
        const rootUser: RootUser = v[1];
        rootUser.pwd = '******';
        userList.list.push(rootUser);
    } while (iter);

    return userList;
};

/**
 * 设置好嗨客服
 */
// #[rpc=rpcServer]
export const createHighAcc = (user: RootUser): number => {
    const r:Result = setOfficialAccount(user.user, CONSTANT.CHAT_APPID);
    if (r.r === CONSTANT.RESULT_SUCCESS) {
        
        return createRoot(user);
    }

    return r.r;
};

/**
 * 设置自动回复消息
 */
// #[rpc=rpcServer]
export const setMsgReply = (arg: MessageReply): number => {
    const messageReplyBucket = new Bucket(CONSTANT.WARE_NAME, MessageReply._$info.name);
    if (messageReplyBucket.put(arg.key, arg)) {
        
        return CONSTANT.RESULT_SUCCESS;
    }

    return CONSTANT.DEFAULT_ERROR_NUMBER;
};

/**
 * 获取自动消息回复
 */
// #[rpc=rpcServer]
export const getMsgReply = (key: string): MessageReply => {
    const messageReplyBucket = new Bucket(CONSTANT.WARE_NAME, MessageReply._$info.name);
    const r = new MessageReply();
    r.key = key;
    r.msg = '';
    const messageReply = messageReplyBucket.get<string, MessageReply>(key)[0];
    if (messageReply) {
        r.msg = messageReply.msg;
    }

    return r;
};

/**
 * 管理员登陆
 */
// #[rpc=rpcServer]
export const rootLogin = (user: RootUser): number => {
    const rootUserBucket = new Bucket(CONSTANT.WARE_NAME, RootUser._$info.name);
    const rootUser = rootUserBucket.get<string, RootUser[]>(user.user)[0];
    if (!rootUser) return ERROR_NUM.DB_ERROR;
    if (rootUser.pwd === user.pwd) {
        // 写入会话
        setSession('root', user.user);
        console.log(getSession('root'));

        return CONSTANT.RESULT_SUCCESS;
    } else {
        return ERROR_NUM.MGR_ERROR_PASSWORD;
    }
};

/**
 * 举报信息列表
 */
// #[rpc=rpcServer]
export const getReportList = (reportArg: ReportListArg): getReportListR => {
    console.log('============getReportList:', reportArg);
    const r = new getReportListR();
    r.msg = '';
    if (!getSession('root')) {
        r.msg = 'not login';

        return r;
    }
    const reportListTabBucket = new Bucket(CONSTANT.WARE_NAME, ReportListTab._$info.name);
    const reportBucket = new Bucket(CONSTANT.WARE_NAME, Report._$info.name);
    const reportCountBucket = new Bucket(CONSTANT.WARE_NAME, ReportCount._$info.name);
    const punishBucket = new Bucket(CONSTANT.WARE_NAME, Punish._$info.name);
    const reportIndexList = new ReportIndexList();
    reportIndexList.list = [];
    const reportListTab = reportListTabBucket.get<number, ReportListTab[]>(reportArg.report_type)[0];
    console.log('============reportListTab:', reportListTab);
    if (!reportListTab) return r;
    console.log('============reportListTab11111111111111:', reportListTab);
    // 获取最近一条举报信息
    for (let i = 0; i < reportListTab.key_list.length; i++) {
        const userReport = reportCountBucket.get<string, ReportCount[]>(reportListTab.key_list[i])[0];
        if (userReport) {
            let reportIds = [];
            if (reportArg.report_state === 0) { // 未处理
                reportIds = userReport.not_handled_reported;
            } else if (reportArg.report_state === 1) { // 已处理
                reportIds = userReport.handled_reported;
            }
            if (reportIds.length > 0) {
                const lastReport = reportBucket.get<number, Report[]>(reportIds[0])[0];
                if (lastReport) {
                    const reportIndex = new ReportIndex();
                    reportIndex.user_name = reportGetUserName(reportArg.report_type, lastReport);
                    reportIndex.last_user_name = getUserInfoById(lastReport.ruid).name;
                    reportIndex.last_time = lastReport.time;
                    reportIndex.last_resaon = lastReport.reason;
                    reportIndex.report_ids = reportIds;
                    const punishCount = getUserPunish(lastReport.key);
                    if (punishCount.now_publish !== 0) {
                        const nowPunish = punishBucket.get<number, Punish[]>(punishCount.now_publish)[0];
                        reportIndex.now_publish = nowPunish;
                    }
                    reportIndexList.list.push(reportIndex);
                }
            }
        }
    }
    r.msg = JSON.stringify(reportIndexList);
    
    return r;
};

/**
 * 获取指定用户被举报详情(已处理)
 */
// #[rpc=rpcServer]
export const getReportDetail = (uid: number): getReportListR => {
    console.log('============getReportList:', uid);
    const r = new getReportListR();
    r.msg = '';
    if (!getSession('root')) {
        r.msg = 'not login';

        return r;
    }
    const userReportKeyTabBucket = new Bucket(CONSTANT.WARE_NAME, UserReportKeyTab._$info.name);
    const reportBucket = new Bucket(CONSTANT.WARE_NAME, Report._$info.name);
    const punishBucket = new Bucket(CONSTANT.WARE_NAME, Punish._$info.name);
    const reportIndexList = new UserReportIndexList();
    reportIndexList.list = [];
    let userReportKey = userReportKeyTabBucket.get<number, UserReportKeyTab[]>(uid)[0];
    if (!userReportKey) {
        userReportKey = new UserReportKeyTab();
        userReportKey.uid = uid;
        userReportKey.key_list = [];
    }
    console.log('============userReportKey:', userReportKey);
    for (let i = 0; i < userReportKey.key_list.length; i++) {
        const report = reportBucket.get<number, Report[]>(userReportKey.key_list[i])[0];
        console.log('============report:', report);
        if (report) {
            const reportIndex = new UserReportIndex();
            reportIndex.reason = report.reason;
            reportIndex.handle_time = report.handle_time;
            if (report.punish_id !== 0) {
                const nowPunish = punishBucket.get<number, Punish[]>(report.punish_id)[0];
                reportIndex.now_publish = nowPunish;
            }
            reportIndexList.list.push(reportIndex);
        }
            
    }
    r.msg = JSON.stringify(reportIndexList);
    
    return r;
};

/**
 * 获取指定举报对象举报详情列表
 */
// #[rpc=rpcServer]
export const getReportDetailList = (arg: ReportDetailListArg): string => {
    console.log('============getReportDetailList:', arg);
    const reportList = new ReportList();
    reportList.list = [];
    for (let i = 0; i < arg.report_ids.length; i++) {
        const reportBucket = new Bucket(CONSTANT.WARE_NAME, Report._$info.name);
        const report = reportBucket.get<number, Report[]>(arg.report_ids[i])[0];
        const reportData = getReportData(report);
        reportList.list.push(reportData);
    }
    console.log('============reportList:', reportList);

    return JSON.stringify(reportList);
};

/**
 * 惩罚指定对象
 */
// #[rpc=rpcServer]
export const punish = (arg: PunishArg): string => {
    if (!getSession('root')) return 'not login';
    // 惩罚类型为0为不惩罚处理 只更新举报状态
    if (arg.punish_type === 0) {
        const punish_id = 0;
        // 更新举报状态
        updateReportInfo(arg.key, punish_id);

        return punish_id.toString();
    }
    let uid = 0;
    const report_type = parseInt(arg.key.split('%')[0], 10);
    if (arg.punish_type === CONSTANT.DELETE_CONTENT) { // 删除内容
        if (report_type === CONSTANT.REPORT_POST || report_type === CONSTANT.REPORT_ARTICLE) {
            const postKey1: PostKey = JSON.parse(arg.key.split('%')[1]);
            const postKey = new PostKey();
            postKey.num = postKey1.num;
            postKey.id = postKey1.id;
            // 删除帖子
            deletePost(postKey);
            const postBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
            const post = postBucket.get<PostKey, Post[]>(postKey)[0];
            if (post) uid = post.owner;
        }
        if (report_type === CONSTANT.REPORT_COMMENT) {
            const commentKey1: CommentKey = JSON.parse(arg.key.split('%')[1]);
            const commentKey = new CommentKey();
            commentKey.id = commentKey1.id;
            commentKey.num = commentKey1.num;
            commentKey.post_id = commentKey1.post_id;
            // 删除评论
            deleteComment(commentKey);
            const commentBucket = new Bucket(CONSTANT.WARE_NAME, Comment._$info.name);
            const comment = commentBucket.get<CommentKey, Comment[]>(commentKey)[0];
            if (comment)  uid = comment.owner;
        }
    }
    if (report_type === CONSTANT.REPORT_PUBLIC) {
        const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME, CommunityBase._$info.name);
        const commNum = arg.key.split('%')[1];
        const communityBase = communityBaseBucket.get<string, CommunityBase[]>(commNum)[0];
        if (communityBase)  uid = communityBase.owner;
    }
    if (report_type === CONSTANT.REPORT_PERSON) {
        uid = parseInt(arg.key.split('%')[1], 10);
    }
    
    // 禁言和禁止发动态只用添加惩罚记录,在发消息时查询有无惩罚记录
    const punishBucket = new Bucket(CONSTANT.WARE_NAME, Punish._$info.name);
    const punish = new Punish();
    punish.id = getIndexId('punish');
    punish.start_time = Date.now().toString();
    punish.end_time = (Date.now() + arg.time).toString();
    punish.punish_type = arg.punish_type;
    punish.state = CONSTANT.PUNISH_LAST;
    punishBucket.put(punish.id, punish);
    const punishCountBucket = new Bucket(CONSTANT.WARE_NAME, PunishCount._$info.name);
    let punishCount = punishCountBucket.get<string, PunishCount[]>(arg.key)[0];
    if (!punishCount) {
        punishCount = new PunishCount();
        punishCount.key = arg.key;
        punishCount.now_publish = 0;
        punishCount.punish_history = [];
    }
    punishCount.now_publish = punish.id;
    punishCountBucket.put(punishCount.key, punishCount);
    // 更新举报状态
    updateReportInfo(arg.key, punish.id);
    // 好嗨客服通知
    const punishStr = getPunishStr(arg.punish_type);
    const timeStr = formatDuring(arg.time);
    sendFirstWelcomeMessage(`您已受到${punishStr}处罚，时长${timeStr}`,uid);
    // 推送惩罚信息
    send(uid, CONSTANT.SEND_PUNISH, JSON.stringify(punish));

    return punish.id.toString();
};

/**
 * 举报受理完成
 */
// #[rpc=rpcServer]
export const reportHandled = (reportKey: string): string => {
    if (!getSession('root')) return 'not login';
    // // 更新举报状态
    // const reportCountBucket = new Bucket(CONSTANT.WARE_NAME, ReportCount._$info.name);
    // const userReport = reportCountBucket.get<string, ReportCount[]>(reportKey)[0];
    // userReport.handled_reported = userReport.not_handled_reported.concat(userReport.handled_reported);
    // userReport.not_handled_reported = [];
    // reportCountBucket.put(reportKey, userReport);

    return reportKey;
};

/**
 * 获取文章列表
 */
// #[rpc=rpcServer]
export const getPostList = (arg: PostListArg): string => {
    if (!getSession('root')) return 'not login';
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME, CommunityBase._$info.name);
    const managerPostListBucket = new Bucket(CONSTANT.WARE_NAME, ManagerPostList._$info.name);
    let managerPostList = managerPostListBucket.get<number, ManagerPostList[]>(arg.state)[0];
    if (!managerPostList) {
        managerPostList = new ManagerPostList();
        managerPostList.state = arg.state;
        managerPostList.list = [];
    }
    console.log('============managerPostList:', managerPostList);
    managerPostList.list.reverse();
    const postBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
    const postList = new PostList();
    postList.list = [];
    let flag = false;
    if (arg.postKey.id === 0) flag = true;
    for (let i = 0; i < managerPostList.list.length; i++) {
        if (arg.count <= 0) break;
        const post = postBucket.get<PostKey, Post[]>(managerPostList.list[i])[0];
        if (!post) continue;
        // 社区基础信息
        const communityBase = communityBaseBucket.get<string, CommunityBase[]>(post.key.num)[0];
        const article = new Article();
        article.name = communityBase.name;
        article.num = communityBase.num;
        article.avatar = communityBase.avatar;
        article.owner = communityBase.owner;
        article.key = post.key;
        article.post_type = post.post_type;
        article.title = post.title;
        article.createtime = post.createtime;
        article.body = post.body;
        article.state = post.state;
        if (flag) {
            postList.list.push(article);
            arg.count --;
        }
        if (managerPostList.list[i].id === arg.postKey.id) flag = true;
    }
    postList.total = managerPostList.list.length;

    return JSON.stringify(postList);
};

/**
 * 处理待审核文章
 */
// #[rpc=rpcServer]
export const handleArticle = (arg: handleArticleArg): number => {
    console.log('============handleArticle:', arg);
    if (!getSession('root')) return ERROR_NUM.MGR_NOT_LOGIN;
    const postBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
    const post = postBucket.get<PostKey, Post[]>(arg.postKey)[0];
    if (!post) return ERROR_NUM.DB_ERROR;
    addManagerPostIndex(CONSTANT.NOT_REVIEW_STATE, arg.postKey, false); // 减去待审核文章索引
    // 审核通过
    if (arg.result) {
        post.state = CONSTANT.NORMAL_STATE;
        addManagerPostIndex(CONSTANT.REVIEW_PASS, arg.postKey, true); // 添加审核通过文章索引
    } else {
        // 审核驳回
        post.state = CONSTANT.REVIEW_REFUSE; 
        addManagerPostIndex(CONSTANT.REVIEW_REFUSE, arg.postKey, true); // 添加驳回审核文章索引
    }
    postBucket.put(arg.postKey, post);
    const handleArticleResultBucket = new Bucket(CONSTANT.WARE_NAME, HandleArticleResult._$info.name);
    const handleArticleResult = new HandleArticleResult();
    handleArticleResult.postKey = arg.postKey;
    handleArticleResult.result = arg.result;
    handleArticleResult.time = Date.now().toString();
    handleArticleResult.reason = arg.reason;
    handleArticleResultBucket.put(arg.postKey, handleArticleResult);
    // 推送审核结果通知
    send(post.owner, CONSTANT.SEND_ARTICLE_REVIEW, JSON.stringify(arg));

    return CONSTANT.RESULT_SUCCESS;
};

/**
 * 待审核公众号申请列表
 */
// #[rpc=rpcServer]
export const getApplyPublicList = (arg: PublicApplyListArg): string => {
    if (!getSession('root')) return 'not login';
    const applyPublicBucket = new Bucket(CONSTANT.WARE_NAME, ApplyPublic._$info.name);
    let key = null;
    if (arg.id !== 0) key = arg.id;
    const iter = applyPublicBucket.iter(key, true);
    const publicApplyList = new PublicApplyList();
    publicApplyList.list = [];
    publicApplyList.total = 0;
    do {
        const v = iter.next();
        if (!v) break;
        const applyPublic: ApplyPublic = v[1];
        if (arg.state === applyPublic.state) publicApplyList.total ++;
        if (arg.count <= 0) continue;
        if (arg.state === applyPublic.state) {
            const publicApplyData = getPublicApplyData(applyPublic);
            publicApplyList.list.push(publicApplyData);
        }
    } while (iter);

    return JSON.stringify(publicApplyList);
};

/**
 * 发文章
 */
// #[rpc=rpcServer]
export const sendPost = (arg: AddPostArg): PostKey => {
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME,CommunityBase._$info.name);
    const community = communityBaseBucket.get<string, CommunityBase[]>(arg.num)[0];
    console.log('!!!!!!!!!!!!!!!!!!addPostPort communityBase',arg,community);
    let key = new PostKey();
    key.id = 0;
    key.num = arg.num;
    
    key.id = getIndexID(CONSTANT.POST_INDEX, 1);
    key = addPost(community.owner, arg, key, community.comm_type);

    return key;
};

/**
 * 处理公众号申请
 */
// #[rpc=rpcServer]
export const handleApplyPublic = (arg: HandleApplyPublicArg): string => {
    console.log('============handleApplyPublic:', arg);
    if (!getSession('root')) return 'not login';
    const applyPublicBucket = new Bucket(CONSTANT.WARE_NAME, ApplyPublic._$info.name);
    const publicNameIndexBucket = new Bucket(CONSTANT.WARE_NAME, PublicNameIndex._$info.name);
    const applyPublic = applyPublicBucket.get<number, ApplyPublic[]>(arg.id)[0];
    if (!applyPublic) return 'error id';
    if (applyPublic.state !== CONSTANT.PUBLIC_APPLYING) return 'error state';
    applyPublic.handle_time = Date.now().toString();
    applyPublic.reason = arg.reason;
    if (arg.result) {
        // 同意
        applyPublic.state = CONSTANT.PUBLIC_APPLY_SUCCESS;
        // 添加公众号名称索引（公众号申请没有添加名称索引）
        const publicNameIndex = new PublicNameIndex();
        publicNameIndex.name = applyPublic.name;
        publicNameIndex.num = applyPublic.num;
        publicNameIndexBucket.put(publicNameIndex.name, publicNameIndex);
    } else {
        // 拒绝时清除公众号名索引
        applyPublic.state = CONSTANT.PUBLIC_APPLY_REFUSED;
        const publicNameIndex = publicNameIndexBucket.get<string, PublicNameIndex[]>(applyPublic.name)[0];
        if (publicNameIndex) publicNameIndexBucket.delete(applyPublic.name);
    }
    applyPublicBucket.put(arg.id, applyPublic);
    // 添加公众号
    addPublicComm(applyPublic.name, applyPublic.num, applyPublic.avatar, applyPublic.desc, applyPublic.uid, applyPublic.time);
    // 创建管理端账号
    const user = new RootUser();
    user.user = `${applyPublic.uid}@${applyPublic.num}`;
    user.pwd = randomWord(false, 6);
    console.log('public acc user:', JSON.stringify(user));
    createRoot(user);
    // 推送结果
    send(applyPublic.uid, CONSTANT.SEND_PUBLIC_APPLY, JSON.stringify(arg));

    return applyPublic.num;
};

/**
 * 管理端获取用户详情
 */
// #[rpc=rpcServer]
export const getUserDetal = (uid: number): string => {
    if (!getSession('root')) return 'not login';
    
    const publicAccIndexBucket = new Bucket(CONSTANT.WARE_NAME, CommunityAccIndex._$info.name);
    const publicAccIndex = publicAccIndexBucket.get<number, CommunityAccIndex[]>(uid)[0];
    if (!publicAccIndex) return 'db error';
    const userDetail = new UserReportDetail();
    // 用户的社区信息
    userDetail.person_community = getCommmunityDetail(uid, publicAccIndex.num);
    // 用户的举报惩罚信息
    userDetail.user_report = getReportUserInfo(`${CONSTANT.REPORT_PERSON}%${uid}`, uid);
    if (publicAccIndex.list.length === 0) return JSON.stringify(userDetail);
    userDetail.user_public = getReportPublicInfo(`${CONSTANT.REPORT_PUBLIC}%${publicAccIndex.list[0]}`);
    userDetail.public_community = getCommmunityDetail(uid, publicAccIndex.list[0]);

    return JSON.stringify(userDetail);
};

/**
 * 设置官方账号 rpc
 */
// #[rpc=rpcServer]
export const setGmAccount = (setUser:SetOfficial): Result => {
    return setOfficialAccount(setUser.accId,setUser.appId);
};

/**
 * 取消官方账号
 */
// #[rpc=rpcServer]
export const cancelGmAccount = (accId: string): number => {
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME, UserInfo._$info.name); 
    const officialBucket = new Bucket(CONSTANT.WARE_NAME, OfficialUsers._$info.name);
    const uid = getRealUid(accId);  // 通过accid找到对应的uid
    const userinfo = userInfoBucket.get<number, UserInfo>(uid)[0];
    if (!userinfo) return ERROR_NUM.ACC_ID_ERROR;
    const iter = officialBucket.iter(null, true);
    let appId = '';
    let index = 0;
    do {
        const v = iter.next();
        if (!v) break;
        const officialUsers: OfficialUsers = v[1];
        index = officialUsers.uids.indexOf(uid);
        if (index > -1) {
            appId = officialUsers.appId;
            continue;
        }
    } while (iter);
    if (appId === '') {
        return ERROR_NUM.NOT_OFFICIAL_ACCOUNT;
    } else {
        const official = officialBucket.get(appId)[0];
        official.splice(index, 1);
        officialBucket.put(appId, official);

        return CONSTANT.RESULT_SUCCESS;
    }
};

/**
 * 获取官方账号列表
 */
// #[rpc=rpcServer]
export const getOfficialAcc = (appid: string): OfficialAccList => {
    const publicNameIndexBucket = new Bucket(CONSTANT.WARE_NAME, PublicNameIndex._$info.name);
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME, UserInfo._$info.name);
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME, CommunityBase._$info.name);
    const iter = publicNameIndexBucket.iter(null, true);
    const list = new OfficialAccList();
    list.list = [];
    const map = getUidAppMap();
    console.log('getOfficialAcc!!!!!!!!!map:', JSON.stringify(map));
    do {
        const v = iter.next();
        console.log('getOfficialAcc!!!!!!!!!v:', JSON.stringify(v));
        if (!v) break;
        const publicNameIndex: PublicNameIndex = v[1];
        const num = publicNameIndex.num;
        const officialUserInfo =  new OfficialUserInfo();
        // 获取社区注册时间
        const communityBase = communityBaseBucket.get<string, CommunityBase[]>(num)[0];
        officialUserInfo.create_time = communityBase.createtime;
        const uid = communityBase.owner;
        const userInfo = userInfoBucket.get<number,UserInfo[]>(uid)[0];
        officialUserInfo.user_info = userInfo;
        officialUserInfo.app_id = map.get(uid);
        list.list.push(officialUserInfo);
    } while (iter);

    console.log('getOfficialAcc!!!!!!!!!list:', JSON.stringify(list));
    
    return list;
};

/**
 * 搜索用户
 */
// #[rpc=rpcServer]
export const findUser = (user: string): OfficialAccList => {
    const userInfoBucket = new Bucket(CONSTANT.WARE_NAME, UserInfo._$info.name);
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME, CommunityBase._$info.name);
    const list = new OfficialAccList();
    list.list = [];
    const officialUserInfo =  new OfficialUserInfo();
    // 获取uid绑定的app
    const map = getUidAppMap();
    console.log('findUser!!!!!!!!!map:', JSON.stringify(map));
    const uid = getRealUid(user);
    if (uid < 0) return list;
    const userInfo = userInfoBucket.get<number,UserInfo[]>(uid)[0];
    // 获取社区注册时间
    const communityBase = communityBaseBucket.get<string, CommunityBase[]>(userInfo.comm_num)[0];
    officialUserInfo.create_time = communityBase.createtime;
    officialUserInfo.app_id = map.get(uid);
    officialUserInfo.user_info = userInfo;
    list.list.push(officialUserInfo);
    console.log('findUser!!!!!!!!!list:', JSON.stringify(list));
    
    return list;
};

/**
 * 调整用户惩罚时间
 */
// #[rpc=rpcServer]
export const modifyPunish = (arg: ModifyPunishArg): number => {
    if (!getSession('root')) return ERROR_NUM.MGR_NOT_LOGIN;
    const punishBucket = new Bucket(CONSTANT.WARE_NAME, Punish._$info.name);
    const punish = punishBucket.get<number, Punish[]>(arg.id)[0];
    if (!punish) return ERROR_NUM.ERROR_PUNISH_ID;
    const end_time = parseInt(punish.start_time, 10) + arg.rest_time;
    punish.end_time = end_time.toString();
    punishBucket.put(punish.id, punish);
    if (end_time <= Date.now()) endPunish(`${CONSTANT.REPORT_PERSON}%${arg.uid}`, arg.id);

    return CONSTANT.RESULT_SUCCESS;
};

/**
 * 添加应用
 */
// #[rpc=rpcServer]
export const addApp = (arg: AddAppArg): number => {
    console.log('addApp!!!!!!!!!!!!!!arg:', arg);
    // if (!getSession('root')) return ERROR_NUM.MGR_NOT_LOGIN;
    const r = add_app(arg.appid, arg.name, arg.imgs, arg.desc, arg.url, arg.pk, arg.mch_id, arg.notify_url);
    if (r) {
        return CONSTANT.RESULT_SUCCESS;
    } else {
        return CONSTANT.DEFAULT_ERROR_NUMBER;
    }
};

/**
 * 删除应用
 */
// #[rpc=rpcServer]
export const delApp = (appid: string): number => {
    // if (!getSession('root')) return ERROR_NUM.MGR_NOT_LOGIN;
    const r = del_app(appid);
    if (r) {
        return CONSTANT.RESULT_SUCCESS;
    } else {
        return CONSTANT.DEFAULT_ERROR_NUMBER;
    }
};

/**
 * 编辑推荐应用
 */
// #[rpc=rpcServer]
export const setAppConfig = (arg: SetAppConfig): number => {
    // if (!getSession('root')) return ERROR_NUM.MGR_NOT_LOGIN;
    const r = set_app_config(arg.cfg_type, arg.appids);
    if (r) {
        return CONSTANT.RESULT_SUCCESS;
    } else {
        return CONSTANT.DEFAULT_ERROR_NUMBER;
    }
};

/**
 * 恢复已删除帖子
 */
// #[rpc=rpcServer]
export const reversePost = (postKey: PostKey): number => {
    if (!getSession('root')) return ERROR_NUM.MGR_NOT_LOGIN;
    const postBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
    const post = postBucket.get<PostKey, Post[]>(postKey)[0];
    if (!post) return ERROR_NUM.POST_NOT_EXIST;
    post.state = CONSTANT.NORMAL_STATE;
    if (!postBucket.put(postKey, post)) return ERROR_NUM.DB_ERROR;
    addManagerPostIndex(post.state, post.key, true);

    return CONSTANT.RESULT_SUCCESS;
};

// 获取公众号详情
export const getCommmunityDetail = (uid: number, num: string): CommunityDetail => {
    const communityInfo = new CommunityDetail();
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME, CommunityBase._$info.name);
    // 社区基础信息
    const personCommunityBase = communityBaseBucket.get<string, CommunityBase[]>(num)[0];
    communityInfo.num = personCommunityBase.num;
    communityInfo.name = personCommunityBase.name;
    communityInfo.desc = personCommunityBase.desc;
    communityInfo.avatar = personCommunityBase.avatar;
    communityInfo.time = personCommunityBase.createtime;
    communityInfo.comm_type = personCommunityBase.comm_type;
    communityInfo.attention_list = [];
    communityInfo.fans_list = [];
    communityInfo.post_list = [];
    // 关注列表
    const attentionIndexBucket = new Bucket(CONSTANT.WARE_NAME, AttentionIndex._$info.name);
    const attentionIndex = attentionIndexBucket.get<number, AttentionIndex[]>(uid)[0];
    if (attentionIndex) communityInfo.attention_list = attentionIndex.person_list.concat(attentionIndex.public_list);
    // 粉丝列表
    const fansIndexBucket = new Bucket(CONSTANT.WARE_NAME, FansIndex._$info.name);
    const fansIndex = fansIndexBucket.get<string, FansIndex[]>(num)[0];
    if (fansIndex) communityInfo.fans_list = fansIndex.list;
    // 帖子列表
    const communityPostBucket = new Bucket(CONSTANT.WARE_NAME,CommunityPost._$info.name);
    const communityPost = communityPostBucket.get<string, CommunityPost[]>(num)[0];
    if (communityPost) {
        for (let i = 0; i < communityPost.id_list.length; i++) {
            const postKey = new PostKey();
            postKey.num = num;
            postKey.id = communityPost.id_list[i];
            communityInfo.post_list.push(postKey);
        }
    }

    return communityInfo;
};

// 获取公众号申请详情
export const getPublicApplyData = (applyPublic: ApplyPublic): PublicApplyData => {
    const applyPublicBucket = new Bucket(CONSTANT.WARE_NAME, ApplyPublic._$info.name);
    const userApplyPublicBucket = new Bucket(CONSTANT.WARE_NAME, UserApplyPublic._$info.name);
    let userApplyPublic = userApplyPublicBucket.get<number, UserApplyPublic[]>(applyPublic.uid)[0];
    if (!userApplyPublic) {
        userApplyPublic = new UserApplyPublic();
        userApplyPublic.uid = applyPublic.uid;
        userApplyPublic.list = [];
    }
    // 历史申请记录中减去本次申请
    const index = userApplyPublic.list.indexOf(applyPublic.id);
    if (index > -1) userApplyPublic.list.splice(index, 1);
    const publicApplyData = new PublicApplyData();
    publicApplyData.user_info = getUserInfoById(applyPublic.uid);
    publicApplyData.apply_info = applyPublic;
    publicApplyData.apply_list = [];
    for (let i = 0; i < userApplyPublic.list.length; i++) {
        const applyPublic = applyPublicBucket.get<number, ApplyPublic[]>(userApplyPublic.list[i])[0];
        if (!applyPublic) continue;
        publicApplyData.apply_list.push(applyPublic);
    }

    return publicApplyData;
};

// 获取举报数据
export const getReportData = (report: Report): ReportData => {
    console.log('============getReportData:', report);
    const postBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
    const commentBucket = new Bucket(CONSTANT.WARE_NAME, Comment._$info.name);

    const reportData = new ReportData(); // 举报数据
    // 获取举报人用户信息
    console.log('============reporter uid:', report.ruid);
    const reporterUserInfo = getReportUserInfo(`${CONSTANT.REPORT_PERSON}%${report.ruid}`, report.ruid);
    reportData.report_user = reporterUserInfo;

    if (report.report_type === CONSTANT.REPORT_PERSON) { // 举报个人
        // 获取被举报人信息
        const uid = parseInt(report.key.split('%')[1], 10);
        console.log('============reported uid:', uid);
        const reportedUserInfo = getReportUserInfo(report.key, uid);
        reportData.reported_user = reportedUserInfo;
        console.log('============reportData:', reportData);
    }

    if (report.report_type === CONSTANT.REPORT_PUBLIC) { // 举报公众号
        // 获取被举报公众号信息
        const reportedPublicInfo = getReportPublicInfo(report.key);
        reportData.reported_public = reportedPublicInfo;
        // 获取被举报人信息
        const uid = reportedPublicInfo.owner;
        const reportedUserInfo = getReportUserInfo(`${CONSTANT.REPORT_PERSON}%${uid}`, uid);
        reportData.reported_user = reportedUserInfo;
    }

    if (report.report_type === CONSTANT.REPORT_POST) { // 举报动态
        // 获取帖子信息
        const reportContentInfo = getReportContentInfo(report.key);
        reportData.reported_content = reportContentInfo;
        console.log('============report.key:', report.key);
        const postKey1: PostKey = JSON.parse(report.key.split('%')[1]);
        const postKey = new PostKey();
        postKey.num = postKey1.num;
        postKey.id = postKey1.id;
        console.log('============postKey:', postKey);
        const postData = getPostInfoById(postKey);
        report.evidence = JSON.stringify(postData);
        // 获取用户信息
        const uid = postData.owner;
        const reportedUserInfo = getReportUserInfo(`${CONSTANT.REPORT_PERSON}%${uid}`, uid);
        reportData.reported_user = reportedUserInfo;
    }

    if (report.report_type === CONSTANT.REPORT_ARTICLE) { // 举报文章
        // 获取帖子信息
        const postKey1: PostKey = JSON.parse(report.key.split('%')[1]);
        const postKey = new PostKey();
        postKey.num = postKey1.num;
        postKey.id = postKey1.id;
        const postData = getPostInfoById(postKey);
        const reportContentInfo = getReportContentInfo(report.key);
        reportData.reported_content = reportContentInfo;
        report.evidence = JSON.stringify(postData);
        // 获取公众号信息
        const publicKey = `${CONSTANT.REPORT_PUBLIC}%${postData.key.num}`;
        const reportedPublicInfo = getReportPublicInfo(publicKey);
        reportData.reported_public = reportedPublicInfo;
        // 获取用户信息
        const uid = postData.owner;
        const reportedUserInfo = getReportUserInfo(`${CONSTANT.REPORT_PERSON}%${uid}`, uid);
        reportData.reported_user = reportedUserInfo;
    }

    if (report.report_type === CONSTANT.REPORT_COMMENT) { // 举报评论
        // 获取评论信息
        const reportContentInfo = getReportContentInfo(report.key);
        reportData.reported_content = reportContentInfo;
        const commentKey1: CommentKey = JSON.parse(report.key.split('%')[1]);
        const commentKey = new CommentKey();
        commentKey.id = commentKey1.id;
        commentKey.num = commentKey1.num;
        commentKey.post_id = commentKey1.post_id;
        const comment = commentBucket.get<CommentKey, Comment[]>(commentKey)[0];
        report.evidence = JSON.stringify(comment);
        // 获取用户信息
        const uid = comment.owner;
        const reportedUserInfo = getReportUserInfo(`${CONSTANT.REPORT_PERSON}%${uid}`, uid);
        reportData.reported_user = reportedUserInfo;
    }
    reportData.report_info = report;

    return reportData;
};

// 获取举报/被举报用户信息
export const getReportUserInfo = (key: string, uid: number): ReportUserInfo => {
    const reportCountBucket = new Bucket(CONSTANT.WARE_NAME, ReportCount._$info.name);
    const punishBucket = new Bucket(CONSTANT.WARE_NAME, Punish._$info.name);
    const reportBucket = new Bucket(CONSTANT.WARE_NAME, Report._$info.name);
    const reporterUserInfo = new ReportUserInfo();
    let reporterCount = reportCountBucket.get<string, ReportCount[]>(key)[0];
    if (!reporterCount) {
        reporterCount = new ReportCount();
        reporterCount.key = key;
        reporterCount.report = [];
        reporterCount.reported = [];
    }
    reporterUserInfo.user_info = getUserInfoById(uid);
    // 举报列表
    reporterUserInfo.report_list = [];
    for (let i = 0; i < reporterCount.report.length; i++) {
        const report = reportBucket.get<number, Report[]>(reporterCount.report[i])[0];
        if (report) reporterUserInfo.report_list.push(report);
    }
    // 被举报列表
    reporterUserInfo.reported_list = [];
    for (let i = 0; i < reporterCount.reported.length; i++) {
        const report = reportBucket.get<number, Report[]>(reporterCount.reported[i])[0];
        if (report) reporterUserInfo.reported_list.push(report);
    }
    // 当前惩罚列表
    reporterUserInfo.punish_list = [];
    const punishCount = getUserPunish(key);
    const nowPunish = punishBucket.get<number, Punish[]>(punishCount.now_publish)[0];
    if (nowPunish) reporterUserInfo.punish_list.push(nowPunish);
    // 历史惩罚列表
    reporterUserInfo.punish_history_list = [];
    for (let i = 0; i < punishCount.punish_history.length; i++) {
        const punish = punishBucket.get<number, Punish[]>(punishCount.punish_history[i])[0];
        reporterUserInfo.punish_history_list.push(punish);
    }

    return reporterUserInfo;
};

// 获取被举报公众号信息
export const getReportPublicInfo = (key: string): ReportPublicInfo => {
    const reportCountBucket = new Bucket(CONSTANT.WARE_NAME, ReportCount._$info.name);
    const punishBucket = new Bucket(CONSTANT.WARE_NAME, Punish._$info.name);
    const reportBucket = new Bucket(CONSTANT.WARE_NAME, Report._$info.name);
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME, CommunityBase._$info.name);
    const reportPublicInfo = new ReportPublicInfo();
    console.log('===============key:', key);
    const communityNum = key.split('%')[1];
    console.log('===============communityNum:', communityNum);
    const communityBase = communityBaseBucket.get<string, CommunityBase[]>(communityNum)[0];
    reportPublicInfo.num = communityNum;
    reportPublicInfo.name = communityBase.name;
    reportPublicInfo.owner = communityBase.owner;
    let reportCount = reportCountBucket.get<string, ReportCount[]>(key)[0];
    if (!reportCount) {
        reportCount = new ReportCount();
        reportCount.key = key;
        reportCount.report = [];
        reportCount.reported = [];
    }
    reportPublicInfo.reported_list = [];
    // 被举报列表
    reportPublicInfo.reported_list = [];
    for (let i = 0; i < reportCount.reported.length; i++) {
        const report = reportBucket.get<number, Report[]>(reportCount.reported[i])[0];
        if (report) reportPublicInfo.reported_list.push(report);
    }
    // 当前惩罚列表
    reportPublicInfo.punish_list = [];
    const punishCount = getUserPunish(key);
    const nowPunish = punishBucket.get<number, Punish[]>(punishCount.now_publish)[0];
    if (nowPunish) reportPublicInfo.punish_list.push(nowPunish);
    // 历史惩罚列表
    reportPublicInfo.punish_history_list = [];
    for (let i = 0; i < punishCount.punish_history.length; i++) {
        const punish = punishBucket.get<number, Punish[]>(punishCount.punish_history[i])[0];
        reportPublicInfo.punish_history_list.push(punish);
    }

    return reportPublicInfo;
};

// 获取被举报内容信息
export const getReportContentInfo = (key: string): ReportContentInfo => {
    const reportCountBucket = new Bucket(CONSTANT.WARE_NAME, ReportCount._$info.name);
    let reportCount = reportCountBucket.get<string, ReportCount[]>(key)[0];
    if (!reportCount) {
        reportCount = new ReportCount();
        reportCount.key = key;
        reportCount.report = [];
        reportCount.reported = [];
    }
    const reportContentInfo = new ReportContentInfo();
    reportContentInfo.key = key;
    reportContentInfo.reported_count = reportCount.reported.length;

    return reportContentInfo;
};

// 获取指定对象的惩罚信息
export const getUserPunish = (key: string): PunishCount => {
    const punishCountBucket = new Bucket(CONSTANT.WARE_NAME, PunishCount._$info.name);
    let punishCount = punishCountBucket.get<string, PunishCount[]>(key)[0];
    if (!punishCount) {
        punishCount = new PunishCount();
        punishCount.key = key;
        punishCount.now_publish = 0;
        punishCount.punish_history = [];
    }
    console.log('===============punishCount1111:', punishCount, key);

    return punishCount;
};

// 获取指定对象正在生效的惩罚信息
export const getUserPunishing = (key: string, punishType: number): PunishList => {
    const punishBucket = new Bucket(CONSTANT.WARE_NAME, Punish._$info.name);
    const punishCount = getUserPunish(key);
    console.log('===============punishCount:', punishCount);
    const punishList = new PunishList();
    punishList.list = [];
    const punish = punishBucket.get<number, Punish[]>(punishCount.now_publish)[0];
    if (!punish) return punishList;
    if ((punish.punish_type !== CONSTANT.FREEZE) && (punish.punish_type !== punishType)) return punishList;
    // 惩罚时间结束
    if (parseInt(punish.end_time, 10) <= Date.now()) {
        endPunish(key, punishCount.now_publish);

        return punishList;
    } else {
        punishList.list.push(punish);
    }

    return punishList;
};

/**
 * 结束惩罚
 * @param key 惩罚对象主键
 * @param id 惩罚id
 */
export const endPunish = (key: string, id: number): boolean => {
    const punishCount = getUserPunish(key);
    const punishCountBucket = new Bucket(CONSTANT.WARE_NAME, PunishCount._$info.name);
    const punishBucket = new Bucket(CONSTANT.WARE_NAME, Punish._$info.name);
    const punish = punishBucket.get<number, Punish[]>(id)[0];
    punish.state = CONSTANT.PUNISH_END;
    punishBucket.put(id, punish);
    punishCount.now_publish = 0;

    punishCount.punish_history.push(id);

    return punishCountBucket.put(key, punishCount);
};

// 删除帖子
const deletePost = (postKey: PostKey): number => {
    const postBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
    const post = postBucket.get<PostKey, Post[]>(postKey)[0];
    if (!post) return ERROR_NUM.POST_NOT_EXIST;
    post.state = CONSTANT.DELETE_STATE;
    if (!postBucket.put(postKey, post)) return ERROR_NUM.DB_ERROR;
    addManagerPostIndex(post.state, post.key, false);

    return CONSTANT.RESULT_SUCCESS;
};

// 删除评论
const deleteComment = (arg: CommentKey): number => {
    const postCountBucket = new Bucket(CONSTANT.WARE_NAME, PostCount._$info.name);
    const commentBucket = new Bucket(CONSTANT.WARE_NAME, Comment._$info.name);
    const comment = commentBucket.get(arg)[0];
    // 检查评论是否存在
    if (!comment) {
        return ERROR_NUM.COMMENT_NOT_EXIST;
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
        
        return ERROR_NUM.DB_ERROR;
    }
    // 删除评论记录
    if (!commentBucket.delete(arg)) {
       
        return ERROR_NUM.DB_ERROR;
    }
    
    return CONSTANT.RESULT_SUCCESS;
};

/**
 * 添加管理端帖子索引
 * @param state 帖子状态
 * @param postKey 帖子主键
 * @param flag true为增 false为减
 */
export const addManagerPostIndex = (state: number, postKey: PostKey, flag: boolean): boolean => {
    console.log('============addManagerPostIndex:', state);
    const managerPostListBucket = new Bucket(CONSTANT.WARE_NAME, ManagerPostList._$info.name);
    let managerPostList = managerPostListBucket.get<number, ManagerPostList[]>(state)[0];
    if (!managerPostList) {
        managerPostList = new ManagerPostList();
        managerPostList.state = state;
        managerPostList.list = [];
    }
    if (flag) {
        managerPostList.list.push(postKey);
    } else {
        for (let i = 0; i < managerPostList.list.length; i++) {
            if (managerPostList.list[i].id === postKey.id) managerPostList.list.splice(i, 1);
        }
    }
    managerPostListBucket.put(state, managerPostList);

    return true;
};

/**
 * 
 * @param name 公众号名
 * @param num 社区编号
 * @param avatar 头像
 * @param desc 描述
 * @param uid 用户id
 * @param time 创建时间
 */
export const addPublicComm = (name: string, num: string, avatar: string, desc: string, uid: number, time: string): string => {
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME, CommunityBase._$info.name);
    const communityBase = new CommunityBase();
    communityBase.num = num;
    communityBase.name = name;
    communityBase.desc = desc;
    communityBase.owner = uid;
    communityBase.property = '';
    communityBase.createtime = time;
    communityBase.comm_type = CONSTANT.COMMUNITY_TYPE_PUBLIC;
    communityBase.avatar = avatar;
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
    publicAccIndex.list.push(num);
    console.log('==================publicAccIndex',publicAccIndex);
    publicAccIndexBucket.put(uid, publicAccIndex);

    return num;
};

/**
 * 获取指定社区账户帖子信息(已删除也可获取)
 * @ param postKey
 */
export const getPostInfoById = (postKey: PostKey): PostData => {
    const postBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
    const postCountBucket = new Bucket(CONSTANT.WARE_NAME, PostCount._$info.name);
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME,CommunityBase._$info.name);
    const post = postBucket.get<PostKey, Post[]>(postKey)[0];
    if (!post) return;
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
    postData.state = post.state;
    // 公众号的帖子返回公众号信息
    if (commBase.comm_type === CONSTANT.COMMUNITY_TYPE_PUBLIC) {
        postData.username = commBase.name;
        postData.avatar = commBase.avatar;
    }

    return postData;
};

// 更新举报状态
const updateReportInfo = (reportKey, punish_id) => {
    const reportCountBucket = new Bucket(CONSTANT.WARE_NAME, ReportCount._$info.name);
    const reportBucket = new Bucket(CONSTANT.WARE_NAME, Report._$info.name);
    const userReport = reportCountBucket.get<string, ReportCount[]>(reportKey)[0];
    const now = Date.now().toString();
    for (let i = 0; i < userReport.not_handled_reported.length; i++) {
        const report = reportBucket.get<number, Report[]>(userReport.not_handled_reported[i])[0];
        report.handle_time = now;
        report.punish_id = punish_id;
        reportBucket.put(userReport.not_handled_reported[i], report);
    }
    userReport.handled_reported = userReport.not_handled_reported.concat(userReport.handled_reported);
    userReport.not_handled_reported = [];
    reportCountBucket.put(reportKey, userReport);
};

const reportGetUserName = (reportType: number, report: Report): string => {
    let uid = 0;
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME,CommunityBase._$info.name);
    switch (reportType) {
        case CONSTANT.REPORT_PERSON:
            uid = JSON.parse(report.key.split('%')[1]);
            break;
        case CONSTANT.REPORT_PUBLIC:
            const communityNum = report.key.split('%')[1];
            const communityBase = communityBaseBucket.get<string, CommunityBase[]>(communityNum)[0];
            uid = communityBase.owner;
            break;
        case CONSTANT.REPORT_POST:
            const postKey: PostKey = JSON.parse(report.key.split('%')[1]);
            const commBase:CommunityBase = communityBaseBucket.get(postKey.num)[0];
            uid = commBase.owner;
            break;
        case CONSTANT.REPORT_COMMENT:
            const commentKey: CommentKey = JSON.parse(report.key.split('%')[1]);
            const commBase1:CommunityBase = communityBaseBucket.get(commentKey.num)[0];
            uid = commBase1.owner;
            break;
        default:
            uid = 0; 
    }
    const userInfo = getUserInfoById(uid);
    if (!userInfo) return '';

    return userInfo.name;
};

// 自增id
export const getIndexId = (name: string) : number => {
    const indexBucket = new Bucket(CONSTANT.WARE_NAME, AccountGenerator._$info.name);
    let accountGenerator = indexBucket.get<string, AccountGenerator[]>(name)[0];
    if (!accountGenerator) {
        accountGenerator = new AccountGenerator();
        accountGenerator.index = name;
        accountGenerator.currentIndex = 0;
    }
    accountGenerator.currentIndex += 1;
    indexBucket.put(name, accountGenerator);

    return accountGenerator.currentIndex;
};

export const getPunishStr = (punishType: number) => {
    switch (punishType) {
        case CONSTANT.DELETE_CONTENT:
            return '删除发表内容';
        case CONSTANT.BAN_MESAAGE:
            return '禁言';
        case CONSTANT.BAN_POST:
            return '禁止发动态';
        case CONSTANT.FREEZE:
            return '禁言/禁止发动态';
        case CONSTANT.BAN_ACCOUNT:
            return '封禁';
        default:
            return '';
    }
};

export const formatDuring = (mss: number) => {
    const days = Math.floor(mss / (1000 * 60 * 60 * 24));
    const hours = Math.floor((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((mss % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = (mss % (1000 * 60)) / 1000;
    
    return `${days}天${hours}小时${minutes}分钟${seconds}秒`;
};

/**
 * 获取官方账号绑定的应用
 */
export const getUidAppMap = (): Map<number, string> => {
    const officialBucket = new Bucket(CONSTANT.WARE_NAME, OfficialUsers._$info.name);
    const iter = officialBucket.iter(null, true);
    const map = new Map();
    do {
        const v = iter.next();
        if (!v) break;
        const officialUsers: OfficialUsers = v[1];
        officialUsers.uids.forEach((uid) => {
            map.set(uid, officialUsers.appId);
        });
    } while (iter);

    return map;
};