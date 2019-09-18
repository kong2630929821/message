/**
 * 一些全局方法
 */
// =====================================导入
import { uploadFileUrlPrefix } from '../../../../app/publicLib/config';
import { popNewMessage } from '../../../../app/utils/tools';
import { popNew } from '../../../../pi/ui/root';
import { getRealNode } from '../../../../pi/widget/painter';
import { GroupInfo, GroupUserLink } from '../../../server/data/db/group.s';
import { MSG_TYPE, UserHistory } from '../../../server/data/db/message.s';
import { Contact, FriendLink, GENERATOR_TYPE, UserInfo } from '../../../server/data/db/user.s';
import { depCopy, genGroupHid, genGuid, genUuid } from '../../../utils/util';
import { updateUserMessage } from '../data/parse';
import * as store from '../data/store';
import { sendUserMsg } from '../net/rpc';
// =====================================导出

/**
 * 时间戳格式化 毫秒为单位
 * timeType 1 返回时分， 2 返回月日， 3 返回月日时分
 */ 
export const timestampFormat = (timestamp: number,timeType?: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    if (timeType === 1) {
        return `${hour}:${minutes}`;
    }
    if (timeType === 2) {
        return `${month}月${day}日`;
    }
    if (timeType === 3) {
        return `${month}月${day}日 ${hour}:${minutes}`;
    }

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

/**
 * Map转json，仅接受一层map
 */
export const map2Json = (data:Map<any,any>)  => {
    const res = {};
    data.forEach((v,k) => {
        res[k] = v;
    });

    return res;
};

/**
 * json转Map，仅可转一层map
 */
export const json2Map = (data:JSON) => {
    const res = new Map();
    for (const i in data) {
        res.set(i,data[i]);
    }

    return res;
};

/**
 * 获取好友的别名
 */
export const getFriendAlias = (rid:number) => {
    const sid = store.getStore('uid');
    const user = store.getStore(`userInfoMap/${rid}`,new UserInfo());
    const friend = store.getStore(`friendLinkMap/${genUuid(sid,rid)}`,new FriendLink());
    const contact = store.getStore(`contactMap/${sid}`,new Contact());
    const isFriend = contact.friends && contact.friends.findIndex(item => item === rid) > -1;

    return {
        name: friend.alias || user.name,
        isFriend: isFriend
    };
};

/**
 * 用户退出群组后取消订阅清空本地数据
 */
export const exitGroup = (gid:number) => {
    const groupChatMap = store.getStore('groupChatMap',new Map());
    groupChatMap.delete(genGroupHid(gid)); // 删除聊天记录
    store.setStore('groupChatMap',groupChatMap);

    const lastChat = store.getStore(`lastChat`, []);
    const index = lastChat.findIndex(item => item[0] === gid && item[2] === GENERATOR_TYPE.GROUP);
    if (index > -1) { // 删除最近对话记录
        lastChat.splice(index,1);
        store.setStore('lastChat',lastChat);
    }

    const lastRead = store.getStore(`lastRead`, []);
    lastRead.delete(genGroupHid(gid));  // 删除已读消息记录
    store.setStore(`lastRead`, lastRead);

    const gInfoMap = store.getStore(`groupInfoMap`,new Map());    
    gInfoMap.delete(gid.toString());  // 删除群组信息
    store.setStore(`groupInfoMap`, gInfoMap);
};

// 复制到剪切板
export const copyToClipboard = (copyText) => {
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', copyText);
    input.setAttribute('style', 'position:absolute;top:-9999px;');
    document.body.appendChild(input);
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        input.setSelectionRange(0, 9999);
    } else {
        input.select();
    }
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
};

// 获取好友用户头像
export const getUserAvatar = (rid:number) => {
    if (rid) {
        const user = store.getStore(`userInfoMap/${rid}`,new UserInfo());
        let avatar = user.avatar ? depCopy(user.avatar) : '';
        if (avatar && avatar.indexOf('data:image') < 0) {
            avatar = `${uploadFileUrlPrefix}${avatar}`;
        }

        return avatar;
    } else {
        
        return '';
    }
    
};

