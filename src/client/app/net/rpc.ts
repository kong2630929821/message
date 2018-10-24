/**
 * 调用rpc接口
 */
// ================================================ 导入
import {clientRpcFunc} from "./init";
import {notEmptyString} from "../../../utils/util";
import {registerUser, login as loginUser} from "../../../server/data/rpc/basic.p";
import {UserRegister, LoginReq, LoginReply} from "../../../server/data/rpc/basic.s";
import {UserInfo} from "../../../server/data/db/user.s";
import {updateStore, getBorn} from "../data/store";

// ================================================ 导出
/**
 * 普通用户注册
 * @param name 
 * @param passwd 
 * @param cb 
 */
export const register = (name:string,passwdHash:string,cb) => {
    if(notEmptyString(name) && notEmptyString(passwdHash)){
        let info = new UserRegister;
        info.name = name;
        info.passwdHash = passwdHash;
        clientRpcFunc(registerUser,info,UserInfo,(r:UserInfo)=>{
            let userInfoMap = getBorn("userInfoMap")
            userInfoMap.set(r.uid, r)
            updateStore("userInfoMap", userInfoMap);            
        })
    }
}

/**
 * 普通用户登录
 * @param uid 
 * @param passwdHash 
 * @param cb 
 */
export const login = (uid:number, passwdHash:string,cb) => {
    let info = new LoginReq;
    info.uid = uid;
    info.passwdHash = passwdHash;
    clientRpcFunc(loginUser,info,LoginReply,(r:LoginReply)=>{
        let userInfoMap = getBorn("userInfoMap")
        // userInfoMap.set(r.uid, r)
        // updateStore("userInfoMap", userInfoMap);            
        //todo
    })
}