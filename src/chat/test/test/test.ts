import { piFetch } from '../../../app/utils/pureUtils';
import { GroupInfo } from '../../../chat/server/data/db/group.s';
import { createGroup, searchGroup } from '../../../chat/server/data/rpc/group.p';
import { GroupCreate, GroupInfoList } from '../../../chat/server/data/rpc/group.s';
import { Widget } from '../../../pi/widget/widget';
import { clientRpcFunc } from '../../client/app/net/init';
import { initPush } from '../../client/app/net/receive';
import { SPIDER_USER_INFO, WEIBO_SPIDER_HOST } from '../../server/data/constant';
import { CommentKey, PostKey } from '../../server/data/db/community.s';
import { HandleApplyPublicArg, handleArticleArg, ModifyPunishArg, PostListArg, PublicApplyListArg, PunishArg, ReportDetailListArg, ReportIndex, ReportIndexList, ReportListArg, RootUser } from '../../server/data/db/manager.s';
import { AddRobotArg, CommonComment, CommonCommentList, RobotActiveSet, RobotUserInfo } from '../../server/data/db/robot.s';
import { UserInfo } from '../../server/data/db/user.s';
import { login } from '../../server/data/rpc/basic.p';
import { Result, UserType, UserType_Enum, WalletLoginReq } from '../../server/data/rpc/basic.s';
import { addCommentPost, addPostPort, commentLaudPost, createCommunityNum, delCommentPost, deletePost, getCommentLaud, getFansId, getFollowId, getLabelPost, getLabelPostCount, getPostInfoByIds, getSquarePost, getUserInfoAndCommInfo, getUserPost, getUserPublicAcc, postLaudPost, searchPost, searchPublic, showCommentPort, showLaudLog, userFollow, setUserNotePort, showUserNotePort } from '../../server/data/rpc/community.p';
import { AddCommentArg, AddPostArg, CommentArr, CommunityNumList, CommUserInfoList, CreateCommunity, IterCommentArg, IterLabelPostArg, IterLaudArg, IterPostArg, IterSquarePostArg, LaudLogArr, NumArr, PostArr, PostArrWithTotal, PostKeyList, SetUserNoteArg, ShowUserNoteArg } from '../../server/data/rpc/community.s';
import { addApp, cancelGmAccount, createRoot, getApplyPublicList, getOfficialAcc, getPostList, getReportDetailList, getReportList, getUserDetal, handleApplyPublic, handleArticle, modifyPunish, punish, reportHandled, rootLogin, setAppConfig, setGmAccount, getReportDetail } from '../../server/data/rpc/manager.p';
import { AddAppArg, OfficialAccList, SetAppConfig } from '../../server/data/rpc/manager.s';
import { report } from '../../server/data/rpc/message.p';
import { ReportArg, getReportListR } from '../../server/data/rpc/message.s';
import { addCommonCommernt, closeRobot, getCommonCommernt, getRobotSet, getRobotUserInfo, initRobotSet, modifyRobotSet, startRobot } from '../../server/data/rpc/robot.p';
import { applyFriend, changeUserInfo, searchFriend, testDB } from '../../server/data/rpc/user.p';
import { SetOfficial, UserChangeInfo, UserInfoList } from '../../server/data/rpc/user.s';

/**
 * 登录
 */

// ================================================ 导入

// 聊天登陆
export const chatLogin = () => {
    const walletLoginReq = new WalletLoginReq();
    walletLoginReq.openid = '1002';
    walletLoginReq.sign = 'test';
    const userType = new UserType();
    userType.enum_type = UserType_Enum.WALLET;
    userType.value = walletLoginReq;
    clientRpcFunc(login, userType, (r: UserInfo) => {
        console.log(r);
    });
    initPush();
    const userChange = new UserChangeInfo();
    userChange.acc_id = '12323';
    userChange.avatar = 'aaa';
    userChange.name = 'Tony Stark';
    userChange.note = '...';
    userChange.sex = 1;
    userChange.tel = '133333333323';
    userChange.wallet_addr = 'asdasasdas';
    clientRpcFunc(changeUserInfo, userChange, (r: UserInfo) => {
        console.log(r);
    });
};

// 创建群
export const cGroupe = () => {
    const group = new GroupCreate();
    group.name = 'Avengers';
    group.avatar = 'BigHead';
    group.note = 'peace';
    group.need_agree = false;
    clientRpcFunc(createGroup, group, (r: GroupInfo) => {
        console.log(r);
    });
};

