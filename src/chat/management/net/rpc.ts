import { RootUser } from '../../server/data/db/manager.s';
import { UserInfo } from '../../server/data/db/user.s';
import { login as loginUser } from '../../server/data/rpc/basic.p';
import { LoginReq, UserType, UserType_Enum } from '../../server/data/rpc/basic.s';
import { createRoot, rootLogin } from '../../server/data/rpc/manager.p';
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