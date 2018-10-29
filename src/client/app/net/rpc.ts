/**
 * 调用rpc接口
 */
// ================================================ 导入
import { clientRpcFunc } from "./init";
import { notEmptyString } from "../../../utils/util";
import { registerUser, login as loginUser, setUserInfo as setUserProfile } from "../../../server/data/rpc/basic.p";
import { UserRegister, LoginReq, UserInfoSet, Result } from "../../../server/data/rpc/basic.s";
import { UserInfo } from "../../../server/data/db/user.s";
import { applyFriend as applyUserFriend, acceptFriend as acceptUserFriend, delFriend as delUserFriend } from "../../../server/data/rpc/user.p";
import { updateStore, getBorn } from "../data/store";
import { sendUserMessage, sendGroupMessage } from "../../../server/data/rpc/message.p";
import { UserSend, GroupSend } from "../../../server/data/rpc/message.s";
import { UserHistory, MSG_TYPE } from "../../../server/data/db/message.s";
import { UserAgree } from "../../../server/data/rpc/user.s";
import { GroupCreate } from "../../../server/data/rpc/group.s";
import { createGroup as createGroupp, delMember, dissolveGroup } from "../../../server/data/rpc/group.p";

// ================================================ 导出
/**
 * 普通用户注册
 * @param name
 * @param passwd
 * @param cb
 */
export const register = (name: string, passwdHash: string, cb: (r: UserInfo) => void) => {
    let info = new UserRegister;
    info.name = name;
    info.passwdHash = passwdHash;
    clientRpcFunc(registerUser, info, (r: UserInfo) => {
        let userInfoMap = getBorn("userInfoMap")
        userInfoMap.set(r.uid, r);
        updateStore("userInfoMap", userInfoMap);
        cb(r);
    })
}

/**
 * 普通用户登录
 * @param uid
 * @param passwdHash
 * @param cb
 */
export const login = (uid: number, passwdHash: string, cb: (r: UserInfo) => void) => {
    let info = new LoginReq;
    info.uid = uid;
    info.passwdHash = passwdHash;
    clientRpcFunc(loginUser, info, (r: UserInfo) => {
        let userInfoMap = getBorn("userInfoMap")
        userInfoMap.set(r.uid, r);
        updateStore("userInfoMap", userInfoMap);
        cb(r);
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
export const sendMessage = (rid: number, msg: string, cb: (r: UserHistory) => void) => {
    let info = new UserSend;
    info.msg = msg;
    info.mtype = MSG_TYPE.TXT
    info.rid = rid;
    info.time = (new Date).getTime();

    clientRpcFunc(sendUserMessage, info, (r: UserHistory) => {
        let userHistoryMap = getBorn("userHistoryMap")
        userHistoryMap.set(r.hIncid, r);
        updateStore("userHistoryMap", userHistoryMap);
        cb(r);
        // userInfoMap.set(r.uid, r)
        // updateStore("userInfoMap", userInfoMap);
        //todo
    })
}

/**
 * 申请添加rid为好友
 * @param rid
 * @param cb
 */
export const applyFriend = (rid: number, cb: (r) => void) => {
    clientRpcFunc(applyUserFriend, rid, (r: Result) => {
        cb(r)
    })
}


/**
 * 接受对方为好友
 * @param rid 
 * @param cb 
 */
export const acceptFriend = (rid: number, agree: boolean, cb: (r) => void) => {
    let userAgree = new UserAgree;
    userAgree.uid = rid;
    userAgree.agree = agree;
    clientRpcFunc(acceptUserFriend, userAgree, (r: Result) => {
        cb(r)
    })
}

/**
 * 删除好友
 * @param rid 
 * @param cb 
 */
export const delFriend = (rid: number, cb: (r) => void) => {
    clientRpcFunc(delUserFriend, rid, (r: Result) => {
        cb(r)
    })
}
// ================  debug purpose ==========================

export const setUserInfo = () => {
    let userInfoSet = new UserInfoSet();
    userInfoSet.avator = "avatar";
    userInfoSet.name = "wtf";
    userInfoSet.note = "xxx";
    userInfoSet.sex = 0;
    userInfoSet.tel = "13800000000";

    clientRpcFunc(setUserProfile, userInfoSet, (r) => {
        console.log(r);
    });
}

export const createGroup = () => {
    let x = new GroupCreate();
    x.note = "wtf";
    x.name = "xxx";

    clientRpcFunc(createGroupp, x, (r) => {
        console.log(r);
    })
}

export const deleteGroupMember = () => {
    let req = "11111:4";

    clientRpcFunc(delMember, req, (r) => {
        console.log(r);
    })
}

export const deleteGroup = () => {
    let gid = 11111;
    clientRpcFunc(dissolveGroup, gid, (r) => {
        console.log(r);
    });
}

export const sendGroupMsg = () => {
    let msg = new GroupSend();
    msg.gid = 11111;
    msg.msg = "hi group";
    msg.mtype = 0;
    msg.time = Date.now();

    clientRpcFunc(sendGroupMessage, msg, (r) => {
        console.log(r);
    })
}

(<any>self).setUserInfo = () => {
    setUserInfo();
}

(<any>self).login = (uid: number, passwdHash: string) => {
    login(uid, passwdHash, (r) => {
        console.log(r);
    });
}

(<any>self).register = (name: string, passwdHash: string) => {
    register(name, passwdHash, (r) => {
        console.log(r);
    });
}

(<any>self).createGroup = () => {
    createGroup();
}

(<any>self).deleteGroupMember = () => {
    deleteGroupMember();
}

(<any>self).deleteGroup = () => {
    deleteGroup();
}

(<any>self).sendGroupMsg = () => {
    sendGroupMsg();
}
