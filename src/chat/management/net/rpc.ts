import { buildupImgPath, judgeFollowed, judgeLiked } from '../../client/app/logic/logic';
import { parseEmoji } from '../../client/app/logic/tools';
import { CommentKey, PostKey } from '../../server/data/db/community.s';
import { HandleApplyPublicArg, handleArticleArg, MessageReply, ModifyPunishArg, PostListArg, PublicApplyListArg, PunishArg, ReportDetailListArg, ReportListArg, RootUser } from '../../server/data/db/manager.s';
import { UserInfo } from '../../server/data/db/user.s';
import { login as loginUser } from '../../server/data/rpc/basic.p';
import { LoginReq, UserType, UserType_Enum } from '../../server/data/rpc/basic.s';
import { commentLaudPost, getCommentLaud, getFollowPublicPost, getPostInfoByIds, getUserPost, showCommentPort, showLaudLog } from '../../server/data/rpc/community.p';
import { AddCommentArg, AddPostArg, CommentArr, CommType, IterCommentArg, IterLaudArg, IterPostArg, LaudLogArr, PostArr, PostKeyList } from '../../server/data/rpc/community.s';
import { addApp, addCommentPost, cancelGmAccount, createHighAcc, createRoot, delApp, delCommentPost, findUser, getApplyPublicList, getMsgReply, getOfficialAcc, getPostList, getPostType, getReportDetail, getReportDetailList, getReportList, getUserDetal, handleApplyPublic, handleArticle, mdfPwd, modifyPunish, punish, reportHandled, reversePost, rootLogin, sendPost, setAppConfig, setGmAccount, setMsgReply, showUsers } from '../../server/data/rpc/manager.p';
import { AddAppArg, GetpostTypeArg, SetAppConfig } from '../../server/data/rpc/manager.s';
import { getReportListR } from '../../server/data/rpc/message.s';
import { SetOfficial } from '../../server/data/rpc/user.s';
import { erlangLogicIp } from '../config';
import { deelGetOfficialList, deelGetUserDetail, deelReportList, deelReportListInfo, deelUserInfo, deelUserInfoReport, REPORT, timestampFormat, unicode2ReadStr } from '../utils/logic';
import { clientRpcFunc } from './login';

/**
 * 普通用户登录
 * @param uid user id 
 * @param passwdHash passwd hash
 * @param cb callback
 */
export const login = (uid: number, passwdHash: string, cb: (r: UserInfo) => void) => {

    // 本地账户登录
    const userType = new UserType();
    userType.enum_type = UserType_Enum.DEF;
    const info = new LoginReq();
    info.uid = uid;
    info.passwdHash = passwdHash;
    userType.value = info;
    clientRpcFunc(loginUser, userType, (r: UserInfo) => {
        cb(r);
    });
};

// 登录
export const managementLogin = (user:string,passwd:string) => {
    const arg = new RootUser();
    arg.user = user;
    arg.pwd = passwd;
    
    return new Promise((res,rej) => {
        clientRpcFunc(rootLogin,arg,(r:boolean) => {
            res(r);
        });
    });
};

// 注册
export const createRootTest = (user:string,passwd:string) => {
    const arg = new RootUser();
    arg.user = user;
    arg.pwd = passwd;

    return new Promise((res,rej) => {
        clientRpcFunc(createRoot,arg,(r:boolean) => {
            res(r);
        });
    });
};

// 获取待审核文章列表
export const getAllPostList = (count:number,id:number,num:string) => {
    const arg = new PostListArg();
    arg.state = 2;
    arg.count = count;
    arg.postKey = new PostKey();
    arg.postKey.id = id;
    arg.postKey.num = num;

    return new Promise((res,rej) => {
        clientRpcFunc(getPostList,arg,(r:string) => {
            const data = JSON.parse(r);
            data.list.forEach((v,i) => {
                data.list[i].createtime = timestampFormat(JSON.parse(v.createtime));
                data.list[i].avatar = data.list[i].avatar ? buildupImgPath(v.avatar) :'';
                data.list[i].banner = JSON.parse(data.list[i].body).imgs;
                data.list[i].body = JSON.parse(data.list[i].body).msg;

            });
            res(data);
        });
    });
};

// 审核文章
export const getHandleArticle = (result:boolean,reason:string,id:number,num:string) => {
    const arg = new handleArticleArg();
    arg.result = result;
    arg.reason = reason;
    arg.postKey = new PostKey();
    arg.postKey.id = id;
    arg.postKey.num = num;

    return new Promise((res,rej) => {
        clientRpcFunc(handleArticle,arg,(r:boolean) => {
            res(r);
        });
    });
};

