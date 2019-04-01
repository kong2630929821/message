/**
 * 调用rpc接口
 */
// ================================================ 导入
import { DEFAULT_ERROR_STR } from '../../../server/data/constant';
import { GroupInfo } from '../../../server/data/db/group.s';
import { MSG_TYPE, UserHistory } from '../../../server/data/db/message.s';
import { Contact, FrontStoreData, GENERATOR_TYPE, UserInfo } from '../../../server/data/db/user.s';
import { getData, getFriendLinks, getGroupHistory, getGroupsInfo, getUserHistory, getUsersInfo, login as loginUser } from '../../../server/data/rpc/basic.p';
// tslint:disable-next-line:max-line-length
import { GetFriendLinksReq, GetGroupInfoReq, GetUserInfoReq, GroupArray, GroupHistoryArray, GroupHistoryFlag, LoginReq, Result, UserArray, UserHistoryArray, UserHistoryFlag, UserType, UserType_Enum, WalletLoginReq } from '../../../server/data/rpc/basic.s';
// tslint:disable-next-line:max-line-length
import { acceptUser, addAdmin, applyJoinGroup, createGroup as createNewGroup, delMember, dissolveGroup } from '../../../server/data/rpc/group.p';
import { GroupAgree, GroupCreate } from '../../../server/data/rpc/group.s';
import { getGroupHistoryCursor, getUserHistoryCursor, sendGroupMessage, sendTempMessage, sendUserMessage } from '../../../server/data/rpc/message.p';
import { GroupSend, HistoryCursor, TempSend, UserSend } from '../../../server/data/rpc/message.s';
// tslint:disable-next-line:max-line-length
import { acceptFriend as acceptUserFriend, applyFriend, delFriend as delUserFriend, set_gmAccount } from '../../../server/data/rpc/user.p';
import { UserAgree } from '../../../server/data/rpc/user.s';
import { genGroupHid, genHIncId, genUserHid, getIndexFromHIncId } from '../../../utils/util';
import { updateGroupMessage, updateUserMessage } from '../data/parse';
import * as store from '../data/store';
import { clientRpcFunc } from './init';

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
export const getUsersBasicInfo = (uids: number[], accIds:string[] = []) => {
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
 * 请求好友发的消息历史记录
 */
export const getFriendHistory = (rid: number, gid?:number, upLastRead: boolean = false) => {
    const sid = store.getStore('uid');
    if (sid === rid) return;

    clientRpcFunc(getUserHistoryCursor, rid, (r: HistoryCursor) => {
        const hid = genUserHid(sid, rid);
        const lastRead = {
            msgId: '',
            msgType: GENERATOR_TYPE.USER
        };
        if (r && r.code === 1) {
            const cursor = r.cursor;
            lastRead.msgId = genHIncId(hid, cursor);
            const lastHincId = store.getStore(`lastRead/${hid}`, { msgId: undefined }).msgId;
            const localCursor = lastHincId ? getIndexFromHIncId(lastHincId) : -1;
            if (cursor > localCursor && (upLastRead || !lastHincId)) { // 本地没有记录时需要更新
                store.setStore(`lastRead/${hid}`, lastRead);
            }
            // 服务器最新消息
            const lastMsgId = r.last;
            const userflag = new UserHistoryFlag();
            userflag.rid = rid;
            const hIncIdArr = store.getStore(`userChatMap/${hid}`, []);
            
            // 如果本地有记录从本地最后一条记录开始获取聊天消息
            // 本地没有记录则从服务器游标开始获取聊天消息
            userflag.start = hIncIdArr && hIncIdArr.length > 0 ? (getIndexFromHIncId(hIncIdArr[hIncIdArr.length - 1]) + 1) : (cursor + 1);
            userflag.end = lastMsgId;
            if (userflag.end >= userflag.start) {
                clientRpcFunc(getUserHistory, userflag, (r: UserHistoryArray) => {
                    // console.error('uuid: ',hid,'initStore getFriendHistory',r);
                    if (r.newMess > 0) {
                        r.arr.forEach(element => {
                            updateUserMessage(userflag.rid, element, gid);
                        });
                    }
                });
            }

        }

    });
};

/**
 * 请求群聊消息历史记录
 */
export const getMyGroupHistory = (gid: number, upLastRead: boolean = false) => {
    const hid = genGroupHid(gid);

    // 获取最新消息和游标
    clientRpcFunc(getGroupHistoryCursor, gid, (r: HistoryCursor) => {
        const lastRead = {
            msgId: '',
            msgType: GENERATOR_TYPE.GROUP
        };
        if (r.code === 1) {
            // 服务端游标
            const cursor = r.cursor;
            // 服务端最新消息ID
            const lastMsgId = r.last;
            lastRead.msgId = genHIncId(hid, r.cursor);
            const lastHincId = store.getStore(`lastRead/${hid}`, { msgId: undefined }).msgId;
            const localCursor = lastHincId ? getIndexFromHIncId(lastHincId) : -1;
            if (cursor > localCursor &&  (upLastRead || !lastHincId)) { // 本地没有记录时需要更新
                store.setStore(`lastRead/${hid}`, lastRead);
            }
            const groupflag = new GroupHistoryFlag();
            groupflag.gid = gid;
            const hIncIdArr = store.getStore(`groupChatMap/${hid}`, []);
            // 获取本地最新消息ID
            groupflag.start = hIncIdArr && hIncIdArr.length > 0 ? (getIndexFromHIncId(hIncIdArr[hIncIdArr.length - 1]) + 1) : (cursor + 1);
            groupflag.end = lastMsgId;
            if (groupflag.end >= groupflag.start) {
                clientRpcFunc(getGroupHistory, groupflag, (r: GroupHistoryArray) => {
                    if (r && r.newMess > 0) {
                        r.arr.forEach(element => {
                            updateGroupMessage(gid, element);
                        });
                    }
                });
            }

        }

    });
};

/**
 * 获取额外设置
 */
export const getSetting = () => {
    const sid = store.getStore('uid');
    clientRpcFunc(getData,sid,(r:FrontStoreData) => {
        if (r && r.uid === sid) {
            const setting = r.value ? JSON.parse(r.value) :{ msgAvoid:[],msgTop:[] };
            store.setStore('setting',setting);
        } 
    });
};

/**
 * 设置某个账号为游戏客服
 */
export const setGameServer = (uid:number) => {
    clientRpcFunc(set_gmAccount,uid,(r) => {
        console.log('设置客服账号',uid,r);
    });
};

/**
 * 申请添加rid为好友
 * @param rid reader id
 * @param cb callback
 */
export const applyUserFriend = (user: string) => {
    return new Promise((resolve,reject) => {
        clientRpcFunc(applyFriend, user, (r: Result) => {
            if (r && (r.r === 1 || r.r === 0)) {
                resolve(r.r);
            } else {
                reject(r);
            }
        });
    });
    
};

/**
 * 申请添加游戏客服
 * @param uid user id
 * 返回值是uid
 */
export const applyGameServer = (uid: number) => {

    return new Promise((resolve,reject) => {
        applyUserFriend(uid.toString()).then(() => {
            resolve(uid);
        },() => {
            reject();
        });
        
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

// 用户申请入群
export const applyToGroup = (gid:number) => {
    const sid = store.getStore('uid');
    const contact = store.getStore(`contactMap/${sid}`,new Contact());

    return new Promise((resolve,reject) => {
        if (contact.group.indexOf(gid) === -1) {
            clientRpcFunc(applyJoinGroup, gid, ((r) => {
                if (r && r.r === 1) {
                    resolve();
                } else {
                    reject(r);
                }
                
            }));
        } else {
            resolve();
        }
    });
    
};

/**
 * 获取群组信息
 */
export const getGroupBasicInfo = (gids:number[]) => {
    const groups = new GetGroupInfoReq();
    groups.gids = gids;

    return new Promise((resolve,reject) => {
        clientRpcFunc(getGroupsInfo, groups, (r: GroupArray) => {
            console.log('获取群组信息成功',r);
            if (r && r.arr.length > 0) {
                resolve(r.arr);
            } else {
                reject(r);
            }
        });
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

export const acceptUserJoin = (uid: number, accept: boolean) => {
    const ga = new GroupAgree();
    ga.agree = accept;
    ga.gid = 11111;
    ga.uid = uid;

    clientRpcFunc(acceptUser, ga, (r) => {
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
