/**
 * 调用rpc接口
 */
// ================================================ 导入
import { DEFAULT_ERROR_STR } from '../../../server/data/constant';
import { GroupInfo } from '../../../server/data/db/group.s';
import { GroupMsg, MSG_TYPE, UserHistory } from '../../../server/data/db/message.s';
import { UserInfo } from '../../../server/data/db/user.s';
import { getFriendLinks, getGroupsInfo, getUsersInfo, login as loginUser } from '../../../server/data/rpc/basic.p';
// tslint:disable-next-line:max-line-length
import { GetFriendLinksReq, GetGroupInfoReq, GetUserInfoReq, LoginReq, Result, UserArray, UserType, UserType_Enum, WalletLoginReq } from '../../../server/data/rpc/basic.s';
// tslint:disable-next-line:max-line-length
import { acceptUser, addAdmin, applyJoinGroup, createGroup as createNewGroup, delMember, dissolveGroup, inviteUserToNPG } from '../../../server/data/rpc/group.p';
import { GroupAgree, GroupCreate } from '../../../server/data/rpc/group.s';
import { sendGroupMessage, sendTempMessage, sendUserMessage } from '../../../server/data/rpc/message.p';
import { GroupSend, TempSend, UserSend } from '../../../server/data/rpc/message.s';
// tslint:disable-next-line:max-line-length
import { acceptFriend as acceptUserFriend, applyFriend as applyUserFriend, delFriend as delUserFriend } from '../../../server/data/rpc/user.p';
import { UserAgree } from '../../../server/data/rpc/user.s';
import { clientRpcFunc, subscribe } from './init';

// ================================================ 导出

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
/**
 * 钱包登录
 * @param uid user id 
 * @param passwdHash passwd hash
 * @param cb callback
 */
export const walletLogin = (openid: string, sign: string, cb: (r: UserInfo) => void) => {
    const userType = new UserType();
    userType.enum_type = UserType_Enum.WALLET;
    const walletLoginReq = new WalletLoginReq();
    walletLoginReq.openid = openid;
    walletLoginReq.sign = sign;
    userType.value = walletLoginReq;
    clientRpcFunc(loginUser, userType, (r: UserInfo) => {
        cb(r);
    });
};
/**
 * 获取用户基本信息
 *
 * @param uid user id 
 */
export const getUsersBasicInfo = (uids: number[],accIds?:string[]) => {
    const info = new GetUserInfoReq();
    info.uids = uids;
    info.acc_ids = accIds;

    return new Promise((resolve,reject) => {
        clientRpcFunc(getUsersInfo, info, (r: UserArray) => {
            if (r && r.arr.length > 0) {
                resolve(r);
            } else {
                reject(r);
            }
        });
    });
    
};
/**
 * 单聊
 * @param rid reader id
 * @param msg message
 */
export const sendUserMsg = (rid: number, msg: string, msgType = MSG_TYPE.TXT) => {
    const info = new UserSend();
    info.msg = msg;
    info.mtype = msgType;
    info.rid = rid;
    info.time = (new Date()).getTime();

    return new Promise((resolve,reject) => {
        clientRpcFunc(sendUserMessage, info, (r: UserHistory) => {
            if (r.hIncId !== DEFAULT_ERROR_STR) {
                resolve(r);

            } else {
                reject(r);
            }
        });
    });
    
};

/**
 * 临时单聊
 */
export const sendTempMsg = (rid: number,gid:number, msg: string, msgType = MSG_TYPE.TXT) => {
    const info = new TempSend();
    info.msg = msg;
    info.mtype = msgType;
    info.rid = rid;
    info.gid = gid;
    info.time = (new Date()).getTime();

    return new Promise((resolve,reject) => {
        clientRpcFunc(sendTempMessage, info, (r: UserHistory) => {
            if (r.hIncId !== DEFAULT_ERROR_STR) {
                resolve(r);

            } else {
                reject(r);
            }
        });
    });
};

/**
 * 申请添加rid为好友
 * @param rid reader id
 * @param cb callback
 */
export const applyFriend = (user: string, cb: (r: Result) => void) => {
    clientRpcFunc(applyUserFriend, user, (r: Result) => {
        cb(r);
    });
};

/**
 * 接受对方为好友
 * @param rid reader
 * @param cb callback
 */