// 获取举报列表
export const getAllReport = (state:number,report_type:number) => {
    const arg = new ReportListArg();
    arg.report_type = report_type;
    arg.report_state = state;

    return new Promise((res,rej) => {
        clientRpcFunc(getReportList,arg,(r:getReportListR) => {
            let data = null;
            if (!r.msg) {
                data = { list:[] };
            } else {
                data = JSON.parse(r.msg);
            }
            res(deelReportList(data,report_type));
        });
    });
};

// 获取举报列表信息
export const getAllReportInfo = (ids:any,state:number) => {
    const arg = new ReportDetailListArg();
    arg.report_ids = ids;

    return new Promise((res,rej) => {
        clientRpcFunc(getReportDetailList,arg,(r:string) => {
            const data = JSON.parse(r);
            res(deelReportListInfo(data,state));
        });
    });
};

// 惩罚指定对象
export const setPunish = (key:string,punish_type:number,time:number) => {
    const arg = new PunishArg();
    arg.key = key;
    arg.punish_type = punish_type;
    arg.time = time;

    return new Promise((res,rej) => {
        clientRpcFunc(punish,arg,(r:string) => {
            res(r);
        });
    });
}; 

// 投诉不成立
export const setReportHandled = (id:string) => {
    const arg = id;

    return new Promise((res,rej) => {
        clientRpcFunc(reportHandled,arg,(r:string) => {
            res(r);
        });
    });
};

// 解除处罚
export const modifyPunishTime = (id:number,uid:number,time:number) => {
    const arg = new ModifyPunishArg();
    arg.id = id; // 惩罚id
    arg.uid = uid; // 用户id
    arg.rest_time = time; // 惩罚剩余时间

    return new Promise((res,rej) => {
        clientRpcFunc(modifyPunish,arg,(r:any) => {
            res(r);
        });
    });
};

// 释放动态
export const reversePosts = (id:number,num:string) => {
    const arg = new PostKey();
    arg.id = id;
    arg.num = num;

    return new Promise((res,rej) => {
        clientRpcFunc(reversePost,arg,(r:any) => {
            res(r);
        });
    });
};

// 添加应用
export const addApplication = (arg:AddAppArg) => {
    return new Promise((res,rej) => {
        clientRpcFunc(addApp,arg,(r:any) => {
            res(r);
        });
    });
};

// 获取全部游戏
export const getAllGameList = () => {
    return fetch(`http://${erlangLogicIp}:8099/oAuth/get_all_app`).then(res => {
        return res.json().then(r => {
            return r.app_ids;
        }). catch (e => {
            return [];
        });
      
    });
};

// 获取热门
export const getHotApp = () => {
    return fetch(`http://${erlangLogicIp}:8099/oAuth/get_hot_app`).then(res => {
        return res.json().then(r => {
            return r.app_ids;
        }). catch (e => {
            return [];
        });
      
    });
};

// 获取推荐
export const getRecommendApp = () => {
    return fetch(`http://${erlangLogicIp}:8099/oAuth/get_recommend_app`).then(res => {
        return res.json().then(r => {
            return r.app_ids;
        }). catch (e => {
            return [];
        });
      
    });
};

// 获取全部游戏详情
export const getAllGameInfo = (ids:string) => {
    return fetch(`http://${erlangLogicIp}:8099/oAuth/get_app_detail?app_ids=${ids}`).then(res => {
        return res.json().then(r => {
            const res = r.app_details;
            const gameList = [];
            res.forEach(v => {
                const name = unicode2ReadStr(v[0]);
                const img = JSON.parse(v[1]);
                const desc = JSON.parse(v[2]);
                const url = v[3];
                desc.desc = unicode2ReadStr(desc.desc);
                desc.subtitle = unicode2ReadStr(desc.subtitle);
                gameList.push({
                    ...desc,
                    title:name,
                    subtitle:desc.subtitle,
                    img:[img.icon,img.rowImg,img.colImg,img.downLoadImg],
                    url,
                    time:timestampFormat(JSON.parse(desc.time))
                });
            });

            return gameList;
        }). catch (e => {
            return [];
        });
      
    });
};

// 编辑热门游戏和推荐游戏
export const setAppHot = (appId:string,setType:number) => {
    const arg = new SetAppConfig();
    arg.cfg_type = setType; // 1表示热门推荐，2表示编辑推荐
    arg.appids = appId;

    return new Promise((res,rej) => {
        clientRpcFunc(setAppConfig,arg,(r:any) => {
            res(r);
        });
    });
};