// 设置官方账号
export const setGM = () => {
    const arg = new SetOfficial();
    arg.accId = '123123';
    arg.appId = '101';
    clientRpcFunc(setGmAccount, arg, (r: Result) => {
        console.log(r);
    });
};

// 写帖子
export const addPostPortTest = () => {
    const addPostArg = new AddPostArg();
    addPostArg.num = '1';
    addPostArg.post_type = 0;
    addPostArg.title = 'Vakanda Forever';
    addPostArg.body = 'test1#一代掌门#';
    clientRpcFunc(addPostPort, addPostArg, (r: PostKey) => {
        console.log(r);
    });
};

// 帖子点赞
export const postLaudPostTest = () => {
    const arg = new PostKey();
    arg.num = '3';
    arg.id = 5;
    clientRpcFunc(postLaudPost, arg, (r: PostKey) => {
        console.log(r);
    });
};

// 评论帖子
export const addComment = () => {
    const addCommentArg = new AddCommentArg();
    addCommentArg.comment_type = 1;
    addCommentArg.num = '2';
    addCommentArg.post_id = 3;
    addCommentArg.msg = 'test222222';
    addCommentArg.reply = 7;
    console.log('!!!!!!!!!!!!!!!!!!addCommentArg', addCommentArg);
    clientRpcFunc(addCommentPost, addCommentArg, (r: CommentKey) => {
        console.log(r);
    });
};

// 获取评论
export const getCommentPort = () => {
    const arg = new IterCommentArg();
    arg.num = '2';
    arg.post_id = 3;
    arg.id = 99;
    arg.count = 10;
    clientRpcFunc(showCommentPort, arg, (r: CommentArr) => {
        console.log(r);
    });
};

// 评论点赞
export const commentLaud = () => {
    const arg = new CommentKey();
    arg.num = '2';
    arg.post_id = 3;
    arg.id = 7;
    clientRpcFunc(commentLaudPost, arg, (r: CommentArr) => {
        console.log(r);
    });
};

// 获取帖子点赞
export const showLaudLogTest = () => {
    const arg = new IterLaudArg();
    arg.num = '2';
    arg.uid = 0;
    arg.post_id = 1;
    arg.count = 10;
    clientRpcFunc(showLaudLog, arg, (r: LaudLogArr) => {
        console.log(r);
    });
};

// 获取评论点赞
export const getcommentLaudtest = () => {
    const arg = new PostKey();
    arg.num = '2';
    arg.id = 2;
    clientRpcFunc(getCommentLaud, arg, (r: CommentArr) => {
        console.log(r);
    });
};

// 关注用户
export const userFollowTest = () => {
    const num = '3';
    clientRpcFunc(userFollow, num, (r: boolean) => {
        console.log(r);
    });
};

// 获取广场分类的帖子
export const getSquarePostTest = () => {
    const arg = new IterSquarePostArg();
    arg.count = 10;
    arg.num = '5';
    arg.id = 0;
    arg.square_type = 1;
    arg.label = '';
    clientRpcFunc(getSquarePost, arg, (r: PostArr) => {
        console.log(r);
    });
};

// 创建公众号
export const createCommunityNumTest = () => {
    const arg = new CreateCommunity();
    arg.name = 'China No1..';
    arg.comm_type = 2;
    arg.desc = 'lalalalala';
    arg.avatar = 'jpg';
    clientRpcFunc(createCommunityNum, arg, (r: string) => {
        console.log(r);
    });
};

// 获取用户的公众号
export const getUserPublicAccTest = () => {
    clientRpcFunc(getUserPublicAcc, null, (r: string) => {
        console.log(r);
    });
};

// 获取指定社区账号的帖子信息
export const getUserPostTest = () => {
    const arg = new IterPostArg();
    arg.count = 10;
    arg.num = '2';
    arg.id = 0;
    clientRpcFunc(getUserPost, arg, (r: PostArrWithTotal) => {
        console.log(r);
    });
};

// 获取关注
export const getFollowIdTest = () => {
    const uid = 10134;
    clientRpcFunc(getFollowId, uid, (r: CommunityNumList) => {
        console.log(r);
    });
};

// 获取粉丝
export const getFansIdTest = () => {
    const id = '2';
    clientRpcFunc(getFansId, id, (r: CommunityNumList) => {
        console.log(r);
    });
};

