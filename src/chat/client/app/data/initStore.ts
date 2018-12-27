/**
 * 初始化store
 */
import { GENERATOR_TYPE } from '../../../server/data/db/user.s';
import { getGroupHistory, getUserHistory } from '../../../server/data/rpc/basic.p';
import { GroupHistoryArray, GroupHistoryFlag, UserHistoryArray, UserHistoryFlag } from '../../../server/data/rpc/basic.s';
import { getGroupHistoryCursor, getUserHistoryCursor } from '../../../server/data/rpc/message.p';
import { HistoryCursor } from '../../../server/data/rpc/message.s';
import { genGroupHid, genGuid, genHIncId, genUserHid, genUuid, getIndexFromHIncId, getUidFromUuid } from '../../../utils/util';
import { clientRpcFunc } from '../net/init';
import { getFile, initFileStore, writeFile } from './lcstore';
import { updateGroupMessage, updateUserMessage } from './parse';
import * as store from './store';

/**
 * 更新当前用户的本地数据
 */
export const initAccount = () => {
    initFileStore().then(() => {
        const sid = store.getStore('uid');
        if (!sid) return;
        getFile(sid, (value) => {
            if (!value) return;
            store.setStore('userHistoryMap', value.userHistoryMap || new Map(), false);
            store.setStore('userChatMap', value.userChatMap || new Map(), false);
            store.setStore('friendLinkMap', value.friendLinkMap || new Map(), false);
            store.setStore('userInfoMap', value.userInfoMap || new Map(), false);
            store.setStore('groupHistoryMap', value.groupHistoryMap || new Map(), false);
            store.setStore('groupChatMap', value.groupChatMap || new Map(), false);
            store.setStore('groupUserLinkMap', value.groupUserLinkMap || new Map(), false);
            store.setStore('announceHistoryMap', value.announceHistoryMap || new Map(), false);
            store.setStore('lastChat', value.lastChat || []);
            store.setStore('lastRead', value.lastRead || new Map());
            console.log('store init success', store);
        }, () => {
            console.log('read error');
        });
    });

};

/**
 * 请求好友发的消息历史记录
 */
export const getFriendHistory = (rid: number) => {
    const sid = store.getStore('uid');
    const hid = genUserHid(sid, rid);
    if (sid === rid) return;

    clientRpcFunc(getUserHistoryCursor, rid, (r: HistoryCursor) => {
        const lastRead = {
            msgId: '',
            msgType: GENERATOR_TYPE.USER
        };
        if (r && r.code === 1) {
            const cursor = r.cursor;
            lastRead.msgId = genHIncId(hid, r.cursor);
            const lastHincId = store.getStore(`lastRead/${hid}`, { msgId: undefined }).msgId;
            const localCursor = lastHincId ? getIndexFromHIncId(lastHincId) : -1;
            if (cursor > localCursor) {
                store.setStore(`lastRead/${hid}`, lastRead);
            }
            // 服务器最新消息
            const lastMsgId = r.last;
            const userflag = new UserHistoryFlag();
            userflag.rid = rid;
            const hIncIdArr = store.getStore(`userChatMap/${hid}`, []);
            userflag.start = hIncIdArr && hIncIdArr.length > 0 ? getUidFromUuid(hIncIdArr[hIncIdArr.length - 1]) : 0;
            userflag.end = lastMsgId;
            if (userflag.end > userflag.start) {
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
export const getMyGroupHistory = (gid: number) => {
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
            if (cursor > localCursor) {
                store.setStore(`lastRead/${hid}`, lastRead);
            }
            const groupflag = new GroupHistoryFlag();
            groupflag.gid = gid;
            const hIncIdArr = store.getStore(`groupChatMap/${hid}`, []);
            // 获取本地最新消息ID
            groupflag.start = hIncIdArr && hIncIdArr.length > 0 ? getIndexFromHIncId(hIncIdArr[hIncIdArr.length - 1]) : 0;
            groupflag.end = lastMsgId;
            if (groupflag.end > groupflag.start) {
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
    const id = store.getStore('uid');
    getFile(id, (value) => {
        if (!value) {
            value = {};
        }
        value.userHistoryMap = store.getStore('userHistoryMap'); // 单人聊天历史记录变化
        value.userChatMap = store.getStore('userChatMap');  // 单人聊天历史记录索引变化
        value.lastChat = store.getStore('lastChat');  // 最近聊天记录
        value.lastRead = store.getStore('lastRead');// 当前已读

        setTimeout(() => {
            writeFile(id, value, () => {
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
    getFile(id, (value) => {
        if (!value) {
            value = {};
        }
        value.friendLinkMap = store.getStore('friendLinkMap'); // 好友链接
        value.userInfoMap = store.getStore('userInfoMap');  // 用户信息
        writeFile(id, value);
    }, () => {
        console.log('read error');
    });
};

/**
 * 群组相关数据变化
 */
export const groupChatChange = () => {
    const id = store.getStore('uid');
    getFile(id, (value) => {
        if (!value) {
            value = {};
        }
        value.groupHistoryMap = store.getStore('groupHistoryMap'); // 群组聊天
        value.groupChatMap = store.getStore('groupChatMap');
        value.announceHistoryMap = store.getStore('announceHistoryMap'); // 群组公告
        value.lastChat = store.getStore('lastChat');  // 最近聊天记录
        value.lastRead = store.getStore('lastRead');// 当前已读

        setTimeout(() => {
            writeFile(id, value, () => {
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
    getFile(id, (value) => {
        if (!value) {
            value = {};
        }
        value.groupUserLinkMap = store.getStore('groupUserLinkMap'); // 群组用户
        writeFile(id, value);
    }, () => {
        console.log('read error');
    });
};