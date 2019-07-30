/**
 * 调用rpc接口
 */
// ================================================ 导入
import { DEFAULT_ERROR_STR } from '../../../server/data/constant';
import { CommentKey, PostKey } from '../../../server/data/db/community.s';
import { GroupInfo } from '../../../server/data/db/group.s';
import { MSG_TYPE, UserHistory } from '../../../server/data/db/message.s';
import { Contact, FrontStoreData, GENERATOR_TYPE, UserInfo } from '../../../server/data/db/user.s';
// tslint:disable-next-line:max-line-length
import { getData, getFriendLinks, getGroupHistory, getGroupsInfo, getUserHistory, getUsersInfo, login as loginUser } from '../../../server/data/rpc/basic.p';
// tslint:disable-next-line:max-line-length
import { GetFriendLinksReq, GetGroupInfoReq, GetUserInfoReq, GroupArray, GroupHistoryArray, GroupHistoryFlag, LoginReq, Result, UserArray, UserHistoryArray, UserHistoryFlag, UserType, UserType_Enum, WalletLoginReq } from '../../../server/data/rpc/basic.s';
import { addCommentPost, addPostPort, commentLaudPost, createCommunityNum, postLaudPost, showCommentPort, showPostPort, showUserFollowPort, userFollow } from '../../../server/data/rpc/community.p';
import { AddCommentArg, AddPostArg, CreateCommunity, IterCommentArg, IterPostArg, NumArr, PostArr } from '../../../server/data/rpc/community.s';
// tslint:disable-next-line:max-line-length
import { acceptUser, addAdmin, applyJoinGroup, createGroup as createNewGroup, delMember, dissolveGroup } from '../../../server/data/rpc/group.p';
import { GroupAgree, GroupCreate, GuidsAdminArray } from '../../../server/data/rpc/group.s';
// tslint:disable-next-line:max-line-length
import { getGroupHistoryCursor, getUserHistoryCursor, sendGroupMessage, sendTempMessage, sendUserMessage } from '../../../server/data/rpc/message.p';
import { GroupSend, HistoryCursor, TempSend, UserSend } from '../../../server/data/rpc/message.s';
// tslint:disable-next-line:max-line-length
import { acceptFriend as acceptUserFriend, applyFriend, delFriend as delUserFriend, getRealUid, set_gmAccount } from '../../../server/data/rpc/user.p';
import { SetOfficial, UserAgree } from '../../../server/data/rpc/user.s';
import { genGroupHid, genGuid, genHIncId, genUserHid, getIndexFromHIncId } from '../../../utils/util';
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
 * 获取用户的真实聊天uid
 * @param user accid wallet_address uid phone
 */