// 删除帖子
export const deletePostTest = () => {
    const arg = new PostKey();
    arg.num = '2';
    arg.id = 1;
    clientRpcFunc(deletePost, arg, (r: number) => {
        console.log(r);
    });
};

// 删除评论
export const delCommentPostTest = () => {
    const arg = new CommentKey();
    arg.num = '2';
    arg.post_id = 1;
    arg.id = 2;
    clientRpcFunc(delCommentPost, arg, (r: number) => {
        console.log(r);
    });
};

// 批量获取指定社区号的信息
export const getUserInfoByCommTest = () => {
    const arg = new CommunityNumList();
    arg.list = ['2'];
    clientRpcFunc(getUserInfoAndCommInfo, arg, (r: CommUserInfoList) => {
        console.log(r);
    });
};

// 批量获取帖子
export const getPostInfoByIdsTest = () => {
    const arg = new PostKeyList();
    const postKey1 = new PostKey();
    postKey1.num = '2';
    postKey1.id = 1;
    const postKey2 = new PostKey();
    postKey2.num = '2';
    postKey2.id = 2;
    arg.list = [postKey1, postKey2];
    clientRpcFunc(getPostInfoByIds, arg, (r: CommUserInfoList) => {
        console.log(r);
    });
};

// 搜索用户
export const searchFriendTest = () => {
    const arg = 'Stark';
    clientRpcFunc(searchFriend, arg, (r: UserInfoList) => {
        console.log(r);
    });
};

// 搜索群
export const searchGroupTest = () => {
    const arg = 'aasdads';
    clientRpcFunc(searchGroup, arg, (r: GroupInfoList) => {
        console.log(r);
    });
};

// 搜索公众号
export const searchPublicTest = () => {
    const arg = 'China';
    clientRpcFunc(searchPublic, arg, (r: NumArr) => {
        console.log(r);
    });
};

// 搜索文章
export const searchPostTest = () => {
    const arg = 'Vakanda';
    clientRpcFunc(searchPost, arg, (r: PostArr) => {
        console.log(r);
    });
};

// 添加机器人
export const getRobotUserInfoTest = () => {
    // tslint:disable-next-line:prefer-template
    const src = `${WEIBO_SPIDER_HOST}${SPIDER_USER_INFO}?user_id=${5498972025}&count=${20}`;
    console.log('==========开始爬取用户数据==========');
    const imageSrc = 'https://picsum.photos/200/200';

    return piFetch(src).then(r => {
        console.log('r =====',r);
        const user_infos = r.user_list || [];
        console.log('user_infos =====',user_infos);
        if (user_infos && user_infos.length !== 0) {
            const arg = new AddRobotArg();
            arg.list = [];
            for (let i = 0; i < user_infos.length; i++) {
                const robotInfo = new RobotUserInfo();
                robotInfo.weibo_id = user_infos[i].uid;
                robotInfo.name = user_infos[i].name;
                robotInfo.avatar = '';
                robotInfo.sex = parseInt(user_infos[i].sex, 10);
                // 获取随机用户头像
                piFetch(imageSrc).then(image => {
                    robotInfo.avatar = image.url;
                }).catch(err => {
                    console.log('获取随机头像失败：',err);
                });
                arg.list.push(robotInfo);
            }
            console.log('==========开始生成虚拟用户=========', arg);
            clientRpcFunc(getRobotUserInfo, arg, (r: number) => {
                console.log(r);
            });

        }
    
        return user_infos;
        
    });
    
};

// 添加通用评论
export const addCommonCommerntTest = () => {
    const arg = new CommonCommentList();
    const c1 = new CommonComment();
    c1.msg = '6666666666666';
    c1.weight = 2;
    const c2 = new CommonComment();
    c2.msg = '真棒!';
    c2.weight = 1;
    const c3 = new CommonComment();
    c3.msg = '羡慕!';
    c3.weight = 1;
    arg.list = [c1, c2, c3];
    console.log(arg);
    clientRpcFunc(addCommonCommernt, arg, (r: boolean) => {
        console.log(r);
    });
};

// 开启机器人行为
export const startRobotTest = () => {
    const arg = 'all';
    clientRpcFunc(startRobot, arg, (r: boolean) => {
        console.log(r);
    });
};

