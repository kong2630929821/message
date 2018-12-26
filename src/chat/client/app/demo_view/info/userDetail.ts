/**
 * 联系人详细信息
 */

// ================================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { GENERATOR_TYPE, UserInfo } from '../../../../server/data/db/user.s';
import { getUsersInfo } from '../../../../server/data/rpc/basic.p';
import { GetUserInfoReq, Result, UserArray } from '../../../../server/data/rpc/basic.s';
import { changeFriendAlias } from '../../../../server/data/rpc/user.p';
import { FriendAlias } from '../../../../server/data/rpc/user.s';
import { Logger } from '../../../../utils/logger';
import { genUserHid, genUuid } from '../../../../utils/util';
import * as store from '../../data/store';
import { getFriendAlias } from '../../logic/logic';
import { clientRpcFunc, unSubscribe } from '../../net/init';
import { applyFriend, delFriend as delUserFriend } from '../../net/rpc';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class UserDetail extends Widget {
    public ok:() => void;
    public props:Props = {
        uid:null,
        inFlag:0,
        editable:false,
        isContactorOpVisible:false,
        utilList:[],
        userInfo:{},
        alias:'',
        isFriend:true
    };

    public setProps(props:Json) {
        super.setProps(props);
        this.props.userInfo = {};
        this.props.utilList = [
            { utilText:'发送名片' },
            { utilText:'删除聊天记录' },
            { utilText:'加入黑名单' },
            { utilText:'删除' }
        ];
        
        this.props.isContactorOpVisible = false;
        this.props.editable = false;
        this.props.isFriend = true;
        this.props.userInfo = store.getStore(`userInfoMap/${this.props.uid}`,new UserInfo());
        this.props.alias = getFriendAlias(this.props.uid);
        if (!this.props.alias) {
            this.getUserData(this.props.uid);
        }
        logger.debug(props);
    }

    // 非好友展示信息
    public getUserData(uid:number) {
        const info = new GetUserInfoReq();
        info.uids = [uid];
        this.props.isFriend = false;
        clientRpcFunc(getUsersInfo,info,(r:UserArray) => {
            if (r && r.arr.length > 0) {
                this.props.userInfo = r.arr[0];
                this.paint();
            } else {
                console.error('获取用户信息失败',r);
            }
        });
    }
    
    // 点击...展开联系人操作列表
    public handleMoreContactor() {
        this.props.isContactorOpVisible = !this.props.isContactorOpVisible;
        this.paint();
    }

    // 开始对话
    public startChat() {
        setTimeout(() => {
            if (this.props.inFlag === 1) { // 如果是从chat页面单聊进入则返回chat页面
                this.ok();
            } else {
                popNew('chat-client-app-demo_view-chat-chat',{ id:this.props.uid, chatType:GENERATOR_TYPE.USER });
            }
        }, 500);
    }  

    // 添加好友
    public addUser() {
        setTimeout(() => {
            applyFriend(this.props.uid,(r:Result) => {
                if (r.r === 0) {
                    alert(`${this.props.uid}已经是你的好友`);
                }
            });
        }, 500);
    }

    // 点击联系人操作列表项
    public handleFatherTap(e:any) {
        this.props.isContactorOpVisible = false;
        if (e.index === 1) { // 清空聊天记录
            popNew('chat-client-app-widget-modalBox-modalBox',{ title:'清空聊天记录',content:'确定清空和' + `${this.props.userInfo.name}` + '的聊天记录吗' });
        }
        if (e.index === 2) { // 加入黑名单
            popNew('chat-client-app-widget-modalBox-modalBox',{ title:'加入黑名单',content:'加入黑名单，您不再收到对方的消息。' });
        }
        if (e.index === 3) { // 删除联系人
            popNew('chat-client-app-widget-modalBox-modalBox',{ title:'删除联系人',content:'将联系人' + `${this.props.userInfo.name}` + '删除，同时删除聊天记录',sureText:'删除',cancelText:'取消' },() => {
                this.delFriend(this.props.uid);
                this.goBack();
            });
        }
        this.paint();
    }

    public goBack() {
        this.ok();
    }

    /**
     * 删除好友
     * @param uid 用户ID
     */
    public delFriend(uid:number) {
        delUserFriend(uid,(r:Result) => {
            if (r && r.r === 1) { // 删除成功取消订阅好友消息并清空本地数据
                unSubscribe(uid.toString());

                const sid = store.getStore('uid');
                const userChatMap = store.getStore('userChatMap',[]);
                userChatMap.delete(genUserHid(sid,uid));  // 删除聊天记录
                store.setStore('userChatMap',userChatMap);

                const lastChat = store.getStore(`lastChat`, []);
                const index = lastChat.findIndex(item => item[0] === uid && item[2] === GENERATOR_TYPE.USER);
                if (index > -1) { // 删除最近对话记录
                    lastChat.splice(index,1);
                    store.setStore('lastChat',lastChat);
                }
            } else {
                alert('删除好友失败');
            }
        });
    }

    /**
     * 编辑好友别名
     */
    public editAlias() {
        this.props.editable = true;
        this.paint();
    }

    /**
     * 页面点击
     */
    public pageClick() {
        this.props.alias = this.props.alias;
        this.props.editable = false;
        this.props.isContactorOpVisible = false;
        this.paint();
    }

    /**
     * 好友别名更改
     */
    public aliasChange(e:any) {
        this.props.alias = e.value;
        this.paint();
    }

    /**
     * 修改好友备注
     */
    public changeFriendAlias() {
        const friend = new FriendAlias();
        friend.rid = this.props.uid;
        friend.alias = this.props.alias;
        clientRpcFunc(changeFriendAlias, friend, (r: Result) => {
            // todo
            if (r.r === 1) {
                const sid = store.getStore('uid');
                const friendlink = store.getStore(`friendLinkMap/${genUuid(sid,this.props.uid)}`,{}); 
                friendlink.alias = this.props.alias;
                store.setStore(`friendLinkMap/${genUuid(sid,this.props.uid)}`,friendlink);
                console.log('修改好友备注成功',this.props.alias);
            }
        });
    }
}

// ================================================ 本地

interface Props {
    uid: number;
    inFlag:number; // 从某个页面进入，0 contactList进入, 1 chat 单聊进入，2 chat 群聊进入
    editable:boolean; // 是否可编辑别名
    isContactorOpVisible:boolean;
    utilList:any;
    userInfo:any;
    alias:string; // 好友别名
    isFriend:boolean; // 是否是好友
}