// 获取群组头像
export const getGroupAvatar = (gid:number) => {
    if (gid) {
        const group = store.getStore(`groupInfoMap/${gid}`,new GroupInfo());
        let avatar = group.avatar ? depCopy(group.avatar) : '';
        if (avatar && avatar.indexOf('data:image') < 0) {
            avatar = `${uploadFileUrlPrefix}${avatar}`;
        }

        return avatar;
    } else {
        
        return '';
    }
    
};

// 获取群内用户头像
export const getGroupUserAvatar = (gid:number,rid:number) => {
    if (rid) {
        const user = store.getStore(`groupUserLinkMap/${genGuid(gid,rid)}`,new GroupUserLink());
        let avatar = user.avatar ? depCopy(user.avatar) : '';
        if (avatar && avatar.indexOf('data:image') < 0) {
            avatar = `${uploadFileUrlPrefix}${avatar}`;
        }

        return avatar;
    } else {
        
        return '';
    }
    
};

// 水波纹动画效果展示
export const rippleShow = (e:any) => {
    getRealNode(e.node).classList.add('ripple');

    setTimeout(() => {
        getRealNode(e.node).classList.remove('ripple');
    }, 500);
};

// 获取当前用户的所有好友ID
export const getAllFriendIDs = () => {
    const uid = store.getStore('uid');
    const friends = store.getStore(`contactMap/${uid}`,{ friends:[] }).friends;
    const accIds = [];
    for (const v of friends) {
        const acc_id = store.getStore(`userInfoMap/${v}`,new UserInfo()).acc_id;
        acc_id && accIds.push(acc_id);
    }
    console.log('==========getAllFriendIDs',accIds);

    return accIds;
};

// 从某个页面进入标记
export const enum INFLAG  {
    contactList = 0, // 联系人列表
    chat_user,  // 单聊
    chat_group,  // 群聊
    newApply  // 新好友申请 或 新群组邀请
}

// 举报用户
export const complaintUser = (name:string,sex:number,avatar:string,msg:string,status:number,reportKey:string) => {
    const content = ['色情暴力','骚扰谩骂','广告欺诈','病毒木马','反动政治','其它'];
    popNew('chat-client-app-widget-complaint-complaint'
        ,{ title:name,content,sex,avatar,msg,status,reportKey }
        ,(selected) => {
    
            let mess = `举报用户@${name}`;
            for (const i of selected) {
                mess += `“${content[i]}”`; 
            }
            const SUID = store.getStore('flags').HAOHAI_UID;
            sendUserMsg(SUID,mess,MSG_TYPE.COMPLAINT).then((r:UserHistory) => {
                updateUserMessage(SUID, r);
                popNewMessage('举报成功');
            });
            
        });
};

// 判断是否关注
export const judgeFollowed = (num:string) => {
    const uid = store.getStore('uid');
    const numsList = store.getStore(`followNumList/${uid}`,{ person_list:[],public_list:[]  });
    const followList = numsList.person_list.concat(numsList.public_list);
    
    return followList.indexOf(num) > -1;
};

// 判断是否点赞
export const judgeLiked = (num:string, id:number) => {
    const uid = store.getStore('uid');
    const likeList = store.getStore(`laudPostList/${uid}`,{ list:[] }).list;

    return likeList.findIndex(r => r.num === num && r.id === id) > -1;
};

// 拼接图片路径
export const buildupImgPath = (url:string) => {
    if (url && !/data:image|http/.test(url)) {
        
        return `${uploadFileUrlPrefix}${url}`;
    }

    return url;
};