// 关闭机器人行为
export const closeRobottTest = () => {
    const arg = 'all';
    clientRpcFunc(closeRobot, arg, (r: boolean) => {
        console.log(r);
    });
};

// 管理注册
export const createRootTest = () => {
    const arg = new RootUser();
    arg.user = 'haohai';
    arg.pwd = 'zxcvbnm';
    clientRpcFunc(createRoot, arg, (r: boolean) => {
        console.log(r);
    });
};

// 管理登陆
export const rootLoginTest = () => {
    const arg = new RootUser();
    arg.user = 'haohai';
    arg.pwd = 'zxcvbnm';
    clientRpcFunc(rootLogin, arg, (r: boolean) => {
        console.log(r);
    });
};

// 签名
// export const signTest = () => {
//     clientRpcFunc(unifiedorder, null, (r: boolean) => {
//         console.log(r);
//     });
// };

// 举报
export const reportTest = () => {
    const arg = new ReportArg();
    arg.key = '1%10134';
    arg.evidence = '';
    arg.report_type = 1;
    arg.reason = '涉嫌诈骗';
    arg.reported_uid = 10134;
    clientRpcFunc(report, arg, (r: number) => {
        console.log(r);
    });
};

// 举报列表
export const getReportListTest = () => {
    const arg = new ReportListArg();
    arg.report_state = 0;
    arg.report_type = 1;
    clientRpcFunc(getReportList, arg, (r: string) => {
        console.log(r);
        if (r !== '') {

            const r1:ReportIndexList = JSON.parse(r);
            for (let i = 0; i < r1.list.length; i++) {
                const element:ReportIndex = r1.list[i];
                const arg1 = new ReportDetailListArg();
                arg1.report_ids = element.report_ids;
                clientRpcFunc(getReportDetailList, arg1, (r2: string) => {
                    console.log(r2);
                });
            }
        }
    });
};

// 惩罚指定对象
export const punishTest = () => {
    const arg = new PunishArg();
    arg.key = '1%10134';
    arg.punish_type = 4;
    arg.time = 300000;
    clientRpcFunc(punish, arg, (r: string) => {
        console.log(r);
    });
};

// 举报受理完成
export const reportHandledTest = () => {
    const arg = '1%10134';
    clientRpcFunc(reportHandled, arg, (r: string) => {
        console.log(r);
    });
};

// 获取文章列表
export const getPostListTest = () => {
    const arg = new PostListArg();
    arg.state = 2;
    arg.count = 10;
    arg.postKey = new PostKey();
    arg.postKey.id = 0;
    arg.postKey.num = '23';
    clientRpcFunc(getPostList, arg, (r: string) => {
        console.log(r);
    });
};

// 审核文章
export const handleArticleTest = () => {
    const arg = new handleArticleArg();
    arg.result = true;
    arg.reason = '';
    arg.postKey = new PostKey();
    arg.postKey.id = 6;
    arg.postKey.num = '23';
    clientRpcFunc(handleArticle, arg, (r: boolean) => {
        console.log(r);
    });
};

// 获取公众号审核列表
export const getApplyPublicListTest = () => {
    const arg = new PublicApplyListArg();
    arg.state = 0;
    arg.count = 10;
    arg.id = 0;
    clientRpcFunc(getApplyPublicList, arg, (r: string) => {
        console.log(r);
    });
};

// 审核公众号
export const handleApplyPublicTest = () => {
    const arg = new HandleApplyPublicArg();
    arg.result = false;
    arg.reason = '';
    arg.id = 1;
    clientRpcFunc(handleApplyPublic, arg, (r: boolean) => {
        console.log(r);
    });
};

// 初始化机器人配置
export const initRobotSetTest = () => {
    clientRpcFunc(initRobotSet, null, (r: boolean) => {
        console.log(r);
    });
};

// 获取机器人配置
export const getRobotSetTest = () => {
    const arg = 'robot_post';
    clientRpcFunc(getRobotSet, arg, (r: string) => {
        console.log(r);
    });
};

// 修改机器人配置
export const modifyRobotSetTest = () => {
    const arg = new RobotActiveSet();
    arg.active = 'robot_post'; // 行为类型
    arg.min_time = 1 * 60 * 1000; // 活动最小时间间隔
    arg.max_time = 2 * 60 * 1000; // 活动最大时间间隔
    arg.post_user_limit = 5; // 单个帖子上限
    arg.daily_limit = 10; // 每天上限
    arg.weight = 1000; // 权重
    clientRpcFunc(modifyRobotSet, arg, (r: boolean) => {
        console.log(r);
    });
};

