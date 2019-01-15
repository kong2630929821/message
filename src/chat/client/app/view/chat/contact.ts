/**
 * 最近会话列表
 */

// ================================================ 导入
import * as walletStore from '../../../../../app/store/memstore';
import { Json } from '../../../../../pi/lang/type';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { GENERATOR_TYPE, UserInfo } from '../../../../server/data/db/user.s';
import * as store from '../../data/store';
import { bottomNotice, getUserAvatar, rippleShow } from '../../logic/logic';
import { walletSignIn } from '../../net/init_1';
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
        this.props.isLogin = walletStore.getStore('user/isLogin', false);
        const wUser = walletStore.getStore('user/info', { nickName: '' });  // 钱包
        const uid = store.getStore('uid', 0);
        const cUser = store.getStore(`userInfoMap/${uid}`, new UserInfo());  // 聊天
        this.props.isOnline = wUser.nickName !== '';
        this.props.avatar = getUserAvatar(uid);

        // 聊天未登录，钱包修改了姓名、头像等，或钱包退出登陆
        if (!uid || wUser.nickName !== cUser.name || wUser.avatar !== cUser.avatar) {
            store.initStore();
            this.state = []; // 清空记录 lastChat
            this.paint(true);
            if (this.props.isOnline) { // 钱包已登陆
                walletSignIn();
            }
        }

        // }
    }

    public firstPaint() {
        super.firstPaint();

        walletStore.register('user/info', () => { // 钱包用户信息修改
            this.setProps(this.props);
        });
        walletStore.register('user/isLogin', (r) => {
            this.setProps(this.props);
        });
    }

    public chat(e: any, id: number, chatType: GENERATOR_TYPE) {
        rippleShow(e);
        this.closeMore();
        popNew('chat-client-app-view-chat-chat', { id: id, chatType: chatType });

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
    avatar: string; // 头像
    isLogin: boolean; // 是否登陆
}
const STATE = {
    lastChat: [],
    contactMap: ''
};
store.register(`lastChat`, (r: [number, number][]) => {
    STATE.lastChat = r;
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
