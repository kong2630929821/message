/**
 * 管理后端
 */

import { getSession } from '../../../../pi_pt/util/autologin.r';
import { Bucket } from '../../../utils/db';
import { setSession } from '../../rpc/session.r';
import * as CONSTANT from '../constant';
import { Comment, CommentKey, CommunityBase, Post, PostKey } from '../db/community.s';
import { Punish, PunishCount, PunishData, ReportContentInfo, ReportData, ReportList, ReportListArg, ReportPublicInfo, ReportUserInfo, RootUser } from '../db/manager.s';
import { Report, ReportCount } from '../db/message.s';
import { getUserInfoById, getUsersInfo } from './basic.r';

/**
 * 创建管理员
 */
// #[rpc=rpcServer]
export const createRoot = (user: RootUser): boolean => {
    const rootUserBucket = new Bucket(CONSTANT.WARE_NAME, RootUser._$info.name);
    if (user.user && user.pwd) {
        rootUserBucket.put(user.user, user);

        return true;
    } else {
        return false;
    }
};

/**
 * 管理员登陆
 */
// #[rpc=rpcServer]
export const rootLogin = (user: RootUser): boolean => {
    const rootUserBucket = new Bucket(CONSTANT.WARE_NAME, RootUser._$info.name);
    const rootUser = rootUserBucket.get<string, RootUser[]>(user.user)[0];
    if (!rootUser) return false;
    if (rootUser.pwd === user.pwd) {
        // 写入会话
        setSession('root', user.user);
        console.log(getSession('root'));

        return true;
    } else {
        return false;
    }
};

/**
 * 举报信息列表
 */
// #[rpc=rpcServer]
export const getReportList = (arg: ReportListArg): string => {
    const reportBucket = new Bucket(CONSTANT.WARE_NAME, Report._$info.name);

    const reportList = new ReportList();
    reportList.list = [];
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
        if (count >= arg.count) break;
        const report: Report = v[1];
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
    const reporterUserInfo = new ReportUserInfo();
    const reporterCount = reportCountBucket.get<string, ReportCount[]>(key)[0];
    reporterUserInfo.user_info = getUserInfoById(uid);
    reporterUserInfo.report_count = reporterCount.report.length;
    reporterUserInfo.reported_count = reporterCount.reported.length;
    reporterUserInfo.punish_list = [];
    const punishCount = getUserPunish(key);
    for (let i = 0; i < punishCount.punish_list.length; i++) {
        const punish = punishBucket.get<number, Punish[]>(punishCount.punish_list[i])[0];
        reporterUserInfo.punish_list.push(punish);
    }
    reporterUserInfo.punish_count = punishCount.punish_list.length + punishCount.punish_history.length;

    return reporterUserInfo;
};

// 获取被举报公众号信息
export const getReportPublicInfo = (key: string): ReportPublicInfo => {
    const reportCountBucket = new Bucket(CONSTANT.WARE_NAME, ReportCount._$info.name);
    const punishBucket = new Bucket(CONSTANT.WARE_NAME, Punish._$info.name);
    const communityBaseBucket = new Bucket(CONSTANT.WARE_NAME, CommunityBase._$info.name);
    const reportPublicInfo = new ReportPublicInfo();
    const communityNum = key.split(':')[1];
    const communityBase = communityBaseBucket.get<string, CommunityBase[]>(communityNum)[0];
    reportPublicInfo.num = communityNum;
    reportPublicInfo.name = CommunityBase.name;
    reportPublicInfo.owner = communityBase.owner;
    const reportCount = reportCountBucket.get<string, ReportCount[]>(key)[0];
    reportPublicInfo.reported_count = reportCount.reported.length;
    reportPublicInfo.punish_list = [];
    const punishCount = getUserPunish(key);
    for (let i = 0; i < punishCount.punish_list.length; i++) {
        const punish = punishBucket.get<number, Punish[]>(punishCount.punish_list[i])[0];
        reportPublicInfo.punish_list.push(punish);
    }
    reportPublicInfo.punish_count = punishCount.punish_list.length + punishCount.punish_history.length;

    return reportPublicInfo;
};

// 获取被举报内容信息
export const getReportContentInfo = (key: string): ReportContentInfo => {
    const reportCountBucket = new Bucket(CONSTANT.WARE_NAME, ReportCount._$info.name);
    const reportCount = reportCountBucket.get<string, ReportCount[]>(key)[0];
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