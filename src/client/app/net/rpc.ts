/**
 * 调用rpc接口
 */
// ================================================ 导入
import {clientRpcFunc} from "./init";
import {notEmptyString} from "../util/util";
import {registerUser} from "../../../server/data/rpc/basic.p";
import {UserRegister} from "../../../server/data/rpc/basic.s";
import {UserInfo} from "../../../server/data/db/user.s";

// ================================================ 导出
/**
 * 普通
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
                        
        })
    }
}