// 待审核官方账号列表
export const reviewOfficial = (id:number,count:number,state:number) => {
    const arg = new PublicApplyListArg();
    arg.id = id;
    arg.count = count;
    arg.state = state;

    return new Promise((res,rej) => {
        clientRpcFunc(getApplyPublicList,arg,(r:any) => {
            res(JSON.parse(r));
        });
    });
};

/**
 * 处理待审核官方账号列表
 */
export const deelOfficial = (id:number,result:boolean,reason:string) => {
    const arg = new HandleApplyPublicArg();
    arg.id = id;
    arg.result = result;
    arg.reason = reason;

    return new Promise((res,rej) => {
        clientRpcFunc(handleApplyPublic,arg,(r:any) => {
            res(JSON.parse(r));
        });
    });
};

// 获取官方账号列表
export const getOfficialList = (appid:string = '') => {
    return new Promise((res,rej) => {
        clientRpcFunc(getOfficialAcc,appid,(r:any) => {
            res(deelGetOfficialList(r));
        });
    });
};

// 获取用户信息
export const getUserInfo = (uid:number) => {
    return new Promise((res,rej) => {
        clientRpcFunc(getReportDetail,uid,(r:any) => {
            res(deelUserInfo(JSON.parse(r)));
        });
    });
};

/**
 * 设置好嗨客服
 */
export const setHaoHaiAcc = (user:string,pwd:string) => {
    const arg = new RootUser();
    arg.user = user;
    arg.pwd = pwd;
    
    return new Promise((res,rej) => {
        clientRpcFunc(createHighAcc,arg,(r:any) => {
            res(r);
        });
    });
};

/**
 * 设置好嗨客服自动回复
 */
export const setAccMsgReply = (key:string,msg:string) => {
    const arg = new MessageReply();
    arg.key = key;
    arg.msg = msg;

    return new Promise((res,rej) => {
        clientRpcFunc(setMsgReply,arg,(r:any) => {
            res(r);
        });
    });
};

/**
 * 获取所有用户去判断好嗨客服
 */
export const getAllUser = () => {

    return new Promise((res,rej) => {
        clientRpcFunc(showUsers,'',(r:any) => {
            res(r);
        });
    });
};

/**
 * 修改密码
 */
export const changePwd = (user:string,pwd:string) => {
    const arg = new RootUser();
    arg.user = user;
    arg.pwd = pwd;
    
    return new Promise((res,rej) => {
        clientRpcFunc(mdfPwd,arg,(r:any) => {
            res(r);
        });
    });
};

/**
 * 查询用户
 */
export const queryUser = (user:string) => {
    return new Promise((res,rej) => {
        clientRpcFunc(findUser,user,(r:any) => {
            res(deelGetOfficialList(r));
        });
    });
};

/**
 * 获取指定用户的举报详情
 */
export const getReportUserInfo = (uid:number) => {
    return new Promise((res,rej) => {
        clientRpcFunc(getReportDetail,uid,(r:any) => {
            res(deelUserInfoReport(r));
        });
    });
};

// 管理端发文章
export const sendActicle = (num: string, postType: number, title: string, body: string) => {
    const arg = new AddPostArg();
    arg.num = num;
    arg.post_type = postType;
    arg.title = title;
    arg.body = body;
    
    return new Promise((res,rej) => {
        clientRpcFunc(sendPost,arg,(r:any) => {
            res(r);
        });
    });
};

