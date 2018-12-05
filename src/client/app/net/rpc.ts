/**
 * 调用rpc接口
 */
// ================================================ 导入
import { GroupMsg, MSG_TYPE, UserHistory } from '../../../server/data/db/message.s';
import { UserInfo } from '../../../server/data/db/user.s';
import { getFriendLinks, getGroupsInfo, getUsersInfo, isUserOnline, login as loginUser, registerUser, setUserInfo as setUserProfile } from '../../../server/data/rpc/basic.p';
import { GetFriendLinksReq, GetGroupInfoReq, GetUserInfoReq, LoginReq, Result, UserArray, UserInfoSet, UserRegister } from '../../../server/data/rpc/basic.s';
import { acceptUser, addAdmin, applyJoinGroup, createGroup as createGroupp, delMember, dissolveGroup, inviteUsers } from '../../../server/data/rpc/group.p';
import { GroupAgree, GroupCreate, Invite, InviteArray } from '../../../server/data/rpc/group.s';
import { sendAnnouncement, sendGroupMessage, sendUserMessage } from '../../../server/data/rpc/message.p';
import { AnnounceSend, GroupSend, UserSend } from '../../../server/data/rpc/message.s';
import { acceptFriend as acceptUserFriend, applyFriend as applyUserFriend, delFriend as delUserFriend } from '../../../server/data/rpc/user.p';
import { UserAgree } from '../../../server/data/rpc/user.s';
import { setStore } from '../data/store';
import { clientRpcFunc, subscribe } from './init';

// ================================================ 导出
/**
 * 普通用户注册
 * @param name user name 
 * @param passwd user passwd
 * @param cb callback
 */
export const register = (name: string, passwdHash: string, cb: (r: UserInfo) => void) => {
    const info = new UserRegister();
    info.name = name;
    info.passwdHash = passwdHash;
    clientRpcFunc(registerUser, info, (r: UserInfo) => {
        setStore(`userInfoMap/${r.uid}`,r);
        cb(r);
    });
};

/**
 * 普通用户登录
 * @param uid user id 
 * @param passwdHash passwd hash
 * @param cb callback
 */
export const login = (uid: number, passwdHash: string, cb: (r: UserInfo) => void) => {
    const info = new LoginReq();
    info.uid = uid;
    info.passwdHash = passwdHash;
    clientRpcFunc(loginUser, info, (r: UserInfo) => {
        cb(r);
    });
};
/**
 * 获取用户基本信息
 *
 * @param uid user id 
 */
export const getUsersBasicInfo = (uids:number[],cb: (r:UserArray) => void) => {
    const info = new GetUserInfoReq();
    info.uids = uids;
    clientRpcFunc(getUsersInfo,info,(r:UserArray) => {
        cb(r);
    });
};
/**
 * 单聊
 * @param rid reader id
 * @param msg message
 * @param cb callback
 */
export const sendMessage = (rid: number, msg: string, cb: (r: UserHistory) => void, msgType= MSG_TYPE.TXT) => {
    const info = new UserSend();
    info.msg = msg;
    info.mtype = msgType;
    info.rid = rid;
    info.time = (new Date()).getTime();

    clientRpcFunc(sendUserMessage, info, (r: UserHistory) => {
        cb(r);
    });
};

/**
 * 申请添加rid为好友
 * @param rid reader id
 * @param cb callback
 */
export const applyFriend = (rid: number, cb: (r:Result) => void) => {
    clientRpcFunc(applyUserFriend, rid, (r: Result) => {
        cb(r);
    });
};

/**
 * 接受对方为好友
 * @param rid reader
 * @param cb callback
 */
export const acceptFriend = (rid: number, agree: boolean, cb: (r:Result) => void) => {
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
export const delFriend = (rid: number, cb: (r:Result) => void) => {
    clientRpcFunc(delUserFriend, rid, (r: Result) => {
        cb(r);
    });
};
// ================  debug purpose ==========================

export const setUserInfo = () => {
    const userInfoSet = new UserInfoSet();
    userInfoSet.avator = 'avatar';
    userInfoSet.name = 'wtf';
    userInfoSet.note = 'xxx';
    userInfoSet.sex = 0;
    userInfoSet.tel = '13800000000';

    clientRpcFunc(setUserProfile, userInfoSet, (r) => {
        console.log(r);
    });
};

export const createGroup = () => {
    const x = new GroupCreate();
    x.note = 'wtf';
    x.name = 'xxx';

    clientRpcFunc(createGroupp, x, (r) => {
        console.log(r);
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

export const sendGroupMsg = () => {
    const msg = new GroupSend();
    msg.gid = 11111;
    msg.msg = 'hi group';
    msg.mtype = 0;
    msg.time = Date.now();

    clientRpcFunc(sendGroupMessage, msg, (r) => {
        console.log(r);
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

export const sendAnnounce = (gid: number) => {
    const a = new AnnounceSend();
    a.gid = gid;
    a.msg = 'new announcement';
    a.mtype = 1;
    a.time = Date.now();

    clientRpcFunc(sendAnnouncement, a, (r) => {
        console.log(r);
    });
};

export const inviteUsersToGroup = () => {
    const ia = new InviteArray();
    const invite1 = new Invite();
    invite1.gid = 11111;
    invite1.rid = 10001;

    const invite2 = new Invite();
    invite2.gid = 11111;
    invite2.rid = 10002;

    const invite3 = new Invite();
    invite3.gid = 11111;
    invite3.rid = 10003;

    ia.arr = [invite1, invite2, invite3];

    clientRpcFunc(inviteUsers, ia, (r) => {
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

export const userOnline = (uid: number) => {
    clientRpcFunc(isUserOnline, uid, (r) => {
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

(<any>self).userOnline = (uid: number) => {
    userOnline(uid);
};

(<any>self).subscribeGroupMsg = (topicName: string) => {
    subscribe(topicName, GroupMsg, (r) => {
        // TODO:
    });
};

(<any>self).getGroupInfo = () => {
    getGroupInfo();
};

(<any>self).setUserInfo = () => {
    setUserInfo();
};

(<any>self).login = (uid: number, passwdHash: string) => {
    login(uid, passwdHash, (r) => {
        console.log(r);
    });
};

(<any>self).register = (name: string, passwdHash: string) => {
    register(name, passwdHash, (r) => {
        console.log(r);
    });
};

(<any>self).createGroup = () => {
    createGroup();
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
    sendMessage(uid, msg, (r) => {
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

(<any>self).sendAnnouncement = (gid: number) => {
    sendAnnounce(gid);
};

(<any>self).inviteUsersToGroup = (gid: number) => {
    inviteUsersToGroup();
};
