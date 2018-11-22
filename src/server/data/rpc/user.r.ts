/**
 * 用户相关的rpc操作
 */
// ================================================================= 导入
import { read } from '../../../pi_pt/db';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Tr } from '../../../pi_pt/rust/pi_db/mgr';
import { Bucket } from '../../../utils/db';
import { Logger } from '../../../utils/logger';
import { genUserHid, genUuid } from '../../../utils/util';
import * as CONSTANT from '../constant';
import { Contact, FriendLink } from '../db/user.s';
import { Result } from './basic.s';
import { UserAgree } from './user.s';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================================= 导出
/**
 * 申请添加对方为好友
 * @param uuid uid:uid
 */
// #[rpc=rpcServer]
export const applyFriend = (uid: number): Result => {
    /**
     * 添加到联系人表中
     * @param sid sender id
     * @param rid reader id
     */
    const _applyFriend = (sid: number, rid: number) => {
        const dbMgr = getEnv().getDbMgr();
        const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
        const contactInfo = contactBucket.get(rid)[0];
        contactInfo.applyUser.findIndex(item => item === sid) === -1 && contactInfo.applyUser.push(sid);        
        contactBucket.put(rid, contactInfo);
    };

    getCurrentUidFromSession((sid: number) => {
        console.log(`sid is ${sid}, uid is : ${uid}`);
        _applyFriend(sid, uid);
    });

    const result = new Result();
    result.r = 1;

    return result;
};

/**
 * 接受对方为好友
 * @param agree user agree
 */
// #[rpc=rpcServer]
export const acceptFriend = (agree: UserAgree): Result => {
    const _acceptFriend = (sid: number, rid: number, agree: boolean) => {
        const dbMgr = getEnv().getDbMgr();
        const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
        // 获取当前用户的联系人列表
        const sContactInfo = contactBucket.get(sid)[0];
        // 从申请列表中删除当前同意/拒绝的用户
        console.log(`sContactInfo.applyFriend is ${sContactInfo.applyUser}`);
        sContactInfo.applyUser = delValueFromArray(rid, sContactInfo.applyUser);
        if (agree) {
            // 在对方的列表中添加好友
            const rContactInfo = contactBucket.get(rid)[0];
            rContactInfo.friends.findIndex(item => item === sid) === -1 && rContactInfo.friends.push(sid);
            contactBucket.put(rid, rContactInfo);
            // 在当前用户列表中添加好友
            sContactInfo.friends.findIndex(item => item === rid) === -1 && sContactInfo.friends.push(rid);
        }
        contactBucket.put(sid, sContactInfo);
        // 分别插入到friendLink中去friendLInk
        const friendLinkBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.FRIEND_LINK_TABLE, dbMgr);
        const friendLink = new FriendLink();
        friendLink.uuid = genUuid(sid,rid);
        friendLink.alias = '';
        friendLink.hid = genUserHid(sid, rid);
        friendLinkBucket.put(friendLink.uuid,friendLink);
        friendLink.uuid = genUuid(rid,sid);
        friendLinkBucket.put(friendLink.uuid,friendLink);

    };
    getCurrentUidFromSession((sid: number) => {
        _acceptFriend(sid, agree.uid, agree.agree);
    });

    const result = new Result();
    result.r = 1;

    return result;
};

/**
 * 删除好友
 * @param uuid uid:uid
 */
// #[rpc=rpcServer]
export const delFriend = (uid: number): Result => {
    const _delFriend = (sid: number, rid: number) => {
        const dbMgr = getEnv().getDbMgr();
        const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
        // 获取当前用户的联系人列表
        const sContactInfo = contactBucket.get(sid)[0];
        // 从好友列表中删除当前用户
        sContactInfo.friends = delValueFromArray(rid, sContactInfo.friends);
        contactBucket.put(sid, sContactInfo);
        // 从friendLink中删除
        const friendLinkBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.FRIEND_LINK_TABLE, dbMgr);
        friendLinkBucket.delete(genUuid(sid,rid));        
    };
    getCurrentUidFromSession((sid: number) => {
        _delFriend(sid, uid);
    });

    const result = new Result();
    result.r = 1;

    return result;
};

/**
 * 将用户添加到黑名单
 * @param uid user id
 */
export const addToBlackList = (peerUid: number): Result => {
    const dbMgr = getEnv().getDbMgr();
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
    const session = getEnv().getSession();
    let uid;
    read(dbMgr, (tr: Tr) => {
        uid = session.get(tr, 'uid');
    });
    const result = new Result();
    const contactInfo = contactBucket.get<number, [Contact]>(uid)[0];
    const index = contactInfo.blackList.indexOf(peerUid);
    if (index > -1) {
        logger.debug('User: ', peerUid, 'has already in blacklist of user: ', uid);
        result.r = 0;

        return result;
    } else {
        contactInfo.blackList.push(peerUid);
        contactBucket.put(uid, contactInfo);
        logger.debug('Add user: ', peerUid, 'to blacklist of user: ', uid);

        result.r = 1;

        return result;
    }
};

/**
 * 将用户移除黑名单
 * @param uid user id
 */

export const removeFromBlackList = (peerUid: number): Result => {
    const dbMgr = getEnv().getDbMgr();
    const contactBucket = new Bucket(CONSTANT.WARE_NAME, CONSTANT.CONTACT_TABLE, dbMgr);
    const session = getEnv().getSession();
    let uid;
    read(dbMgr, (tr: Tr) => {
        uid = session.get(tr, 'uid');
    });
    const result = new Result();
    const contactInfo = contactBucket.get<number, [Contact]>(uid)[0];
    const index = contactInfo.blackList.indexOf(peerUid);
    if (index > -1) {
        contactInfo.blackList.splice(index, 1);
        contactBucket.put(uid, contactInfo);
        logger.debug('Remove user: ', peerUid, 'from blacklist of user: ', uid);
        result.r = 1;

        return result;
    } else {
        logger.debug('User: ', peerUid, 'is not banned by user: ', uid);
        result.r = 0;

        return result;
    }
};

// ================================================================= 本地

/**
 * 从session中取uid
 * @param cb callback
 */
const getCurrentUidFromSession = (cb: (uid: number) => void) => {
    const session = getEnv().getSession();
    const dbMgr = getEnv().getDbMgr();
    read(dbMgr, (tr: Tr) => {
        const uid = session.get(tr, 'uid');
        cb(parseInt(<string>uid,10));
    });
};

/**
 * 删除value
 * @param value value
 * @param arr array
 */
const delValueFromArray = (value: any, arr: any[]) => {
    return arr.filter((ele) => {
        return ele !== value;
    });
};