// 管理端获取当前用户所发文章
export const getPubActicle = (count:number,id:number,num:string,postType:number) => {
    const arg = new GetpostTypeArg();
    arg.count = count;
    arg.id = id;
    arg.num = num;
    arg.post_type = postType;
    console.log(arg);
    
    return new Promise((res,rej) => {
        clientRpcFunc(getPostType,arg,(r:any) => {
            res(r);
        };
    });
};

/**
 * 用户详情 
 */
export const getUserDetail = (uid:number) => {
    return new Promise((res,rej) => {
        clientRpcFunc(getUserDetal,uid,(r:any) => {
            res(deelGetUserDetail(r));
        });
    });
};

/**
 * 取消官方认证
 */
export const setCancelOfficial = (acc_id:string) => {
    return new Promise((res,rej) => {
        clientRpcFunc(cancelGmAccount,acc_id,(r:any) => {
            res(r);
        });
    });
};

/**
 * 设置官方账号
 */
export const setOfficial = (app_id:string,acc_id:string) => {
    const arg = new SetOfficial();
    arg.accId = acc_id;
    arg.appId = app_id;

    return new Promise((res,rej) => {
        clientRpcFunc(setGmAccount,arg,(r:any) => {
            res(r.r);
        });
    });
};

/**
 * 删除应用
 */
export const delGameApp = (appid:string) => {
    return new Promise((res,rej) => {
        clientRpcFunc(delApp,appid,(r:any) => {
            res(r);
        });
    });
};

/**
 * 获取客服消息自动回复
 */
export const getMessageReply = (key:string) => {
    return new Promise((res,rej) => {
        clientRpcFunc(getMsgReply,key,(r:any) => {
            res(r);
        });
    });
};

/**
 * 获取最新的评论
 * id=0表示从最新的一条数据获取count条数据
 */
export const showComment = (num:string, post_id:number, id:number = 0, count:number = 20) => {
    const arg = new IterCommentArg();
    arg.count = count;
    arg.id = id;
    arg.num = num;
    arg.post_id = post_id;

    return new Promise((resolve,reject) => {
        clientRpcFunc(showCommentPort,arg,(r:CommentArr) => {
            console.log('showComment===========',r);
            if (r && r.list && r.list.length) {
                resolve(r.list);
            } else {
                reject();
            }
        });
    });
};

/**
 * 获取最新点赞记录
 */
export const showLikeList = (num:string,post_id:number,uid:number= 0,count:number= 20) => {
    const arg = new IterLaudArg();
    arg.num = num;
    arg.post_id = post_id;
    arg.uid = uid;
    arg.count = count;

    return new Promise((resolve,reject) => {
        clientRpcFunc(showLaudLog,arg,((r:LaudLogArr) => {
            console.log('showLikeList===========',r);
            if (r && r.list) {
                resolve(r.list);
            } else {
                reject();
            }
        }));
    });
};

/**
 * 获取某条帖子中评论点赞记录
 */
export const getCommentLaudList = (num:string,id:number) => {
    const param = new PostKey();
    param.id = id;
    param.num = num;
    
    return new Promise((res,rej) => {
        clientRpcFunc(getCommentLaud,param,r => {
            if (r && r.list) {
                res(r.list);
            } else {
                rej();
            }
        });
    });
};

/** 
 * 获取帖子详情
 */
export const getPostDetile = (num:string,id:number) => {
    const arg = new PostKeyList();
    const postKey1 = new PostKey();
    postKey1.num = num;
    postKey1.id = id;
    arg.list = [postKey1];

    return new Promise((res,rej) => {
        clientRpcFunc(getPostInfoByIds,arg,(r:PostArr) => {
            console.log('getPostInfoByIds=============',r);
            if (r && r.list) {
                const data:any = r.list;

                data.forEach((res,i) => {
                    data[i].offcial = res.comm_type === CommType.official;
                    data[i].isPublic = res.comm_type === CommType.publicAcc;
                    const body = JSON.parse(res.body);
                    data[i].content = parseEmoji(body.msg);
                    data[i].imgs = body.imgs;
                    data[i].followed = judgeFollowed(res.key.num);
                    data[i].likeActive = judgeLiked(res.key.num,res.key.id);
                });
                res(data);
            } else {
                rej();
            }
        });
    });
        
};

/**
 * 评论点赞
 */
export const commentLaud = (num: string, post_id: number, id: number,fail?:any) => {
    const arg = new CommentKey();
    arg.num = num;
    arg.id = id;
    arg.post_id = post_id;
    clientRpcFunc(commentLaudPost,arg,(r:boolean) => {
        if (r) {
            console.log('commentLaud============',r);
        } else {
            fail && fail();
        }
    });
};

/**
 * 评论
 */
export const addComment = (num: string, post_id: number,  msg:string,  reply: number, comment_type: number) => {
    const arg = new AddCommentArg();
    arg.num = num;
    arg.comment_type = comment_type;
    arg.msg = msg;
    arg.post_id = post_id;
    arg.reply = reply;

    return new Promise((resolve,reject) => {
        clientRpcFunc(addCommentPost,arg,(r:CommentKey) => {
            console.log('addCommentPost==========',r);
            if (r && r.num) {
                resolve(r);
            } else {
                reject();
            }
        });
    });
    
};

/**
 *  删除评论
 */
export const delComment = (num:string,post_id:number,id:number) => {
    const arg = new CommentKey();
    arg.num = num;
    arg.post_id = post_id;
    arg.id = id;

    return new Promise((res,rej) => {
        clientRpcFunc(delCommentPost,arg,(r) => {
            console.log('delCommentPost=============',r);
            if (r === 1) {
                res(r);
            } else {
                rej();
            }
        });
    });
   
};