// 获取通用评论
export const getCommonCommerntTest = () => {
    clientRpcFunc(getCommonCommernt, null, (r: string) => {
        console.log(r);
    });
};

// 用户详情
export const getUserDetalTest = () => {
    const uid = 10023;
    clientRpcFunc(getUserDetal, uid, (r: string) => {
        console.log(r);
        console.log(JSON.parse(r));
    });
};

// 用户被举报详情
export const getUserReportDetalTest = () => {
    const uid = 10134;
    clientRpcFunc(getReportDetail, uid, (r: getReportListR) => {
        console.log(r);
    });
};

// 调整惩罚时间
export const modifyPunishTest = () => {
    const arg = new ModifyPunishArg();
    arg.id = 1; // 惩罚id
    arg.uid = 10023; // 用户id
    arg.rest_time = 0; // 惩罚剩余时间
    clientRpcFunc(modifyPunish, arg, (r: string) => {
        console.log(r);
    });
};

// 取消官方账号
export const cancelGmAccountTest = () => {
    const uid = 10023;
    clientRpcFunc(cancelGmAccount, uid, (r: number) => {
        console.log(r);
    });
};

// 添加好友
export const applyFriendTest = () => {
    const uid = 10065;
    clientRpcFunc(applyFriend, uid, (r: number) => {
        console.log(r);
    });
};

export const testDBtest = () => {
    const uid = 10066;
    clientRpcFunc(testDB, uid, (r: number) => {
        console.log(r);
    });
};

