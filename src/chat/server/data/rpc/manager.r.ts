/**
 * 管理后端
 */

import { getSession } from '../../../../pi_pt/util/autologin.r';
import { Bucket } from '../../../utils/db';
import { send } from '../../../utils/send';
import { setSession } from '../../rpc/session.r';
import * as CONSTANT from '../constant';
import { AttentionIndex, Comment, CommentKey, CommunityAccIndex, CommunityBase, CommunityPost, FansIndex, Post, PostCount, PostKey, PublicNameIndex } from '../db/community.s';
import { ApplyPublic, Article, CommunityDetail, HandleApplyPublicArg, handleArticleArg, HandleArticleResult, ManagerPostList, ModifyPunishArg, PostList, PostListArg, PublicApplyData, PublicApplyList, PublicApplyListArg, Punish, PunishArg, PunishCount, PunishData, PunishList, ReportContentInfo, ReportData, ReportList, ReportListArg, ReportPublicInfo, ReportUserInfo, RootUser, UserApplyPublic, UserReportDetail } from '../db/manager.s';
import { Report, ReportCount } from '../db/message.s';
import { AccountGenerator } from '../db/user.s';
import * as ERROR_NUM from '../errorNum';
import { getUserInfoById, getUsersInfo } from './basic.r';
import { Result } from './basic.s';
import { setOfficialAccount } from './user.r';
import { SetOfficial } from './user.s';

/**
 * 创建管理员
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
export const getReportList = (arg: ReportListArg): string => {
    if (!getSession('root')) return 'not login';
    const reportBucket = new Bucket(CONSTANT.WARE_NAME, Report._$info.name);
    const reportList = new ReportList();
    reportList.list = [];
    reportList.total = 0;
    let reportId: number;
    if (arg.id <= 0) {
        reportId = null;
    } else {
        reportId = arg.id - 1;
    }
    const iter = reportBucket.iter(reportId, true);
    let count = 0;
    do {
        const v = iter.next();
        if (!v) break;
        const report: Report = v[1];
        if (report.state === arg.state) reportList.total ++;
        if (count >= arg.count) continue;
        console.log('============loop report:', report);
        if (report.state === arg.state) { // 匹配举报状态
            const reportData = getReportData(report);
            reportList.list.push(reportData);
            count ++;
            continue;
        }
    } while (iter);
    console.log('============reportList:', reportList);

    return JSON.stringify(reportList);
};

/**
 * 惩罚指定对象
 */
// #[rpc=rpcServer]
export const punish = (arg: PunishArg): string => {
    if (!getSession('root')) return 'not login';
    // const reportBucket = new Bucket(CONSTANT.WARE_NAME, Report._$info.name);
    // const report = reportBucket.get<number, Report[]>(arg.report_id)[0];
    // if (!report) return 'error report id';
    // if (report.state !== 0) return 'error report state';
    let uid = 0;
    const report_type = parseInt(arg.key.split(':')[0], 10);
    if (arg.punish_type === CONSTANT.DELETE_CONTENT) { // 删除内容
        if (report_type === CONSTANT.REPORT_POST || report_type === CONSTANT.REPORT_ARTICLE) {
            const postKey: PostKey = JSON.parse(arg.key.split(':')[1]);
            // 删除帖子
            deletePost(postKey);
            const postBucket = new Bucket(CONSTANT.WARE_NAME, Post._$info.name);
            const post = postBucket.get<PostKey, Post[]>(postKey)[0];
            if (post) uid = post.owner;
        }
        if (report_type === CONSTANT.REPORT_COMMENT) {
            const commentKey: CommentKey = JSON.parse(arg.key.split(':')[1]);
            // 删除评论
            deleteComment(commentKey);
            const commentBucket = new Bucket(CONSTANT.WARE_NAME, Comment._$info.name);
            const comment = commentBucket.get<CommentKey, Comment[]>(commentKey)[0];
            if (comment)  uid = comment.owner;
        }
    }
    if (report_type === CONSTANT.REPORT_PUBLIC) {
        const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME, CommunityBase._$info.name);
        const commNum = arg.key.split(':')[1];
        const communityBase = communityBaseBucket.get<string, CommunityBase[]>(commNum)[0];
        if (communityBase)  uid = communityBase.owner;
    }
    if (report_type === CONSTANT.REPORT_PERSON) {
        uid = parseInt(arg.key.split(':')[1], 10);
    }
    // 禁言和禁止发动态只用添加惩罚记录,在发消息时查询有无惩罚记录
    const punishBucket = new Bucket(CONSTANT.WARE_NAME, Punish._$info.name);
    const punish = new Punish();
    punish.id = getIndexId('punish');
    punish.start_time = Date.now().toString();
    punish.end_time = (Date.now() + arg.time).toString();
    punish.punish_type = arg.punish_type;
    punish.report_id = arg.report_id;
    punish.state = CONSTANT.PUNISH_LAST;
    punishBucket.put(punish.id, punish);
    const punishCountBucket = new Bucket(CONSTANT.WARE_NAME, PunishCount._$info.name);
    let punishCount = punishCountBucket.get<string, PunishCount[]>(arg.key)[0];
    if (!punishCount) {
        punishCount = new PunishCount();
        punishCount.key = arg.key;
        punishCount.punish_list = [];
        punishCount.punish_history = [];
    }
    punishCount.punish_list.push(punish.id);
    punishCountBucket.put(punishCount.key, punishCount);
    // 推送惩罚信息
    send(uid, CONSTANT.SEND_PUNISH, JSON.stringify(punish));

    return punish.id.toString();
};

