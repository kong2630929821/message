/**
 * 数据存储
 */

// ============================================ 导入
import { HandlerMap } from '../../../../pi/util/event';
import { AttentionIndex, CommunityBase, LaudPostIndex } from '../../../server/data/db/community.s';
import { AddressInfo } from '../../../server/data/db/extra.s';
import { GroupInfo, GroupUserLink } from '../../../server/data/db/group.s';
import { AnnounceHistory, GroupMsg, MsgLock, UserMsg } from '../../../server/data/db/message.s';
import { AccountGenerator, Contact, FriendLink, GENERATOR_TYPE, UserCredential, UserInfo } from '../../../server/data/db/user.s';
// tslint:disable-next-line:max-line-length
import { conmentListChange, fabulousListChange, flagsChange, friendChange, groupChatChange, groupUserLinkChange, initAccount, lastChatChange, lastReadChange, lastReadNotice, settingChange, userChatChange } from './initStore';

// ============================================ 导出

/**
 * 根据路径获取数据
 */
export const getStore = (path: string, defaultValue = undefined) => {
    let ret = store;
    for (const key of path.split('/')) {
        if (key in ret) {
            ret = ret[key];
        } else if (ret instanceof Map) {
            ret = ret.get(key);
        } else {
            // 路径中有和store内部不同的键，肯定是bug
            // tslint:disable-next-line:prefer-template
            throw new Error('getStore Failed, path = ' + path);
        }
    }

    return ret || defaultValue;
};

/**
 * 更新store并通知
 */
export const setStore = (path: string, data: any, notified = true) => {
    const path2value = (...args) => {
        let returnValue = <any>store;
        for (let i = 0; i < args[0].length; i++) {
            returnValue = returnValue[args[0][i]];
        }
        
        return returnValue;
    };
    const keyArr = path.split('/');
    // 原有的最后一个键
    const lastKey = keyArr.pop();

    let parent = store;
    for (const key of keyArr) {
        if (key in parent) {
            parent = parent[key];
        } else if (parent instanceof Map) {
            parent = parent.get(key);
        } else {
            // 路径中有和store内部不同的键，肯定是bug
            // tslint:disable-next-line:prefer-template
            throw new Error('setStore Failed, path = ' + path);
        }
    }
    if (parent instanceof Map) {
        parent.set(lastKey, data);
    } else {
        parent[lastKey] = data;
    }    
    /**
     * 写的不好，只能支持普通json和最后一层为map的情况，不支持map嵌套
     */
    if (notified) {
        handlerMap.notify(path, data);
        path = path.substring(0,path.lastIndexOf('/'));
        while (path.length > 0) {
            handlerMap.notify(path, path2value(path.split('/')));
            path = path.substring(0,path.lastIndexOf('/'));
        }        
    }
    
};

/**
 * 注册监听特定的数据
 * @param keyName the name of the key
 * @param cb callback
 */
export const register = (keyName: string, cb: Function): void => {
    handlerMap.add(keyName, <any>cb);
};

/**
 * 取消注册
 * @param keyName the name of the key
 * @param cb callback
 */
export const unregister = (keyName: string, cb: Function): void => {
    handlerMap.remove(keyName, <any>cb);
};

/**
 * store初始化
 */
export const initStore = () => {
    registerDataChange();
    store = {
        uid:0,
        readGroupTimeMap: new Map(),
        groupInfoMap: new Map(),
        groupUserLinkMap: new Map(),
        userHistoryMap:new Map(),
        groupHistoryMap: new Map(),
        announceHistoryMap: new Map(),
        msgLockMap: new Map(),
        userInfoMap: new Map(),
        userCredentialMap: new Map(), 
        accountGeneratorMap: new Map(),
        friendLinkMap: new Map(),
        contactMap: new Map(),
        addressInfoMap: new Map(),
        userChatMap:new Map(),
        groupChatMap:new Map(),
        lastRead:new Map(),
        communityInfoMap:new Map(),
        lastChat:[],
        setting:{
            msgTop:[],
            msgAvoid:[]
        },
        isLogin:true,
        offLine:false,
        flags:{},
        postReturn: {
            id:-1,
            num:'',
            tagType:-1,
            postList:[]
        },
        labelList: [['一代掌门','app/res/image/game/yidaizhangmen.png','app/res/image/game/xianzhixiadaoBg1.png'],['仙之侠道','app/res/image/game/xianzhixiadao.png','app/res/image/game/xianzhixiadaoBg.png']],// 应该从后端获取
        // tagList: ['广场','关注','公众号','热门','一代掌门','仙之侠道'],// 应该从后端获取
        tagList: ['全部','关注','一代掌门','仙之侠道'],// 应该从后端获取
        followNumList:new Map(),
        laudPostList:new Map(),
        postDraft:null,
        pubPostDraft:null,
        pubNum:0,
        noticeList:[],
        lastReadNotice:[],
        conmentList:[],
        fabulousList:[],
        messageData: [[],[],[],[]],
        accIdToUid:new Map(),
        originalImage:new Map()
    };
};

/**
 * 注册监听事件
 */
