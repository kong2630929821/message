/**
 * 登录
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupUserLink } from '../../../../server/data/db/group.s';
import { GroupHistory, UserHistory } from '../../../../server/data/db/message.s';
import { Contact, FriendLink, UserInfo } from '../../../../server/data/db/user.s';
import { getFriendLinks, getGroupsInfo } from '../../../../server/data/rpc/basic.p';
import { FriendLinkArray, GetFriendLinksReq, GetGroupInfoReq, GroupArray, GroupUserLinkArray } from '../../../../server/data/rpc/basic.s';
import { getGroupUserLink } from '../../../../server/data/rpc/group.p';
import { Logger } from '../../../../utils/logger';
import { genUuid, getGidFromGuid } from '../../../../utils/util';
import { getFriendHistory, getMyGroupHistory } from '../../data/initStore';
import { updateGroupMessage, updateUserMessage } from '../../data/parse';
import * as store from '../../data/store';
import { exitGroup } from '../../logic/logic';
import { clientRpcFunc, subscribe as subscribeMsg } from '../../net/init';
import { login as userLogin } from '../../net/rpc';
import * as subscribedb from '../../net/subscribedb';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);
// ================================================ 导出
export class Login extends Widget {
    constructor() {
        super();
        this.props = {
            uid: null,
            passwd: '',
            visible: false,// 密码可见性
            isClear: false// 密码是否可清除
        };
    }

    public inputName(e:any) {
        this.props.uid = parseInt(e.value,10);
    }

    public inputPasswd(e:any) {
        this.props.passwd = e.value;
        if (e.value) {
            this.props.isClear = true;
        } else {
            this.props.isClear = false;
        }
        this.paint();
    }

    public openRegister() {
        popNew('chat-client-app-demo_view-register-register');
    }

    public login(e:any) {
        // 让所有输入框的失去焦点
        const inputs = getRealNode(this.tree).getElementsByTagName('input');
        for (let i = 0;i < inputs.length;i++) {
            inputs[i].blur();
        }
        
        userLogin(this.props.uid, this.props.passwd, (r: UserInfo) => {
            if (r.uid > 0) {
                store.setStore(`uid`,r.uid);
                store.setStore(`userInfoMap/${r.uid}`,r);        
                init(r.uid); 
                popNew('chat-client-app-demo_view-chat-contact', { sid: this.props.uid });
                subscribeMsg(this.props.uid.toString(), UserHistory, (v: UserHistory) => {
                    updateUserMessage(v.msg.sid,v);
                });
            }
        });
        
    }

    /**
     * 切换密码是否可见
     */
    public changeEye() {
        this.props.visible = !this.props.visible;
        this.paint();
    }

}

// ================================================ 本地
/**
 * 登录成功获取各种数据表的变化
 * @param uid user id
 */
export const init = (uid:number) => {
    subscribedb.subscribeContact(uid,(r:Contact) => {
        if (r && r.uid === uid) {
            updateUsers(r,uid);        
        }
    },(r:Contact) => {
        if (r && r.uid === uid) {
            updateGroup(r,uid);
        }
    });

    // TODO:
};

/**
 * 更新群组相关信息
 * @param r 联系人列表
 * @param uid 当前用户id
 */
const updateGroup = (r:Contact,uid:number) => {
    // 判断群组是否发生了变化,需要重新订阅群组消息
        
    const oldGroup = (store.getStore(`contactMap/${uid}`) || { group:[] }).group;
    const addGroup = r.group.filter((gid) => {
        return oldGroup.findIndex(item => item === gid) === -1;
    });
    const delGroup = oldGroup.filter((gid) => {
        return r.group.findIndex(item => item === gid) === -1;
    });
    
    // 主动或被动退出的群组
    delGroup.forEach((gid:number) => {
        exitGroup(gid);
    });

    // 订阅我已经加入的群组基础信息
    addGroup.forEach((gid) => {
        getMyGroupHistory(gid); // 获取群组离线消息
        subscribeMsg(`ims/group/msg/${gid}`, GroupHistory, (r: GroupHistory) => {
            updateGroupMessage(gid,r);
        });
        subscribedb.subscribeGroupInfo(gid,() => {
            clientRpcFunc(getGroupUserLink,gid,(r:GroupUserLinkArray) => {
                logger.debug('===============',r);
                // 判断是否返回成功
                if (r && r.arr.length > 0) {
                    r.arr.forEach((item:GroupUserLink) => {
                        store.setStore(`groupUserLinkMap/${item.guid}`,item);
                    });
                }
            });
        });
    });
    // 获取邀请我进群的群组信息
    const groups = new GetGroupInfoReq();
    groups.gids = [];
    r.applyGroup.forEach(guid => {
        const gid = getGidFromGuid(guid);
        groups.gids.push(gid);
    });
    console.log('邀请我入群',groups);
    if (groups.gids.length > 0) {
        clientRpcFunc(getGroupsInfo, groups, (r:GroupArray) => {
            console.log(r);
            if (r && r.arr.length > 0) {
                r.arr.forEach(item => {
                    store.setStore(`groupInfoMap/${item.gid}`,item);
                });
            }
        });
    }
    
};

/**
 * 更新好友信息
 * @param r 联系人列表
 * @param uid 当前用户id
 */
const updateUsers = (r:Contact,uid:number) => {
    const info = new GetFriendLinksReq();
    info.uuid = [];
    r.friends.forEach((rid:number) => {
        info.uuid.push(genUuid(uid,rid));
        getFriendHistory(rid);  // 获取好友发送的离线消息
    });
    if (info.uuid.length > 0) {
        // 获取friendlink
        clientRpcFunc(getFriendLinks,info,(r:FriendLinkArray) => {            
            if (r && r.arr && r.arr.length > 0) {
                r.arr.forEach((e:FriendLink) => {
                    store.setStore(`friendLinkMap/${e.uuid}`,e);
                });
            }
                       
        });
        
    }
    const uids = r.friends.concat(r.temp_chat,r.blackList,r.applyUser);
    if (uids.length > 0) {
        uids.forEach(elem => {
            subscribedb.subscribeUserInfo(elem,(r:UserInfo) => {
                // TODO
            });
        });

    }
};