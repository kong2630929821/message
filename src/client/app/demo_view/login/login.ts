/**
 * 登录
 */

// ================================================ 导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { UserHistory, UserMsg } from '../../../../server/data/db/message.s';
import { Contact, FriendLink, UserInfo } from '../../../../server/data/db/user.s';
import { getFriendLinks, getUsersInfo } from '../../../../server/data/rpc/basic.p';
import { FriendLinkArray, GetFriendLinksReq, GetUserInfoReq, UserArray } from '../../../../server/data/rpc/basic.s';
import { Logger } from '../../../../utils/logger';
import { genUuid } from '../../../../utils/util';
import { updateUserMessage } from '../../data/parse';
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
        popNew('client-app-demo_view-register-register');
    }

    public login(e:any) {
        userLogin(this.props.uid, this.props.passwd, (r: UserInfo) => {
            if (r.uid > 0) {
                store.setStore(`uid`,r.uid);
                store.setStore(`userInfoMap/${r.uid}`,r);                
                popNew('client-app-demo_view-chat-contact', { sid: this.props.uid });
                init(r.uid); 
                subscribeMsg(this.props.uid.toString(), UserHistory, (r: UserHistory) => {
                    updateUserMessage(r.msg.sid,r);
                });
            }
        });
    }
}

/**
 * 登录成功获取各种数据表的变化
 * @param uid user id
 */
const init = (uid:number) => {
    subscribedb.subscribeContact(uid,(r:Contact) => {
        const info = new GetFriendLinksReq();
        info.uuid = [];
        r.friends.forEach((rid:number) => {
            info.uuid.push(genUuid(uid,rid));
        });
        if (info.uuid.length > 0) {
            clientRpcFunc(getFriendLinks,info,(r:FriendLinkArray) => {            
                r.arr.forEach((e:FriendLink) => {
                    store.setStore(`friendLinkMap/${e.uuid}`,e);
                });            
            });
            const usersInfo = new GetUserInfoReq();
            usersInfo.uids = r.friends.concat(r.temp_chat,r.blackList,r.applyUser);
            clientRpcFunc(getUsersInfo,usersInfo,(r:UserArray) => {            
                r.arr.forEach((e:UserInfo) => {
                    store.setStore(`userInfoMap/${e.uid}`,e);
                });
            });
        }
        
        // userInfoMap
    });

    // TODO:
};
// ================================================ 本地
