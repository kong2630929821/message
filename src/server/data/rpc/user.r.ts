/**
 * 用户相关的rpc操作
 */
// ================================================================= 导入
import { Result } from "./basic.s";
import { UserAgree } from "./user.s";
import { read } from "../../../pi_pt/db";
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Tr } from "../../../pi_pt/rust/pi_db/mgr";
import { Bucket } from "../../../utils/db";
import * as CONSTANT from '../constant';
import {Contact} from "../db/user.s"
// ================================================================= 导出
/**
 * 申请添加对方为好友
 * @param uuid
 */
//#[rpc]
export const applyFriend = (uid: number): Result => {
    getCurrentUidFromSession((sid:number)=>{
        _applyFriend(sid,uid);
    })
    /**
     * 添加到联系人表中
     * @param sid 
     * @param rid 
     */
    const _applyFriend = (sid:number,rid:number) => {
        const dbMgr = getEnv().getDbMgr();
        let contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
        let contactInfo = contactBucket.get(rid)[0] || _initContact();  
        contactInfo.uid = rid;
        contactInfo.applyUser.push(sid);
        contactBucket.put(rid,contactInfo);
    }
    /**
     * 初始化结构体
     */
    const _initContact = () => {
        let contact = new Contact;
        contact.uid = -1;
        contact.friends = [];
        contact.temp_chat = [];
        contact.group = [];
        contact.applyUser = [];
        contact.applyGroup = [];
        return contact;
    }
    let result = new Result;
    result.r = 1;
    return result;
}

/**
 * 接受对方为好友
 * @param agree
 */
//#[rpc]
export const acceptFriend = (agree: UserAgree): Result => {

    return
}

/**
 * 删除好友
 * @param uuid
 */
//#[rpc]
export const delFriend = (uid: number): Result => {

    return
}

//修改密码TODO
// ================================================================= 导出
export const getCurrentUidFromSession = (cb: (uid: number) => void) => {
    const session = getEnv().getSession();
    const dbMgr = getEnv().getDbMgr();
    read(dbMgr, (tr: Tr) => {
        let uid = session.get(tr, "uid");
        cb(<number>uid);
    });
}