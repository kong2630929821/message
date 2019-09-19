import { buildupImgPath } from '../../client/app/logic/logic';
import { PostKey } from '../../server/data/db/community.s';
import { handleArticleArg, PostListArg, RootUser } from '../../server/data/db/manager.s';
import { UserInfo } from '../../server/data/db/user.s';
import { login as loginUser } from '../../server/data/rpc/basic.p';
import { LoginReq, UserType, UserType_Enum } from '../../server/data/rpc/basic.s';
import { createRoot, getPostList, handleArticle, rootLogin } from '../../server/data/rpc/manager.p';
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
                data.list[i].avatar = data.list[i].avatar ? buildupImgPath(v.avatar) :'../../res/images/user_avatar.png';
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