/**
 * 初始化store
 */
import { GENERATOR_TYPE } from '../../../server/data/db/user.s';
import { genGroupHid, genUserHid } from '../../../utils/util';
import { getFile, getLocalStorage, initFileStore, object2Map, setLocalStorage, writeFile } from './lcstore';
import * as store from './store';

/**
 * 更新当前用户的本地数据
 */
export const initAccount = () => {
    const sid = store.getStore('uid');
    initFileStore().then(() => {
        if (!sid) return;
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
        }, () => {
            console.log('read setting error');
        });
        // 单聊历史记录
        getFile(`${sid}-userChatMap`, (value) => {
            if (!value) return;
            store.setStore('userHistoryMap', object2Map(value.userHistoryMap), false);
            store.setStore('userChatMap', object2Map(value.userChatMap), false);
        },() => {
            console.log('read userChatMap error');
        });
        // 好友信息
        getFile(`${sid}-userInfoMap`, (value) => {
            if (!value) return;
            const userinfo  = object2Map(value.userInfoMap);

            store.setStore('userInfoMap', userinfo, false);
            const accIdToUid = store.getStore('accIdToUid',new Map());
            
            for (const key of Object.getOwnPropertyNames(userinfo)) {
                accIdToUid.set(userinfo[key].acc_id, JSON.parse(key));
            }
            store.setStore('accIdToUid',accIdToUid);
        },() => {
            console.log('read userInfoMap error');
        });
        // 群聊历史记录
        getFile(`${sid}-groupChatMap`, (value) => {
            if (!value) return;
            store.setStore('groupHistoryMap', object2Map(value.groupHistoryMap), false);
            store.setStore('groupChatMap', object2Map(value.groupChatMap), false);
            store.setStore('announceHistoryMap', object2Map(value.announceHistoryMap), false);
        },() => {
            console.log('read groupChatMap error');
        });
        // 群成员信息
        getFile(`${sid}-groupUserLinkMap`, (value) => {
            if (!value) return;
            store.setStore('groupUserLinkMap', object2Map(value.groupUserLinkMap), false);
            store.setStore('groupInfoMap', object2Map(value.groupInfoMap), false);
        },() => {
            console.log('read groupUserLinkMap error');
        });
        // 已读消息通知
        getFile(`${sid}-lastReadNotice`, (value) => {
            if (!value) return;
            store.setStore('lastReadNotice', value);
        },() => {
            console.log('read lastReadNotice error');
        });
        // 评论消息列表
        getFile(`${sid}-conmentList`, (value) => {
            if (!value) return;
            store.setStore('conmentList', value);
        },() => {
            console.log('read conmentList error');
        });
          // 点赞消息列表
        getFile(`${sid}-fabulousList`, (value) => {
            if (!value) return;
            store.setStore('fabulousList', value);
        },() => {
            console.log('read fabulousList error');
        });
        
    }).catch(err => {
        console.log('初始化indexDB失败：',err);
    });
    getLocalStorage(`${sid}-flags`,(value) => {
        if (!value) return;
        store.setStore('flags/noGroupRemind',value.noGroupRemind);
    });
};

/**
 * 单聊数据变化
 */
export const userChatChange = () => {
    const sid = store.getStore('uid');
    const value = {
        userHistoryMap:store.getStore('userHistoryMap'), // 单人聊天历史记录变化
        userChatMap:store.getStore('userChatMap')  // 单人聊天历史记录索引变化
    };

    writeFile(`${sid}-userChatMap`, value, () => {
        console.log('write success');
    }, () => {
        console.log('write userChatMapfail');
    });
};

/**
 * 好友数据变化
 */
export const friendChange = () => {
    const id = store.getStore('uid');
    const value = {
        userInfoMap: store.getStore('userInfoMap')  // 用户信息
    };
    writeFile(`${id}-userInfoMap`, value);
  
};

/**
 * 群组相关数据变化
 */
export const groupChatChange = () => {
    const id = store.getStore('uid');
    const value = {
        groupHistoryMap: store.getStore('groupHistoryMap'), // 群组聊天
        groupChatMap: store.getStore('groupChatMap'),
        announceHistoryMap: store.getStore('announceHistoryMap') // 群组公告
    };

    writeFile(`${id}-groupChatMap`, value);
};

/**
 * 群组用户数据变化
 */
export const groupUserLinkChange = () => {
    const id = store.getStore('uid');
    const value = {
        groupUserLinkMap:store.getStore('groupUserLinkMap'), // 群组用户
        groupInfoMap:store.getStore('groupInfoMap') // 群信息
    };
    writeFile(`${id}-groupUserLinkMap`, value);
};

/**
 * 已读消息游标更新
 */
export const lastReadChange = () => {
    const id = store.getStore('uid');
    const value = store.getStore('lastRead');// 当前已读
    writeFile(`${id}-lastRead`, value);

    updateUnReadFg();
};

/**
 * 最近会话列表更新
 */
export const lastChatChange = () => {
    const id = store.getStore('uid');
    const value = store.getStore('lastChat');// 最近会话
    writeFile(`${id}-lastChat`, value);

    updateUnReadFg();
};

/**
 * 更新是否有未读消息
 */
export const updateUnReadFg = () => {
    const sid = store.getStore('uid');
    const readList = store.getStore('lastRead',new Map());
    const chatlist = store.getStore('lastChat',[]);
    const msgAvoid = store.getStore('setting').msgAvoid || [];  // 消息免打扰
    let unReadFg = false; // 是否有未读消息

    for (const v of chatlist) {
        if (v[2] === GENERATOR_TYPE.USER) {
            const hid = genUserHid(sid,v[0]);
            const hIncIdArr = store.getStore(`userChatMap/${hid}`,[]);
            // // 没有阅读记录或 阅读记录不是最新一条且未设置消息面打扰
            if (!readList.get(hid) || (readList.get(hid).msgId !== hIncIdArr[hIncIdArr.length - 1] && msgAvoid.indexOf(hid) === -1)) {
                unReadFg = true;

                break;
            }
        } else {
            const hid = genGroupHid(v[0]);
            const hIncIdArr = store.getStore(`groupChatMap/${hid}`,[]);
            // 没有阅读记录或 阅读记录不是最新一条且未设置消息面打扰
            if (!readList.get(hid) || (readList.get(hid).msgId !== hIncIdArr[hIncIdArr.length - 1] && msgAvoid.indexOf(hid) === -1)) {
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
    const value = store.getStore('setting'); // 群组用户
    writeFile(`${id}-setting`, value);
};

/**
 * 标记设置
 */
export const flagsChange = () => {
    const sid = store.getStore('uid');
    setLocalStorage(`${sid}-flags`,store.getStore('flags'));
};

/**
 * 已读通知
 */
export const lastReadNotice = () => {
    const id = store.getStore('uid');
    const value = store.getStore('lastReadNotice');// 当前已读
    writeFile(`${id}-lastReadNotice`, value);
};

// 评论消息列表
export const conmentListChange = () => {
    const id = store.getStore('uid');
    const value = store.getStore('conmentList');
    writeFile(`${id}-conmentList`, value);
};

// 点赞消息列表
export const fabulousListChange = () => {
    const id = store.getStore('uid');
    const value = store.getStore('fabulousList');
    writeFile(`${id}-fabulousList`, value);
};
