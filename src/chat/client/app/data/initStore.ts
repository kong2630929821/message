/**
 * 初始化store
 */
import { FrontStoreData, GENERATOR_TYPE } from '../../../server/data/db/user.s';
import { getData, getGroupHistory, getUserHistory } from '../../../server/data/rpc/basic.p';
import { GroupHistoryArray, GroupHistoryFlag, UserHistoryArray, UserHistoryFlag } from '../../../server/data/rpc/basic.s';
import { getGroupHistoryCursor, getUserHistoryCursor } from '../../../server/data/rpc/message.p';
import { HistoryCursor } from '../../../server/data/rpc/message.s';
import { genGroupHid, genHIncId, genUserHid, getIndexFromHIncId } from '../../../utils/util';
import { clientRpcFunc } from '../net/init';
import { getFile, getLocalStorage, initFileStore, setLocalStorage, writeFile } from './lcstore';
import { updateGroupMessage, updateUserMessage } from './parse';
import * as store from './store';

/**
 * 更新当前用户的本地数据
 */
export const initAccount = () => {
    const sid = store.getStore('uid');
    initFileStore().then(() => {
        if (!sid) return;
        // 单聊历史记录
        getFile(`${sid}-userChatMap`, (value) => {
            if (!value) return;
            store.setStore('userHistoryMap', value.userHistoryMap || new Map(), false);
            store.setStore('userChatMap', value.userChatMap || new Map(), false);
        },() => {
            console.log('read userChatMap error');
        });
        // 好友信息
        getFile(`${sid}-userInfoMap`, (value) => {
            if (!value) return;
            store.setStore('userInfoMap', value.userInfoMap || new Map(), false);
            store.setStore('friendLinkMap', value.friendLinkMap || new Map(), false);
        },() => {
            console.log('read userInfoMap error');
        });
        // 群聊历史记录
        getFile(`${sid}-groupChatMap`, (value) => {
            if (!value) return;
            store.setStore('groupHistoryMap', value.groupHistoryMap || new Map(), false);
            store.setStore('groupChatMap', value.groupChatMap || new Map(), false);
            store.setStore('announceHistoryMap', value.announceHistoryMap || new Map(), false);
        },() => {
            console.log('read groupChatMap error');
        });
        // 群成员信息
        getFile(`${sid}-groupUserLinkMap`, (value) => {
            if (!value) return;
            store.setStore('groupUserLinkMap', value || new Map(), false);
        },() => {
            console.log('read groupUserLinkMap error');
        });
        // 最近会话列表
        getFile(`${sid}-lastChat`, (value) => {
            if (!value) return;
            store.setStore('lastChat', value || []);
        },() => {
            console.log('read lastChat error');
        });
        // 已读消息记录
        getFile(`${sid}-lastRead`, (value) => {
            if (!value) return;
            store.setStore('lastRead', value || new Map());
        },() => {
            console.log('read lastRead error');
        });
        // 额外设置信息
        getFile(`${sid}-setting`, (value) => {
            if (!value) return;
            store.setStore('setting', value || null);
            if (!value) {
                getSetting(); // 获取设置，本地没有则从服务器获取
            }
        }, () => {
            console.log('read setting error');
        });
    });
    getLocalStorage(`${sid}-flags`,(value) => {
        if (!value) return;
        store.setStore('flags/noGroupRemind',value.noGroupRemind);
    });
};

/**
 * 请求好友发的消息历史记录
 */
