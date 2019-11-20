/**
 * 初始化store
 */
import { GENERATOR_TYPE } from '../../../server/data/db/user.s';
import { genGroupHid, genUserHid } from '../../../utils/util';
import { getFile, getLocalStorage, initFileStore, setLocalStorage, writeFile } from './lcstore';
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
            const data  = value.userInfoMap;
            const accIdToUid = store.getStore('accIdToUid',[]);
            for (const [key,value] of data) {
                accIdToUid.set(value.acc_id,JSON.parse(key));
                store.setStore('accIdToUid',accIdToUid);
            }
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
            store.setStore('groupUserLinkMap', value.groupUserLinkMap || new Map(), false);
            store.setStore('groupInfoMap', value.groupInfoMap || new Map(), false);
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
        console.log('初始化本地数据失败',err);
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
        value.groupUserLinkMap = store.getStore('groupUserLinkMap'); // 群组用户
        value.groupInfoMap = store.getStore('groupInfoMap'); // 群信息
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
    getFile(`${id}-lastReadNotice`, (value) => {
        if (!value) {
            value = {};
        }
        setTimeout(() => {
            value = store.getStore('lastReadNotice');// 当前已读
            writeFile(`${id}-lastReadNotice`, value);
        }, 0);
    }, () => {
        console.log('read error');
    });
};

// 评论消息列表
export const conmentListChange = () => {
    const id = store.getStore('uid');
    getFile(`${id}-conmentList`, (value) => {
        if (!value) {
            value = {};
        }
        setTimeout(() => {
            value = store.getStore('conmentList');
            writeFile(`${id}-conmentList`, value);
        }, 0);
    }, () => {
        console.log('read error');
    });
};

// 点赞消息列表
export const fabulousListChange = () => {
    const id = store.getStore('uid');
    getFile(`${id}-conmentList`, (value) => {
        if (!value) {
            value = {};
        }
        setTimeout(() => {
            value = store.getStore('fabulousList');
            writeFile(`${id}-fabulousList`, value);
        }, 0);
    }, () => {
        console.log('read error');
    });
};
