/**
 * 调用rpc接口
 */
// ================================================ 导入
import { clientRpcFunc, subscribe } from "./init";
import { notEmptyString } from "../../../utils/util";
import { registerUser, login as loginUser, setUserInfo as setUserProfile, getUsersInfo, getGroupsInfo, isUserOnline } from "../../../server/data/rpc/basic.p";
import { UserRegister, LoginReq, UserInfoSet, Result, GetUserInfoReq, UserArray, GetGroupInfoReq } from "../../../server/data/rpc/basic.s";
import { UserInfo } from "../../../server/data/db/user.s";
import { applyFriend as applyUserFriend, acceptFriend as acceptUserFriend, delFriend as delUserFriend } from "../../../server/data/rpc/user.p";
import { setStore } from "../data/store";
import { sendUserMessage, sendGroupMessage, sendAnnouncement } from "../../../server/data/rpc/message.p";
import { UserSend, GroupSend, AnnounceSend } from "../../../server/data/rpc/message.s";
import { UserHistory, MSG_TYPE, GroupMsg } from "../../../server/data/db/message.s";
import { UserAgree } from "../../../server/data/rpc/user.s";
import { GroupCreate, GroupAgree, InviteArray, Invite } from "../../../server/data/rpc/group.s";
import { createGroup as createGroupp, delMember, dissolveGroup, addAdmin, applyJoinGroup, acceptUser, inviteUsers } from "../../../server/data/rpc/group.p";

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
        setStore(`userInfoMap/${r.uid}`,r)
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
        cb(r);
    })
}
/**
 * 获取用户基本信息
 *
 * @param uid
 */
export const getUsersBasicInfo = (uids:Array<number>,cb: (r:UserArray) => void) => {
    let info = new GetUserInfoReq;
    info.uids = uids;
    clientRpcFunc(getUsersInfo,info,(r:UserArray) => {
        cb(r);
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
        cb(r);
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

export const addAdministror = (uid: number) => {
    let guid = "11111:" + uid.toString();
    clientRpcFunc(addAdmin, guid, (r) => {
        console.log(r);
    })
}

export const applyGroup = (gid: number) => {
    clientRpcFunc(applyJoinGroup, gid, (r) => {
        console.log(r);
    })
}

export const acceptUserJoin = (uid: number, accept: boolean) => {
    let ga = new GroupAgree();
    ga.agree = accept;
    ga.gid = 11111;
    ga.uid = uid;

    clientRpcFunc(acceptUser, ga, (r) => {
        console.log(r);
    })
}

export const sendAnnounce = (gid: number) => {
    let a = new AnnounceSend();
    a.gid = gid;
    a.msg = "new announcement";
    a.mtype = 1;
    a.time = Date.now();

    clientRpcFunc(sendAnnouncement, a, (r) => {
        console.log(r);
    })
}

export const inviteUsersToGroup = () => {
    let ia = new InviteArray();
    let invite1 = new Invite();
    invite1.gid = 11111;
    invite1.rid = 10001;

    let invite2 = new Invite();
    invite2.gid = 11111;
    invite2.rid = 10002;

    let invite3 = new Invite();
    invite3.gid = 11111;
    invite3.rid = 10003;

    ia.arr = [invite1, invite2, invite3];

    clientRpcFunc(inviteUsers, ia, (r) => {
        console.log(r);
    })
}

export const getGroupInfo = () => {
    let groups = new GetGroupInfoReq();
    groups.gids = [11111];

    clientRpcFunc(getGroupsInfo, groups, (r) => {
        console.log(r);
    })
}

export const userOnline = (uid: number) => {
    clientRpcFunc(isUserOnline, uid, (r) => {
        console.log(r);
    })
}

(<any>self).userOnline = (uid: number) => {
    userOnline(uid);
}

(<any>self).subscribeGroupMsg = (topicName: string) => {
    subscribe(topicName, GroupMsg, (r) => {

    });
}

(<any>self).getGroupInfo = () => {
    getGroupInfo();
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

(<any>self).sendMessage = (uid: number, msg: string) => {
    sendMessage(uid, msg, (r) => {
        console.log(r);
    })
}

(<any>self).addAdministror = (uid: number) => {
    addAdministror(uid);
}

(<any>self).applyGroup = (gid: number) => {
    applyGroup(gid);
}

(<any>self).acceptUserJoin = (uid: number, accept: boolean) => {
    acceptUserJoin(uid, accept);
}

(<any>self).sendAnnouncement = (gid: number) => {
    sendAnnounce(gid);
}

(<any>self).inviteUsersToGroup = (gid: number) => {
    inviteUsersToGroup();
}
