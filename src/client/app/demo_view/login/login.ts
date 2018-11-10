/**
 * 登录
 */

// ================================================ 导入
import { Widget } from "../../../../pi/widget/widget";
import { Forelet } from "../../../../pi/widget/forelet";
import { popNew } from "../../../../pi/ui/root";
import { login as userLogin } from '../../net/rpc';
import * as subscribedb from "../../net/subscribedb";
import * as store from "../../data/store";
import { Logger } from '../../../../utils/logger';
import { subscribe as subscribeMsg, clientRpcFunc } from "../../net/init";
import { UserHistory, UserMsg } from "../../../../server/data/db/message.s";
import {Contact, FriendLink, UserInfo} from "../../../../server/data/db/user.s";
import {updateUserMessage} from "../../data/parse";
import { getFriendLinks, getUsersInfo} from "../../../../server/data/rpc/basic.p";
import { GetFriendLinksReq, FriendLinkArray, GetUserInfoReq, UserArray } from "../../../../server/data/rpc/basic.s"

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);
// ================================================ 导出
export class Login extends Widget {
    props = {
        uid: null,
        passwd: ""
    } as Props

    inputName(e) {
        this.props.uid = parseInt(e.text);
    }

    inputPasswd(e) {
        this.props.passwd = e.text;
    }

    openRegister() {
        popNew("client-app-demo_view-register-register")
    }

    login(e) {
        userLogin(this.props.uid, this.props.passwd, (r: UserInfo) => {
            if (r.uid > 0) {
                store.setStore(`userInfoMap/${r.uid}`,r);                
                popNew("client-app-demo_view-chat-contact", { "sid": this.props.uid })
                init(r.uid); 
                subscribeMsg(this.props.uid.toString(), UserMsg, (r: UserHistory) => {
                    updateUserMessage(r.msg.sid,r);
                })
            }
        })
    }
}

/**
 * 登录成功获取各种数据表的变化
 * @param uid 
 */
const init = (uid:number)=>{
    subscribedb.subscribeContact(uid,(r:Contact)=>{
        let info = new GetFriendLinksReq;
        info.uuid = [];
        r.friends.forEach((rid:number)=>{
            info.uuid.push(`${uid}:${rid}`);
        })
        if(info.uuid.length > 0){
            clientRpcFunc(getFriendLinks,info,(r:FriendLinkArray)=>{            
                r.arr.forEach((e:FriendLink) => {
                    store.setStore(`friendLinkMap/${e.uuid}`,e);
                });            
            })
            clientRpcFunc(getUsersInfo,info,(r:UserArray)=>{            
                r.arr.forEach((e:UserInfo) => {
                    store.setStore(`userInfoMap/${e.uid}`,e);
                });            
            })
        }
        
        // userInfoMap
    });

    //TODO:
}
// ================================================ 本地
interface Props {
    uid: number,
    passwd: string
}