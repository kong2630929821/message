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
import { UserHistory } from '../../../../server/data/db/message.s';
import { GENERATOR_TYPE, UserInfo } from '../../../../server/data/db/user.s';
import { changeUserInfo } from '../../../../server/data/rpc/user.p';
import { updateUserMessage } from '../../data/parse';
import * as store from '../../data/store';
import { clientRpcFunc, subscribe } from '../../net/init';
import { walletLogin } from '../../net/rpc';
import { init } from '../login/login';
// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Contact extends Widget {
    public props:Props;

    public setProps(props:Json) {
        super.setProps(props);
        this.props.messageList = [];
        this.props.isUtilVisible = false;
        this.props.utilList = [
            { iconPath:'search.png',utilText:'搜索' },
            { iconPath:'adress-book.png',utilText:'通讯录' },
            { iconPath:'add-blue.png',utilText:'添加好友' },
            { iconPath:'group-chat.png',utilText:'创建群聊' },
            { iconPath:'scan.png',utilText:'扫一扫' },
            { iconPath:'add-friend.png',utilText:'我的信息' }
        ];

        // 判断是否从钱包项目进入
        // if (navigator.userAgent.indexOf('YINENG_ANDROID') > -1 || navigator.userAgent.indexOf('YINENG_IOS') > -1) {  
        const wUser = walletStore.getStore('user/info',{ nickName:'' });  // 钱包
        const uid = store.getStore('uid');
        const cUser = store.getStore(`userInfoMap/${uid}`,new UserInfo());  // 聊天
        this.props.isOnline = wUser.nickName !== ''; 

        // 如果聊天未登录，或钱包修改了姓名、头像等，或钱包退出登陆
        if (!uid || wUser.nickName !== cUser.name || wUser.avatar !== cUser.avatar) {
            store.initStore();
            this.state = []; // 清空记录 lastChat
            this.paint(true);
            if (this.props.isOnline) { // 钱包已登录才去登陆聊天
                this.walletSignIn();
            }
        }
        // }
    }

    public chat(id:number, chatType:GENERATOR_TYPE) {
        this.closeMore();
        if (chatType === GENERATOR_TYPE.USER) {
            popNew('chat-client-app-demo_view-chat-chat', { rid:id });
        } else if (chatType === GENERATOR_TYPE.GROUP) {
            popNew('chat-client-app-demo_view-group-groupChat', { gid:id });
        }
        
    }

    /**
     * 钱包登陆
     */
    public walletSignIn() {
        getOpenId('101',(r) => {
            const openId = String(r.openid);
            if (openId) {
                walletLogin(openId,'',(r:UserInfo) => {
                    this.props.isOnline = true;

                    if (r && r.uid > 0) {
                        store.setStore(`uid`,r.uid);
                        store.setStore(`userInfoMap/${r.uid}`,r);        
                        init(r.uid); 
                        subscribe(r.uid.toString(), UserHistory, (v: UserHistory) => {
                            updateUserMessage(v.msg.sid,v);
                        });
                        this.paint();

                        const user = walletStore.getStore('user/info');
                        if (r.name !== user.nickName || r.avatar !== user.avatar) {
                            r.name = user.nickName;
                            r.avatar = user.avatar;
                            r.tel = user.phoneNumber;
                            clientRpcFunc(changeUserInfo,r,(res) => {
                                if (res && res.uid > 0) {
                                    store.setStore(`userInfoMap/${r.uid}`,r);  

                                }
                            });
                        }
                    } else {
                        alert('钱包登陆失败');
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
            alert('请先登陆钱包');
        }
    }

    public closeMore() {
        this.props.isUtilVisible = false;
        this.paint();
    }

    public handleFatherTap(e:any) {
        switch (e.index) {
            case 0:// 搜索
                break;
            case 1:// 点击通讯录
                popNew('chat-client-app-demo_view-contactList-contactList',{ sid : this.props.sid });
                break;
            case 2:// 点击添加好友
                popNew('chat-client-app-demo_view-chat-addUser', { sid: this.props.sid });
                break;
            case 3:// 创建群聊 setGroupChat
                popNew('chat-client-app-demo_view-group-setGroupChat');
                break;
            case 4:// 扫一扫            
                break;
            case 5:
                popNew('chat-client-app-demo_view-info-user');
                break;

            default:
        }
        this.closeMore();
        this.paint();
    }
}

store.register(`lastChat`,(r:[number,number][]) => {    
    console.log('最近聊天数据',r);
    forelet.paint(r);
});

// ================================================ 本地
interface Props {
    sid: number;
    messageList:any[];
    isUtilVisible:boolean;
    utilList:any[];
    isOnline:boolean;
}
store.register('friendLinkMap',() => {
    const w = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.paint(true);
    }
});