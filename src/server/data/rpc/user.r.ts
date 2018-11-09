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
import { Contact } from "../db/user.s"
import { Logger } from "../../../utils/logger";

const logger = new Logger("USER");

// ================================================================= 导出
/**
 * 申请添加对方为好友
 * @param uuid
 */
//#[rpc=rpcServer]
export const applyFriend = (uid: number): Result => {
    /**
     * 添加到联系人表中
     * @param sid
     * @param rid
     */
    const _applyFriend = (sid: number, rid: number) => {
        const dbMgr = getEnv().getDbMgr();
        let contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
        let contactInfo = contactBucket.get(rid)[0];
        contactInfo.applyUser.push(sid);
        contactBucket.put(rid, contactInfo);
    }

    getCurrentUidFromSession((sid: number) => {
        console.log(`sid is ${sid}, uid is : ${uid}`)
        _applyFriend(sid, uid);
    })

    let result = new Result;
    result.r = 1;
    return result;
}

/**
 * 接受对方为好友
 * @param agree
 */
//#[rpc=rpcServer]
export const acceptFriend = (agree: UserAgree): Result => {
    const _acceptFriend = (sid: number, rid: number, agree: boolean) => {
        const dbMgr = getEnv().getDbMgr();
        let contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
        //获取当前用户的联系人列表
        let sContactInfo = contactBucket.get(sid)[0];
        //从申请列表中删除当前同意/拒绝的用户
        console.log(`sContactInfo.applyFriend is ${sContactInfo.applyUser}`)
        sContactInfo.applyUser = delValueFromArray(rid, sContactInfo.applyUser);
        if (agree) {
            //在对方的列表中添加好友
            let rContactInfo = contactBucket.get(rid)[0];
            rContactInfo.friends.push(sid);
            contactBucket.put(rid, rContactInfo);
            //在当前用户列表中添加好友
            sContactInfo.friends.push(rid);
        }
        contactBucket.put(sid, sContactInfo);
    }
    getCurrentUidFromSession((sid: number) => {
        _acceptFriend(sid, agree.uid, agree.agree);
    })

    let result = new Result;
    result.r = 1;
    return result;
}

/**
 * 删除好友
 * @param uuid
 */
//#[rpc=rpcServer]
export const delFriend = (uid: number): Result => {
    const _delFriend = (sid: number, rid: number) => {
        const dbMgr = getEnv().getDbMgr();
        let contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
        //获取当前用户的联系人列表
        let sContactInfo = contactBucket.get(sid)[0];
        //从申请列表中删除当前同意/拒绝的用户
        sContactInfo.friends = delValueFromArray(rid, sContactInfo.friends);
        contactBucket.put(sid, sContactInfo);
    }
    getCurrentUidFromSession((sid: number) => {
        _delFriend(sid, uid);
    })

    let result = new Result;
    result.r = 1;
    return result;
}

/**
 * 将用户添加到黑名单
 * @param uid
 */
export const addToBlackList = (peerUid: number): Result => {
    const dbMgr = getEnv().getDbMgr();
    let contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
    let session = getEnv().getSession();
    let uid;
    read(dbMgr, (tr: Tr) => {
        uid = session.get(tr, "uid");
    });
    let result = new Result;
    let contactInfo = contactBucket.get<number, [Contact]>(uid)[0];
    let index = contactInfo.blackList.indexOf(peerUid);
    if (index > -1) {
        logger.debug("User: ", peerUid, "has already in blacklist of user: ", uid);
        result.r = 0;
        return result;
    } else {
        contactInfo.blackList.push(peerUid);
        contactBucket.put(uid, contactInfo);
        logger.debug("Add user: ", peerUid, "to blacklist of user: ", uid);

        result.r = 1;
        return result;
    }
}

/**
 * 将用户移除黑名单
 * @param uid
 */

export const removeFromBlackList = (peerUid: number): Result => {
    const dbMgr = getEnv().getDbMgr();
    let contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
    let session = getEnv().getSession();
    let uid;
    read(dbMgr, (tr: Tr) => {
        uid = session.get(tr, "uid");
    });
    let result = new Result;
    let contactInfo = contactBucket.get<number, [Contact]>(uid)[0];
    let index = contactInfo.blackList.indexOf(peerUid);
    if (index > -1) {
        contactInfo.blackList.splice(index, 1);
        contactBucket.put(uid, contactInfo);
        logger.debug("Remove user: ", peerUid, "from blacklist of user: ", uid);
        result.r = 1;
        return result;
    } else {
        logger.debug("User: ", peerUid, "is not banned by user: ", uid);
        result.r = 0;
        return result;
    }
}

// ================================================================= 本地

/**
 * 从session中取uid
 * @param cb
 */
const getCurrentUidFromSession = (cb: (uid: number) => void) => {
    const session = getEnv().getSession();
    const dbMgr = getEnv().getDbMgr();
    read(dbMgr, (tr: Tr) => {
        let uid = session.get(tr, "uid");
        cb(parseInt(<string>uid));
    });
}

/**
 * 删除value
 * @param value
 * @param arr
 */
const delValueFromArray = (value: any, arr: Array<any>) => {
    return arr.filter((ele) => {
        return ele !== value
    })
}