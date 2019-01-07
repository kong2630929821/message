/**
 * 最近会话列表
 */

// ================================================ 导入
import { getOpenId } from '../../../../../app/api/JSAPI';
import * as walletStore from '../../../../../app/store/memstore';
import { Json } from '../../../../../pi/lang/type';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { GENERATOR_TYPE, UserInfo } from '../../../../server/data/db/user.s';
import { SendMsg } from '../../../../server/data/rpc/message.s';
import { changeUserInfo } from '../../../../server/data/rpc/user.p';
import { getFriendHistory } from '../../data/initStore';
import * as store from '../../data/store';
import { UserType } from '../../logic/autologin';
import { bottomNotice, getUserAvatar, rippleStyle } from '../../logic/logic';
import { clientRpcFunc, login as mqttLogin, subscribe } from '../../net/init';
import { init } from '../login/login';
// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Contact extends Widget {
    public props: Props;

    public setProps(props: Json) {
        super.setProps(props);
        this.props.messageList = [];
        this.props.isUtilVisible = false;
        this.props.utilList = [
            { iconPath: 'search.png', utilText: '搜索' },
            { iconPath: 'adress-book.png', utilText: '通讯录' },
            { iconPath: 'add-blue.png', utilText: '添加好友' },
            { iconPath: 'group-chat.png', utilText: '创建群聊' },
            { iconPath: 'scan.png', utilText: '扫一扫' },
            { iconPath: 'add-friend.png', utilText: '我的信息' }
        ];
        this.props.netClose = false;

        // 判断是否从钱包项目进入
        // if (navigator.userAgent.indexOf('YINENG_ANDROID') > -1 || navigator.userAgent.indexOf('YINENG_IOS') > -1) {  
        this.props.isLogin = walletStore.getStore('user/isLogin',false);
        if (this.props.isLogin) {
            const wUser = walletStore.getStore('user/info', { nickName: '' });  // 钱包
            const uid = store.getStore('uid');
            const cUser = store.getStore(`userInfoMap/${uid}`, new UserInfo());  // 聊天
            this.props.isOnline = wUser.nickName !== '';
            if (uid) {
                this.props.avatar = getUserAvatar(uid);
            }
        
            // 如果聊天未登录，或钱包修改了姓名、头像等，或钱包退出登陆
            if (!uid || wUser.nickName !== cUser.name || wUser.avatar !== cUser.avatar) {
                store.initStore();
                this.state = []; // 清空记录 lastChat
                this.paint(true);
                if (this.props.isOnline) { // 钱包已登录才去登陆聊天
                    this.walletSignIn();
                }
            }
        }
        
        // }
    }

    public chat(e:any, id: number, chatType: GENERATOR_TYPE) {
        rippleStyle(e);
        this.closeMore();
        popNew('chat-client-app-view-chat-chat', { id: id, chatType: chatType });

    }

    /**
     * 钱包登陆
     */
    public walletSignIn() {
        getOpenId('101', (r) => {
            const openId = String(r.openid);
            if (openId) {
                mqttLogin(UserType.WALLET, openId, 'sign', (r: UserInfo) => {
                    this.props.isOnline = true;
                    console.log('聊天登陆成功！！！！！！！！！！！！！！');

                    if (r && r.uid > 0) {
                        store.setStore(`uid`, r.uid);
                        store.setStore(`userInfoMap/${r.uid}`, r);
                        init(r.uid);
                        subscribe(r.uid.toString(), SendMsg, (v: SendMsg) => {
                            if (v.code === 1) {
                                getFriendHistory(v.rid);
                            }
                            // updateUserMessage(v.msg.sid, v);
                        });
                        this.props.avatar = getUserAvatar(r.uid);
                        this.paint();

                        const user = walletStore.getStore('user/info');
                        const walletAddr = walletStore.getStore('user/id');
                        if (r.name !== user.nickName || r.avatar !== user.avatar) {
                            r.name = user.nickName;
                            r.avatar = user.avatar;
                            r.tel = user.phoneNumber;
                            r.wallet_addr = walletAddr;
                            clientRpcFunc(changeUserInfo, r, (res) => {
                                if (res && res.uid > 0) {
                                    store.setStore(`userInfoMap/${r.uid}`, r);

                                }
                            });
                        }
                    } else {
                        bottomNotice('钱包登陆失败');
                    }
                });
            }
        });

    }

    // 打开更多功能
    public getMore() {
        if (this.props.isOnline) {
            this.props.isUtilVisible = !this.props.isUtilVisible;
            this.paint();
        } else {
            bottomNotice('请先登陆钱包');
        }
    }

    public closeMore() {
        this.props.isUtilVisible = false;
        this.paint();
    }

    public handleFatherTap(e: any) {
        switch (e.index) {
            case 0:// 搜索
                break;
            case 1:// 点击通讯录
                popNew('chat-client-app-view-contactList-contactList');
                break;
            case 2:// 点击添加好友
                popNew('chat-client-app-view-chat-addUser');
                break;
            case 3:// 创建群聊 setGroupChat
                popNew('chat-client-app-view-group-setGroupChat');
                break;
            case 4:// 扫一扫            
                break;
            case 5:
                popNew('chat-client-app-view-info-user');
                break;

            default:
        }
        this.closeMore();
        this.paint();
    }

}

// ================================================ 本地
interface Props {
    sid: number;
    messageList: any[];
    isUtilVisible: boolean;
    utilList: any[];
    isOnline: boolean; // 钱包是否已经登陆
    netClose: boolean; // 网络链接是否断开
    avatar:string; // 头像
    isLogin:boolean; // 是否登陆
}
const STATE = {
    lastChat:[],
    contactMap:''
};
store.register(`lastChat`, (r: [number, number][]) => {
    STATE.lastChat = r;
    console.log('STATE############',STATE);
    forelet.paint(STATE);
});
store.register('contactMap', (r) => {
    for (const value of r.values()) {
        STATE.contactMap = value;
        forelet.paint(STATE);
    }  
});
store.register('friendLinkMap', () => {
    const w = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.paint(true);
    }
});