/**
 * 举报受理完成
 */
// #[rpc=rpcServer]
export const reportHandled = (report_id: number): string => {
    if (!getSession('root')) return 'not login';
    const reportBucket = new Bucket(CONSTANT.WARE_NAME, Report._$info.name);
    const report = reportBucket.get<number, Report[]>(report_id)[0];
    if (!report) return 'error report id';
    report.state = 1;
    reportBucket.put(report.id, report);

    return report_id.toString();
};

/**
 * 获取文章列表
 */
// #[rpc=rpcServer]
export const getPostList = (arg: PostListArg): string => {
    if (!getSession('root')) return 'not login';
    const managerPostListBucket = new Bucket(CONSTANT.WARE_NAME, ManagerPostList._$info.name);
    let managerPostList = managerPostListBucket.get<number, ManagerPostList[]>(arg.state)[0];
    console.log('============managerPostList:', managerPostList);
    if (!managerPostList) {
        managerPostList = new ManagerPostList();
        managerPostList.state = arg.state;
        managerPostList.list = [];
    }
    managerPostList.list.reverse();
    const articleBucket = new Bucket(CONSTANT.WARE_NAME, Article._$info.name);
    const postList = new PostList();
    postList.list = [];
    let flag = false;
    if (arg.postKey.id === 0) flag = true;
    for (let i = 0; i < managerPostList.list.length; i++) {
        if (arg.count <= 0) break;
        const post = articleBucket.get<PostKey, Article[]>(managerPostList.list[i])[0];
        if (!post) continue;
        if (flag) {
            postList.list.push(post);
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
 * 处理公众号申请
 */
// #[rpc=rpcServer]
export const handleApplyPublic = (arg: HandleApplyPublicArg): string => {
    console.log('============handleApplyPublic:', arg);
    if (!getSession('root')) return 'not login';
    const applyPublicBucket = new Bucket(CONSTANT.WARE_NAME, ApplyPublic._$info.name);
    const applyPublic = applyPublicBucket.get<number, ApplyPublic[]>(arg.id)[0];
    if (!applyPublic) return 'error id';
    if (applyPublic.state !== CONSTANT.PUBLIC_APPLYING) return 'error state';
    applyPublic.handle_time = Date.now().toString();
    applyPublic.reason = arg.reason;
    if (arg.result) {
        // 同意
        applyPublic.state = CONSTANT.PUBLIC_APPLY_SUCCESS;
    } else {
        // 拒绝时清除公众号名索引
        applyPublic.state = CONSTANT.PUBLIC_APPLY_REFUSED;
        const publicNameIndexBucket = new Bucket(CONSTANT.WARE_NAME, PublicNameIndex._$info.name);
        const publicNameIndex = publicNameIndexBucket.get<string, PublicNameIndex[]>(applyPublic.name)[0];
        if (publicNameIndex) publicNameIndexBucket.delete(applyPublic.name);
    }
    applyPublicBucket.put(arg.id, applyPublic);
    // 添加公众号
    addPublicComm(applyPublic.name, applyPublic.num, applyPublic.avatar, applyPublic.desc, applyPublic.uid, applyPublic.time);
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
    userDetail.user_report = getReportUserInfo(`${CONSTANT.REPORT_PERSON}:${uid}`, uid);
    if (publicAccIndex.list.length === 0) return JSON.stringify(userDetail);
    userDetail.user_public = getReportPublicInfo(`${CONSTANT.REPORT_PUBLIC}:${publicAccIndex.list[0]}`);
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
    if (end_time <= Date.now()) endPunish(`${CONSTANT.REPORT_PERSON}:${arg.uid}`, arg.id);

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
    const reporterUserInfo = getReportUserInfo(`${CONSTANT.REPORT_PERSON}:${report.ruid}`, report.ruid);
    reportData.report_user = reporterUserInfo;

    if (report.report_type === CONSTANT.REPORT_PERSON) { // 举报个人
        // 获取被举报人信息
        const uid = parseInt(report.key.split(':')[1], 10);
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
        const reportedUserInfo = getReportUserInfo(`${CONSTANT.REPORT_PERSON}:${uid}`, uid);
        reportData.reported_user = reportedUserInfo;
    }

    if (report.report_type === CONSTANT.REPORT_POST) { // 举报动态
        // 获取帖子信息
        const reportContentInfo = getReportContentInfo(report.key);
        reportData.reported_content = reportContentInfo;
        const postKey: PostKey = JSON.parse(report.key.split(':')[1]);
        const post = postBucket.get<PostKey, Post[]>(postKey)[0];
        report.evidence = JSON.stringify(post);
        // 获取用户信息
        const uid = post.owner;
        const reportedUserInfo = getReportUserInfo(`${CONSTANT.REPORT_PERSON}:${uid}`, uid);
        reportData.reported_user = reportedUserInfo;
    }

    if (report.report_type === CONSTANT.REPORT_ARTICLE) { // 举报文章
        // 获取帖子信息
        const reportContentInfo = getReportContentInfo(report.key);
        reportData.reported_content = reportContentInfo;
        const postKey: PostKey = JSON.parse(report.key.split(':')[1]);
        const post = postBucket.get<PostKey, Post[]>(postKey)[0];
        report.evidence = JSON.stringify(post);
        // 获取公众号信息
        const publicKey = `${CONSTANT.REPORT_PUBLIC}:${post.key.num}`;
        const reportedPublicInfo = getReportPublicInfo(publicKey);
        reportData.reported_public = reportedPublicInfo;
        // 获取用户信息
        const uid = post.owner;
        const reportedUserInfo = getReportUserInfo(`${CONSTANT.REPORT_PERSON}:${uid}`, uid);
        reportData.reported_user = reportedUserInfo;
    }

    if (report.report_type === CONSTANT.REPORT_COMMENT) { // 举报评论
        // 获取评论信息
        const reportContentInfo = getReportContentInfo(report.key);
        reportData.reported_content = reportContentInfo;
        const commentKey: CommentKey = JSON.parse(report.key.split(':')[1]);
        const comment = commentBucket.get<CommentKey, Comment[]>(commentKey)[0];
        report.evidence = JSON.stringify(comment);
        // 获取用户信息
        const uid = comment.owner;
        const reportedUserInfo = getReportUserInfo(`${CONSTANT.REPORT_PERSON}:${uid}`, uid);
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
    for (let i = 0; i < punishCount.punish_list.length; i++) {
        const punish = punishBucket.get<number, Punish[]>(punishCount.punish_list[i])[0];
        reporterUserInfo.punish_list.push(punish);
    }
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
    const communityNum = key.split(':')[1];
    const communityBase = communityBaseBucket.get<string, CommunityBase[]>(communityNum)[0];
    reportPublicInfo.num = communityNum;
    reportPublicInfo.name = CommunityBase.name;
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
    for (let i = 0; i < punishCount.punish_list.length; i++) {
        const punish = punishBucket.get<number, Punish[]>(punishCount.punish_list[i])[0];
        reportPublicInfo.punish_list.push(punish);
    }
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
        punishCount.punish_list = [];
        punishCount.punish_history = [];
    }
    
    return punishCount;
};

// 获取指定对象正在生效的惩罚信息
export const getUserPunishing = (key: string, punishType: number): PunishList => {
    const punishCountBucket = new Bucket(CONSTANT.WARE_NAME, PunishCount._$info.name);
    const punishBucket = new Bucket(CONSTANT.WARE_NAME, Punish._$info.name);
    const punishCount = getUserPunish(key);
    const punishList = new PunishList();
    punishList.list = [];
    for (let i = 0; i < punishCount.punish_list.length; i++) {
        const punish = punishBucket.get<number, Punish[]>(punishCount.punish_list[i])[0];
        if (!punish) continue;
        if ((punish.punish_type !== CONSTANT.FREEZE) && (punish.punish_type !== punishType)) continue;
        // 惩罚时间结束
        if (parseInt(punish.end_time, 10) <= Date.now()) {
            endPunish(key, punishCount.punish_list[i]);
            continue;
        } else {
            punishList.list.push(punish);
        }
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
    const index = punishCount.punish_list.indexOf(id);
    if (index > -1) {
        punishCount.punish_list.splice(index, 1);
    }
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
    addManagerPostIndex(post.state, post.key, true);

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