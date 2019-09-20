import { buildupImgPath } from '../../client/app/logic/logic';
import { PostKey } from '../../server/data/db/community.s';
import { HandleApplyPublicArg, handleArticleArg, PostListArg, PublicApplyListArg, PunishArg, ReportListArg, RootUser } from '../../server/data/db/manager.s';
import { UserInfo } from '../../server/data/db/user.s';
import { login as loginUser } from '../../server/data/rpc/basic.p';
import { LoginReq, UserType, UserType_Enum } from '../../server/data/rpc/basic.s';
import { createRoot, getApplyPublicList, getPostList, getReportList, handleApplyPublic, handleArticle, punish, reportHandled, rootLogin } from '../../server/data/rpc/manager.p';
import { timestampFormat } from '../utils/logic';
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
                data.list[i].body = JSON.parse(data.list[i].body);
                data.list[i].body.imgs.forEach((t,j) => {
                    data.list[i].body.imgs[j] = buildupImgPath(t);
                });
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
export const getAllReport = (count:number,id:number,state:number) => {
    const arg = new ReportListArg();
    arg.count = count;
    arg.id = id;
    arg.state = state;

    return new Promise((res,rej) => {
        clientRpcFunc(getReportList,arg,(r:boolean) => {
            res(r);
        });
    });
};

// 惩罚指定对象
export const setPunish = (key:string,report_id:number,punish_type:number,time:number) => {
    const arg = new PunishArg();
    arg.key = key;
    arg.report_id = report_id;
    arg.punish_type = punish_type;
    arg.time = time;

    return new Promise((res,rej) => {
        clientRpcFunc(punish,arg,(r:string) => {
            res(r);
        });
    });
}; 

// 投诉不成立
export const setReportHandled = (id:number) => {
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