export const getFriendHistory = (rid: number, upLastRead: boolean = false) => {
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
                            updateUserMessage(userflag.rid, element);
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
 * 单聊数据变化
 */
export const userChatChange = () => {
    const sid = store.getStore('uid');
    getFile(`${sid}-userChatMap`, (value) => {
        if (!value) {
            value = {};
        }
        value.userHistoryMap = store.getStore('userHistoryMap'); // 单人聊天历史记录变化
        value.userChatMap = store.getStore('userChatMap');  // 单人聊天历史记录索引变化

        setTimeout(() => {
            writeFile(`${sid}-userChatMap`, value, () => {
                console.log('write success');
            }, () => {
                console.log('fail!!!!!!!!!!');
            });
        }, 0);

    }, () => {
        console.log('read error');
    });

};

/**
 * 好友数据变化
 */
export const friendChange = () => {
    const id = store.getStore('uid');
    getFile(`${id}-userInfoMap`, (value) => {
        if (!value) {
            value = {};
        }
        value.friendLinkMap = store.getStore('friendLinkMap'); // 好友链接
        value.userInfoMap = store.getStore('userInfoMap');  // 用户信息
        writeFile(`${id}-userInfoMap`, value);
    }, () => {
        console.log('read error');
    });
};

/**
 * 群组相关数据变化
 */
export const groupChatChange = () => {
    const id = store.getStore('uid');
    getFile(`${id}-groupChatMap`, (value) => {
        if (!value) {
            value = {};
        }
        value.groupHistoryMap = store.getStore('groupHistoryMap'); // 群组聊天
        value.groupChatMap = store.getStore('groupChatMap');
        value.announceHistoryMap = store.getStore('announceHistoryMap'); // 群组公告

        setTimeout(() => {
            writeFile(`${id}-groupChatMap`, value, () => {
                console.log('write success');
            }, () => {
                console.log('fail!!!!!!!!!!');
            });
        }, 0);

    }, () => {
        console.log('read error');
    });
};

/**
 * 群组用户数据变化
 */
export const groupUserLinkChange = () => {
    const id = store.getStore('uid');
    getFile(`${id}-groupUserLinkMap`, (value) => {
        if (!value) {
            value = {};
        }
        value = store.getStore('groupUserLinkMap'); // 群组用户
        writeFile(`${id}-groupUserLinkMap`, value);
    }, () => {
        console.log('read error');
    });
};

/**
 * 已读消息游标更新
 */
export const lastReadChange = () => {
    const id = store.getStore('uid');
    getFile(`${id}-lastRead`, (value) => {
        if (!value) {
            value = {};
        }
        setTimeout(() => {
            value = store.getStore('lastRead');// 当前已读
            writeFile(`${id}-lastRead`, value);
        }, 0);
    }, () => {
        console.log('read error');
    });

    updateUnReadFg();
};

/**
 * 最近会话列表更新
 */
export const lastChatChange = () => {
    const id = store.getStore('uid');
    getFile(`${id}-lastChat`, (value) => {
        if (!value) {
            value = {};
        }
        setTimeout(() => {
            value = store.getStore('lastChat');// 最近会话
            writeFile(`${id}-lastChat`, value);
        }, 0);
    }, () => {
        console.log('read error');
    });

    updateUnReadFg();
};

/**
 * 更新是否有未读消息
 */
export const updateUnReadFg = () => {
    const sid = store.getStore('uid');
    const readList = store.getStore('lastRead',new Map());
    const chatlist = store.getStore('lastChat',[]);
    let unReadFg = false; // 是否有未读消息
    if (chatlist.length > readList.size) {
        unReadFg = true;
        // 是否有未读消息 状态变化执行
        if (store.getStore('flags').unReadFg !== unReadFg) {
            store.setStore('flags/unReadFg',unReadFg);
        }  

        return;
    }

    for (const v of chatlist) {
        if (v[2] === GENERATOR_TYPE.USER) {
            const hid = genUserHid(sid,v[0]);
            const hIncIdArr = store.getStore(`userChatMap/${hid}`,[]);
            // 已读消息ID是否等于聊天记录的最后一条ID
            if (readList.get(hid) && readList.get(hid).msgId !== hIncIdArr[hIncIdArr.length - 1]) {
                unReadFg = true;

                break;
            }
        } else {
            const hid = genGroupHid(v[0]);
            const hIncIdArr = store.getStore(`groupChatMap/${hid}`,[]);
            if (readList.get(hid) && readList.get(hid).msgId !== hIncIdArr[hIncIdArr.length - 1]) {
                unReadFg = true;

                break;
            }
        }
    }
    // 是否有未读消息 状态变化执行
    if (store.getStore('flags').unReadFg !== unReadFg) {
        store.setStore('flags/unReadFg',unReadFg);
    }  
};

/**
 * 设置内容更新
 */
export const settingChange = () => {
    const id = store.getStore('uid');
    getFile(`${id}-setting`, (value) => {
        if (!value) {
            value = {};
        }
        value = store.getStore('setting'); // 群组用户
        writeFile(`${id}-setting`, value);
    }, () => {
        console.log('read error');
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
 * 标记设置
 */
export const flagsChange = () => {
    const sid = store.getStore('uid');
    setLocalStorage(`${sid}-flags`,store.getStore('flags'));
};