export const getChatUid = (user:string) => {
    return new Promise((resolve,reject) => {
        clientRpcFunc(getRealUid,user,(r:number) => {
            console.log('!!!!!!!!!!!!!!!!!!!!getChatUid',r);
            if (r !== -1) {
                resolve(r);
            } else {
                reject();
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
            // const localCursor = lastHincId ? getIndexFromHIncId(lastHincId) : -1;  // 本地游标
            if (upLastRead || !lastHincId) { // 强制更新 || 本地没有记录 
                store.setStore(`lastRead/${hid}`, lastRead);
            }
            console.log(`===============lastRead/${hid}`,store.getStore(`lastRead/${hid}`));
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
export const setGameServer = (accId:string,appId:string) => {
    const setuser = new SetOfficial();
    setuser.accId = accId;
    setuser.appId = appId;
    clientRpcFunc(set_gmAccount,setuser,(r) => {
        console.log('设置客服账号',setuser,r);
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
    console.log('applyToGroup sid = ',sid);
    console.log('applyToGroup contact = ',contact);
    console.log('applyToGroup gid = ',gid);

    return new Promise((resolve,reject) => {
        if (contact.group && contact.group.indexOf(gid) === -1) {
            console.log('applyToGroup indexOf === -1');
            clientRpcFunc(applyJoinGroup, gid, ((r) => {
                console.log('applyToGroup r = ',r);
                if (r && r.r === 1) {
                    // if (!store.getStore(`groupInfoMap/${gid}`, null)) {
                    //     getGroupBasicInfo([gid]).then((ginfo) => {
                    //         store.setStore(`groupInfoMap/${gid}`,ginfo[0]);
                    //     });
                    //     resolve(gid);
                    // } 
                    resolve(gid);
                    
                } else {
                    reject(r);
                }
                
            }));
        } else {
            resolve(gid);
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

export const addAdministror = (gid:number,uids: number[]) => {
    const guidsAdmin = new GuidsAdminArray();
    const guids = uids.map(item => genGuid(gid, item));
    guidsAdmin.guids = guids;

    return new Promise((resolve,reject) => {
        clientRpcFunc(addAdmin,guidsAdmin,(r:Result) => {
            if (r && r.r === 1) {
                resolve();
            } else {
                reject(r);
            }
        });    
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

/**
 * 创建公众号
 */
export const addCommunityNum = (name: string, comm_type: number, desc: string) => {
    const arg = new CreateCommunity();
    arg.comm_type = comm_type;
    arg.name = name;
    arg.desc = desc;
    clientRpcFunc(createCommunityNum,arg,(r:string) => {
        if (r) {
            console.log(r);
        } 
    });
};

/**
 * 关注公众号
 */
export const follow = (num: string) => {
    clientRpcFunc(userFollow,num,(r:boolean) => {
        if (r) {
            console.log(r);
        } 
    });
};

/**
 * 添加动态
 */
export const addPost = (num: string, title: string, body: string, post_type: number) => {
    const arg = new AddPostArg();
    arg.num = num;
    arg.title = title;
    arg.body = body;
    arg.post_type = post_type;
    clientRpcFunc(addPostPort,arg,(r:PostKey) => {
        if (r) {
            console.log(r);
        } 
    });
};

/**
 * 帖子点赞或取消点赞
 */
export const postLaud = (num: string, id: number) => {
    const arg = new PostKey();
    arg.num = num;
    arg.id = id;
    clientRpcFunc(postLaudPost,arg,(r:boolean) => {
        if (r) {
            console.log(r);
        } 
    });
};

/**
 * 评论
 */
export const addComment = (num: string, comment_type: number, msg:string, post_id: number, reply: number) => {
    const arg = new AddCommentArg();
    arg.num = num;
    arg.comment_type = comment_type;
    arg.msg = msg;
    arg.post_id = post_id;
    arg.reply = reply;
    clientRpcFunc(addCommentPost,arg,(r:CommentKey) => {
        if (r) {
            console.log(r);
        } 
    });
};

/**
 * 评论点赞
 */
export const commentLaud = (num: string, post_id: number, id: number) => {
    const arg = new CommentKey();
    arg.num = num;
    arg.id = id;
    arg.post_id = post_id;
    clientRpcFunc(commentLaudPost,arg,(r:boolean) => {
        if (r) {
            console.log(r);
        } 
    });
};

/**
 * 获取关注的公众号
 * num_type暂时没什么用
 */
export const showUserFollow = (num_type:number = 1) => {
    clientRpcFunc(showUserFollowPort, num_type, (r:NumArr) => {
        if (r) {
            console.log(r);
        } 
    });
};

/**
 * 获取最新的帖子
 */
export const showPost = (num:string, id:number = 0, count:number = 20) => {
    const arg = new IterPostArg();
    arg.count = count;
    arg.id = id;
    arg.num = num;
    clientRpcFunc(showPostPort,arg,(r:PostArr) => {
        if (r) {
            console.log(r);
        } 
    });
};

/**
 * 获取最新的评论
 * id=0表示从最新的一条数据获取count条数据
 */
export const showComment = (num:string, post_id:number, id:number = 0, count:number = 20) => {
    const arg = new IterCommentArg();
    arg.count = count;
    arg.id = id;
    arg.num = num;
    arg.post_id = post_id;
    clientRpcFunc(showCommentPort,arg,(r:PostArr) => {
        if (r) {
            console.log(r);
        } 
    });
};