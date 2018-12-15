/**
 * 登录
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { GroupHistory, UserHistory } from '../../../../server/data/db/message.s';
import { Contact, FriendLink, UserInfo } from '../../../../server/data/db/user.s';
import { getFriendLinks, getGroupsInfo, getUsersInfo } from '../../../../server/data/rpc/basic.p';
import { FriendLinkArray, GetFriendLinksReq, GetGroupInfoReq, GetUserInfoReq, GroupArray, UserArray } from '../../../../server/data/rpc/basic.s';
import { Logger } from '../../../../utils/logger';
import { genUuid } from '../../../../utils/util';
import { getFriendHistory } from '../../data/initStore';
import { updateGroupMessage, updateUserMessage } from '../../data/parse';
import * as store from '../../data/store';
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
const init = (uid:number) => {
    subscribedb.subscribeContact(uid,(r:Contact) => {
        updateUsers(r,uid);        
    },(r:Contact) => {
        updateGroup(r,uid);
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
    
    // 获取群组信息
    const groupReq = new GetGroupInfoReq();
    groupReq.gids = addGroup;
    clientRpcFunc(getGroupsInfo, groupReq, (r:GroupArray) => {
        r.arr.forEach((gInfo:GroupInfo) => {
            store.setStore(`groupInfoMap/${gInfo.gid}`, gInfo);
        });
    });
    // 删除群组信息
    const gInfoMap = store.getStore(`groupInfoMap`);    
    delGroup.forEach((gid:number) => {
        gInfoMap.delete(gid);
    });
    store.setStore(`groupInfoMap`, gInfoMap);
    // 订阅群组消息
    addGroup.forEach((gid) => {
        subscribeMsg(`ims/group/msg/${gid}`, GroupHistory, (r: GroupHistory) => {
            updateGroupMessage(gid,r);
        });
    });
    
    // 取消订阅
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
    const usersInfo = new GetUserInfoReq();
    usersInfo.uids = r.friends.concat(r.temp_chat,r.blackList,r.applyUser);
    if (usersInfo.uids.length > 0) {
        usersInfo.uids.forEach(elem => {
            subscribedb.subscribeUserInfo(elem,(r:UserInfo) => {
                getFriendHistory(r);  // 获取该好友发送的离线消息
            });
        });

    }
};