const props = {
    bts: [
        
        {
            name: '用户登陆',
            func: () => { chatLogin(); }
        },
        {
            name: '添加好友',
            func: () => { applyFriendTest(); }
        },
        {
            name: '读数据库',
            func: () => { testDBtest(); }
        },
        {
            name: '用户详情',
            func: () => { getUserDetalTest(); }
        },
        {
            name: '用户举报详情',
            func: () => { getUserReportDetalTest(); }
        },
        {
            name: '调整惩罚时间',
            func: () => { modifyPunishTest(); }
        },
        {
            name: '取消官方',
            func: () => { cancelGmAccountTest(); }
        },
        {
            name: '关闭机器人行为',
            func: () => { closeRobottTest(); }
        },
        {
            name: '添加机器人',
            func: () => { getRobotUserInfoTest(); }
        },
        {
            name: '初始化配置',
            func: () => { initRobotSetTest(); }
        },
        {
            name: '获取配置',
            func: () => { getRobotSetTest(); }
        },
        {
            name: '修改配置',
            func: () => { modifyRobotSetTest(); }
        },
        {
            name: '开启机器人行为',
            func: () => { startRobotTest(); }
        },
        {
            name: '添加通用评论',
            func: () => { addCommonCommerntTest(); }
        },
        {
            name: '查看通用评论',
            func: () => { getCommonCommerntTest(); }
        },
        {
            name: '审核公众号',
            func: () => { handleApplyPublicTest(); }
        },
        {
            name: '公众号列表',
            func: () => { getApplyPublicListTest(); }
        },
        {
            name: '审核文章',
            func: () => { handleArticleTest(); }
        },
        {
            name: '文章列表',
            func: () => { getPostListTest(); }
        },
        {
            name: '举报受理',
            func: () => { reportHandledTest(); }
        },
        {
            name: '惩罚',
            func: () => { punishTest(); }
        },
        {
            name: '举报列表',
            func: () => { getReportListTest(); }
        },
        {
            name: '举报',
            func: () => { reportTest(); }
        },
        {
            name: '管理注册',
            func: () => { createRootTest(); }
        },
        {
            name: '管理登陆',
            func: () => { rootLoginTest(); }
        },
        {
            name: '创建群',
            func: () => { cGroupe(); }
        },
        {
            name: '写帖子',
            func: () => { addPostPortTest(); }
        },
        {
            name: '帖子点赞',
            func: () => { postLaudPostTest(); }
        },
        {
            name: '批量获取帖子',
            func: () => { getPostInfoByIdsTest(); }
        },
        {
            name: '评论帖子',
            func: () => { addComment(); }
        },
        {
            name: '获取评论',
            func: () => { getCommentPort(); }
        },
        {
            name: '评论点赞',
            func: () => { commentLaud(); }
        },
        {
            name: '获取评论点赞',
            func: () => { getcommentLaudtest(); }
        },
        {
            name: '获取帖子点赞',
            func: () => { showLaudLogTest(); }
        },
        {
            name: '分类帖子',
            func: () => { getSquarePostTest(); }
        },
        {
            name: '关注用户',
            func: () => { userFollowTest(); }
        },
        {
            name: '创建公众号',
            func: () => { createCommunityNumTest(); }
        },
        {
            name: '获取公众号',
            func: () => { getUserPublicAccTest(); }
        },
        {
            name: '获取用户帖子',
            func: () => { getUserPostTest(); }
        },
        {
            name: '获取关注',
            func: () => { getFollowIdTest(); }
        },
        {
            name: '获取粉丝',
            func: () => { getFansIdTest(); }
        },
        {
            name: '删除帖子',
            func: () => { deletePostTest(); }
        },
        {
            name: '删除评论',
            func: () => { delCommentPostTest(); }
        },
        {
            name: '社区信息',
            func: () => { getUserInfoByCommTest(); }
        },
        {
            name: '获取标签对应的帖子',
            func: () => { 
                const arg = new IterSquarePostArg();
                arg.count = 10;
                arg.num = '';
                arg.id = 0;
                arg.square_type = 5;
                arg.label = '一代掌门';
                clientRpcFunc(getSquarePost, arg, (r: PostArr) => {
                    console.log(r);
                });
            
            }
        },
        {
            name: '获取标签对应的数量',
            func: () => { 
                const label = '一代掌门';
                clientRpcFunc(getLabelPostCount, label, (r: number) => {
                    console.log(r);
                }); }
        },
        {
            name: '添加应用(游戏)',
            func: () => { 
                const arg = new AddAppArg();
                arg.appid = '102';
                arg.name = encodeUnicode('仙之侠道');
                arg.imgs = '{"icon":"app/res/image/game/xianzhixiadao.png","bg":"app/res/image/game/xianzhixiadaoBg.png"}';
                arg.desc = `{"usePi":false,"desc":"2019${encodeUnicode('最热唯美奇幻手游')}","webviewName":"fairyChivalry","buttonMod":3,"accId":"268828","groupId":10001,"appid":"102","screenMode":"portrait", "htmlUrl": "http://ysxzxd.17youx.cn/dst/boot/yineng/yineng.html"}`;
                arg.url = 'http://ysxzxd.17youx.cn/dst/boot/yineng/yineng.html';
                arg.pk = '';
                arg.mch_id = '';
                arg.notify_url = '';
                clientRpcFunc(addApp, arg, (r: number) => {
                    console.log(r);
                }); 
            }
        },
        {
            name: '编辑热门游戏和推荐游戏',
            func: () => { 
                const arg = new SetAppConfig();
                arg.cfg_type = 2; // 1表示热门推荐，2表示编辑推荐
                arg.appids = '["102","103"]';
                clientRpcFunc(setAppConfig, arg, (r: number) => {
                    console.log(r);
                }); 
            }
        },
        {
            name: '获取官方账号列表',
            func: () => { 
                const appid = '';
                clientRpcFunc(getOfficialAcc, appid, (r: OfficialAccList) => {
                    console.log(r);
                }); 
            }
        },
        {
            name: '设置关注用户别名',
            func: () => { 
                const arg = new SetUserNoteArg();
                arg.id = '1';
                arg.name = '测试';
                clientRpcFunc(setUserNotePort, arg, (r: number) => {
                    console.log(r);
                }); 
            }
        }
        ,
        {
            name: '获取关注用户别名',
            func: () => { 
                const arg = new ShowUserNoteArg();
                arg.ids = ['1']; // 批量获取用户别名，传入需要获取的ID
                clientRpcFunc(showUserNotePort, arg, (r: ShowUserNoteArg) => {
                    console.log(r);
                }); 
            }
        }
    ] // 按钮数组
};

// ================================================ 导出
export class Test extends Widget {
    constructor() {
        super();
        this.props = props;
    }

    public onTap(a: any) {
        props.bts[a].func();
        // console.log('click ',props.bts[a].name);
    }
}

// ================================================ 本地

const  encodeUnicode = (str) => {
    const res = [];
    for (let i = 0; i < str.length; i++) {
        res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4);
    }
    
    return '\\u' + res.join('\\u');
};