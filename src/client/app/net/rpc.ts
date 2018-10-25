/**
 * 调用rpc接口
 */
// ================================================ 导入
import {clientRpcFunc} from "./init";
import {notEmptyString} from "../../../utils/util";
import {registerUser, login as loginUser} from "../../../server/data/rpc/basic.p";
import {UserRegister, LoginReq} from "../../../server/data/rpc/basic.s";
import {UserInfo} from "../../../server/data/db/user.s";
import {updateStore, getBorn} from "../data/store";
import {sendUserMessage} from "../../../server/data/rpc/message.p";
import {UserSend} from "../../../server/data/rpc/message.s";
import {UserHistory, MSG_TYPE} from "../../../server/data/db/message.s";

// ================================================ 导出
/**
 * 普通用户注册
 * @param name 
 * @param passwd 
 * @param cb 
 */
export const register = (name:string,passwdHash:string,cb:(r:UserInfo)=>void) => {
    let info = new UserRegister;
    info.name = name;
    info.passwdHash = passwdHash;
    clientRpcFunc(registerUser,info,(r:UserInfo)=>{
        let userInfoMap = getBorn("userInfoMap")
        userInfoMap.set(r.uid, r);
        updateStore("userInfoMap", userInfoMap);
        alert(JSON.stringify(r));
    })
}

/**
 * 普通用户登录
 * @param uid 
 * @param passwdHash 
 * @param cb 
 */
export const login = (uid:number, passwdHash:string,cb:(r:UserInfo)=>void) => {
    let info = new LoginReq;
    info.uid = uid;
    info.passwdHash = passwdHash;
    clientRpcFunc(loginUser,info,(r:UserInfo)=>{        
        let userInfoMap = getBorn("userInfoMap")
        userInfoMap.set(r.uid, r);
        updateStore("userInfoMap", userInfoMap);
        alert(JSON.stringify(r));
        // userInfoMap.set(r.uid, r)
        // updateStore("userInfoMap", userInfoMap);            
        //todo
    })
}

/**
 * 单聊
 * @param rid 
 * @param msg 
 * @param cb 
 */
export const sendMessage = (rid:number, msg:string, cb:(r:UserHistory)=>void) => {
    let info = new UserSend;
    info.msg = msg;
    info.mtype = MSG_TYPE.TXT
    info.rid = rid;
    info.time = (new Date).getTime();

    clientRpcFunc(sendUserMessage,info,(r:UserHistory)=>{
        let userHistoryMap = getBorn("userHistoryMap")
        userHistoryMap.set(r.hIncid, r);
        updateStore("userHistoryMap", userHistoryMap);
        alert(JSON.stringify(r));
        // userInfoMap.set(r.uid, r)
        // updateStore("userInfoMap", userInfoMap);            
        //todo
    })
}