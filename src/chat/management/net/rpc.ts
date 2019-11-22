import { buildupImgPath } from '../../client/app/logic/logic';
import { PostKey } from '../../server/data/db/community.s';
import { HandleApplyPublicArg, handleArticleArg, ModifyPunishArg, PostListArg, PublicApplyListArg, PunishArg, ReportDetailListArg, ReportListArg, RootUser } from '../../server/data/db/manager.s';
import { UserInfo } from '../../server/data/db/user.s';
import { login as loginUser } from '../../server/data/rpc/basic.p';
import { LoginReq, UserType, UserType_Enum } from '../../server/data/rpc/basic.s';
import { addApp, createRoot, getApplyPublicList, getPostList, getReportDetailList, getReportList, handleApplyPublic, handleArticle, modifyPunish, punish, reportHandled, reversePost, rootLogin } from '../../server/data/rpc/manager.p';
import { AddAppArg } from '../../server/data/rpc/manager.s';
import { getReportListR } from '../../server/data/rpc/message.s';
import { erlangLogicIp } from '../config';
import { deelReportList, deelReportListInfo, timestampFormat, unicode2ReadStr } from '../utils/logic';
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

// 获取所有公众号审核列表
export const getAllApplyPublicList = (count:number,state:number,id:number) => {
    const arg = new PublicApplyListArg();
    arg.state = state;
    arg.count = count;
    arg.id = id;

    return new Promise((res,rej) => {
        clientRpcFunc(getApplyPublicList,arg,(r:string) => {
            res(r);
        });
    });
};

// 审核公众号
export const setHandleApplyPublic = (result:boolean,reason:string,id:number) => {
    const arg = new HandleApplyPublicArg();
    arg.result = result;
    arg.reason = reason;
    arg.id = id;

    return new Promise((res,rej) => {
        clientRpcFunc(handleApplyPublic,arg,(r:boolean) => {
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