export const acceptFriend = (rid: number, agree: boolean, cb: (r: Result) => void) => {
    const userAgree = new UserAgree();
    userAgree.uid = rid;
    userAgree.agree = agree;
    clientRpcFunc(acceptUserFriend, userAgree, (r: Result) => {
        cb(r);
    });
};

/**
 * 删除好友
 * @param rid reader id
 * @param cb callback
 */
export const delFriend = (rid: number, cb: (r: Result) => void) => {
    clientRpcFunc(delUserFriend, rid, (r: Result) => {
        cb(r);
    });
};
// ================  debug purpose ==========================

// 创建群聊  need_agree：入群是否需要同意
export const createGroup = (name:string, avatar:string, note:string, needAgree:boolean, cb?: (r: GroupInfo) => void) => {
    const group = new GroupCreate();
    group.note = note;
    group.name = name;
    group.avatar = avatar; 
    group.need_agree = needAgree;
    
    clientRpcFunc(createNewGroup, group, (r) => {
        cb && cb(r);
    });
};

// 邀请当前用户进入游戏群（无需同意）
export const inviteUserToGroup = (gid:number, cb:(r:Result) => void) => {
    
    clientRpcFunc(inviteUserToNPG, gid, (r) => {
        cb(r);
    });
};

export const deleteGroupMember = () => {
    const req = '11111:4';

    clientRpcFunc(delMember, req, (r) => {
        console.log(r);
    });
};

export const deleteGroup = () => {
    const gid = 11111;
    clientRpcFunc(dissolveGroup, gid, (r) => {
        console.log(r);
    });
};

export const sendGroupMsg = (gid:number,message:string,mtype = MSG_TYPE.TXT) => {
    const msg = new GroupSend();
    msg.gid = gid;
    msg.msg = message;
    msg.mtype = mtype;
    msg.time = Date.now();

    return new Promise((resolve,reject) => {
        clientRpcFunc(sendGroupMessage, msg, (r) => {
            if (r.hIncId !== DEFAULT_ERROR_STR) {
                resolve(r);
            } else {
                reject(r);
            }
        });
    });
    
};

export const addAdministror = (uid: number) => {
    const guid = `11111:${uid.toString()}`;
    clientRpcFunc(addAdmin, guid, (r) => {
        console.log(r);
    });
};

export const applyGroup = (gid: number) => {
    clientRpcFunc(applyJoinGroup, gid, (r) => {
        console.log(r);
    });
};

export const acceptUserJoin = (uid: number, accept: boolean) => {
    const ga = new GroupAgree();
    ga.agree = accept;
    ga.gid = 11111;
    ga.uid = uid;

    clientRpcFunc(acceptUser, ga, (r) => {
        console.log(r);
    });
};

export const getGroupInfo = () => {
    const groups = new GetGroupInfoReq();
    groups.gids = [11111];

    clientRpcFunc(getGroupsInfo, groups, (r) => {
        console.log(r);
    });
};

export const friendLinks = (uuid: string) => {
    const x = new GetFriendLinksReq();
    x.uuid = [uuid];

    clientRpcFunc(getFriendLinks, x, (r) => {
        console.log(r);
    });
};

(<any>self).friendLinks = (uuid: string) => {
    friendLinks(uuid);
};

(<any>self).subscribeGroupMsg = (topicName: string) => {
    subscribe(topicName, GroupMsg, (r) => {
        // TODO:
    });
};

(<any>self).getGroupInfo = () => {
    getGroupInfo();
};

(<any>self).login = (uid: number, passwdHash: string) => {
    login(uid, passwdHash, (r) => {
        console.log(r);
    });
};

(<any>self).deleteGroupMember = () => {
    deleteGroupMember();
};

(<any>self).deleteGroup = () => {
    deleteGroup();
};

(<any>self).sendGroupMsg = () => {
    sendGroupMsg();
};

(<any>self).sendMessage = (uid: number, msg: string) => {
    sendUserMsg(uid, msg, (r) => {
        console.log(r);
    });
};

(<any>self).addAdministror = (uid: number) => {
    addAdministror(uid);
};

(<any>self).applyGroup = (gid: number) => {
    applyGroup(gid);
};

(<any>self).acceptUserJoin = (uid: number, accept: boolean) => {
    acceptUserJoin(uid, accept);
};