const registerDataChange = () => {
    register('uid',() => {
        initAccount(); // 登陆成功后更新当前用户的历史数据
    });

    register('userChatMap',() => {
        userChatChange();  // 新的聊天数据
    });

    register('userHistoryMap',() => {
        userChatChange();  // 新的聊天数据
    });
    
    register('userInfoMap',() => {
        friendChange();  // 好友数据更新
    });

    register('friendLinkMap',() => {
        friendChange();  // 好友数据更新
    });

    register('groupChatMap',() => {
        groupChatChange();  // 群组聊天数据更新
    });

    register('groupHistoryMap',() => {
        groupChatChange();  // 群组聊天数据更新
    });

    register('groupUserLinkMap',() => {
        groupUserLinkChange();  // 群组用户数据更新
    });

    register('groupInfoMap',() => {
        groupUserLinkChange();  // 群组信息更新
    });

    register('lastChat',() => {
        lastChatChange(); // 最近会话更新
    });
    register('lastRead',() => {
        lastReadChange(); // 已读消息游标更新
    });
    register('setting',() => {
        settingChange();  // 消息免打扰，消息置顶等设置
    });
    register('flags/noGroupRemind',(r) => { // 不再提醒加群
        flagsChange();
    });
    register('lastReadNotice',() => {
        lastReadNotice();// 已读通知游标更新
    });
    register('conmentList',() => {
        conmentListChange();// 评论消息更新
    });
    register('fabulousList',() => {
        fabulousListChange();// 点赞消息更新
    });
    
};

enum POST_TYPE  {
    OFFICAL= 0, // 官方
    PUBLIC= 1// 公众号文章
}

// 帖子内容
export interface PostItem {
    key:any;   // 帖子ID及社区编号
    username:string; // 用户名
    avatar:string; // 头像
    commentCount:number;  // 评论数量
    likeCount:number;   // 点赞数量
    createtime:string;      // 创建时间
    content:string;     // 内容
    likeActive:boolean;  // 点赞
    followed:boolean;  // 已关注
    imgs:string[];  // 图片列表
    postType:POST_TYPE; // 文章类型
    gender:number;  // 性别 0 男 1 女
    comm_type:number; // 社区类型
    label:string; // 对应的是哪一款游戏，可以为空
}

/**
 * Store的声明
 */
export interface Store {
    uid:number;
    readGroupTimeMap: Map<number, number>;// gid,time
    groupInfoMap: Map<number, GroupInfo>;// gid
    groupUserLinkMap: Map<string, GroupUserLink>;// guid
    userHistoryMap: Map<string, UserMsg>;// hidinc
    groupHistoryMap: Map<string, GroupMsg>;// hidinc
    announceHistoryMap: Map<string, AnnounceHistory>;// aidinc
    msgLockMap: Map<number, MsgLock>;// LOCK,前端暂时没用到
    userInfoMap: Map<number, UserInfo>;// uid
    userCredentialMap: Map<number, UserCredential>; // todo,前端暂时没用到
    accountGeneratorMap: Map<string, AccountGenerator>;// todo,前端暂时没用到
    friendLinkMap: Map<string, FriendLink>;// uuid
    contactMap: Map<number, Contact>;// uid
    addressInfoMap: Map<number, AddressInfo>;// uid,暂时没用到
    userChatMap:Map<string, string[]>;// hid,hidinc,递增存储
    groupChatMap:Map<string, string[]>;// hid,hidinc
    communityInfoMap:Map<string,CommunityBase>; // num 公众号信息
    lastChat:[number,number,GENERATOR_TYPE][];// gid|uid,time,前端自己生产的数组，每条信息都需要更新该表
    // 其实time没啥意义，不一定是最近发信息的50条，比如有人离线了，很早就发送了信息，他的信息也会出现在这里
    lastRead:Map<string,LastReadMsgId>;// hid
    setting:any; // 额外设置，免打扰|置顶
    isLogin:boolean; // 是否登陆成功
    offLine:boolean; // 是否离线
    flags:any; // 标记信息
    postReturn: {
        id:number;
        num:string;
        tagType:number;
        postList:PostItem[];
    };// 广场帖子    
    tagList:string[];// tag名字
    labelList:[string,string,string][]; // 标签名,小标签，大图
    followNumList:Map<number,AttentionIndex>; // 关注的社区账号
    laudPostList:Map<number,LaudPostIndex>;  // 点赞帖子记录
    postDraft:any;   // 普通帖子草稿
    pubPostDraft:any;  // 公众号文章草稿
    noticeList:any;// 消息列表
    lastReadNotice:any;// 已读消息
    pubNum:number;  // 公众号ID
    conmentList:any;// 评论消息列表
    fabulousList:any;// 点赞消息列表
    messageData:any;// 消息通知列表
    accIdToUid:Map<string,number>;// accID转uid
    originalImage:Map<number,boolean>;// 原图查看记录

}

/**
 * 上次阅读到哪一条消息
 */
export interface LastReadMsgId {
    msgType: string; // 单聊、群聊
    msgId: string; // hIncId
}
// ============================================ 本地

let store:Store;
// ============================================ 可执行
const handlerMap: HandlerMap = new HandlerMap();
initStore();

export enum GENERATORTYPE {
    NOTICE_1= 'invite',
    NOTICE_2= 'beInvited',
    NOTICE_3= 'fabulous',
    NOTICE_4= 'comment'
}