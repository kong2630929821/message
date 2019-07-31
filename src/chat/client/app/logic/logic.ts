/**
 * 一些全局方法
 */
// =====================================导入
import { uploadFileUrlPrefix } from '../../../../app/publicLib/config';
import { getRealNode } from '../../../../pi/widget/painter';
import { GroupInfo, GroupUserLink } from '../../../server/data/db/group.s';
import { Contact, FriendLink, GENERATOR_TYPE, UserInfo } from '../../../server/data/db/user.s';
import { depCopy, genGroupHid, genGuid, genUuid } from '../../../utils/util';
import * as store from '../data/store';

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

// 获取用户头像
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