// 处理消息通知
export const deelNotice = (arr:any,fg:string) => {
    const messageData = store.getStore('messageData',[[],[],[],[]]);
    if (fg === store.GENERATORTYPE.NOTICE_1) {
        messageData[0] = arr;
    } else if (fg === store.GENERATORTYPE.NOTICE_2) {
        messageData[1] = arr;
    } else if (fg === store.GENERATORTYPE.NOTICE_3) {
        messageData[2] = arr;
    } else {
        messageData[3] = arr;
    }

    const dataList = [];
    store.getStore('messageData',messageData);
    messageData.forEach(v => {
        if (v[0] && v[0].length) {
            dataList.push(...v);
        }
    });
    dataList.sort((v,t) => {
        return v[1] - t[1];
    });
    store.setStore('noticeList',dataList);

    return dataList;
};

// 获取已读消息下标
export const getMessageIndex = (arr:any) => {
    const data = store.getStore('noticeList',[]);
    let index = -1;
    data.forEach((v,i) => {
        if (arr[2] === store.GENERATORTYPE.NOTICE_3 && arr[0] === v[0] && arr[2] === v[2] && arr[3] === v[3] && arr[4] === v[4]) {
            // 当前已读的是点赞消息
            if (arr[1] === v[1]) {
                index = i;
            } else {
                index = i - 1;
            }
           
        } else {
            if (arr[0] === v[0] && arr[1] === v[1] && arr[2] === v[2]) {
                index = i;
            }
        }
        
    });

    return index;
};

// 处理监听通知信息列表
export const setNoticeList = (itype:string,storeStr:string,arr:any) => {
    const list = store.getStore(storeStr,[]);
    if (itype === store.GENERATORTYPE.NOTICE_3) {
        let flags = -1;
        list.forEach((v,i) => {
            // 相同的则替换
            if (v[0] === arr[0] && v[2] === arr[2] && v[3] === arr[3] && v[4] === arr[4]) {
                flags = i;
            }
        });
        if (list.length) {
            list.splice(flags !== -1 ? list.length - 1 :flags,flags !== -1 ? 1 :0,arr);
        } else {
            list.push(arr);
        }
    } else {
        list.push(arr);
    }
    
    store.setStore(storeStr,list);
};

// 删除评论点赞通知
export const delNotice = (itype:string,data:any) => {
    const noticeList = store.getStore('noticeList',[]); // 通知列表
    let indexDbNotice =   store.getStore('lastReadNotice',[]);// 当前游标停留的通知
    const list = store.getStore(itype,[]); // 评论或点赞的消息列表
    let index = -1;
    noticeList.forEach((v,i) => {
        if (JSON.stringify(v) === JSON.stringify(indexDbNotice)) {
            index = i;
        }
    });
    list.forEach((v,i) => {
        if (JSON.stringify(v) === JSON.stringify(data)) {
            if (JSON.stringify(data) === JSON.stringify(indexDbNotice)) {
                indexDbNotice = noticeList[index - 1];
            }
            list.splice(i,1);
            noticeList.splice(i,1);
        }
    });
    store.setStore(itype,list);
    store.setStore('noticeList',noticeList);
    store.setStore('lastReadNotice',indexDbNotice);
};

export const NOTICESET = 'noticeSet';// 消息通知设置标志

// 获取好友群聊信息
export const getFriendsInfo = () => {
    const uid = store.getStore('uid');
    const userInfos = store.getStore('userInfoMap',[]);
    const friendIdList = store.getStore('contactMap',[]);
    const groupList = store.getStore('groupInfoMap',[]);
    const fId = friendIdList.size ? friendIdList.get(`${uid}`).friends :[];
    const gId = friendIdList.size ? friendIdList.get(`${uid}`).group :[];
    const friends = new Map();
    const groups = new Map();
    for (const [key,value] of userInfos) {
        if (fId.indexOf(value.uid) !== -1) {
            friends.set(key,value);
        }
    }
    for (const [key,value] of groupList) {
        if (gId.indexOf(value.uid) !== -1) {
            groups.set(key,value);
        }
    }

    return { friends,groups };
};
