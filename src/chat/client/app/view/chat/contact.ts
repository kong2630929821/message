/**
 * 最近会话列表
 */

// ================================================ 导入
import { uploadFileUrlPrefix } from '../../../../../app/config';
import * as walletStore from '../../../../../app/store/memstore';
import { Json } from '../../../../../pi/lang/type';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { GENERATOR_TYPE, UserInfo } from '../../../../server/data/db/user.s';
import * as store from '../../data/store';
import { bottomNotice, getUserAvatar, rippleShow } from '../../logic/logic';
import { doScanQrCode } from '../../logic/native';
import { setUserInfo } from '../../net/init_1';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Contact extends Widget {
    public props: Props;
    public web3Promise: Promise<string>;
    public defaultInjectPromise: Promise<string>;

    public setProps(props: Json) {
        super.setProps(props);
        this.props.messageList = [];
        this.props.isUtilVisible = false;
        this.props.utilList = [
            { iconPath: 'adress-book.png', utilText: '通讯录' },
            { iconPath: 'add-blue.png', utilText: '添加好友' },
            { iconPath: 'group-chat.png', utilText: '创建群聊' },
            { iconPath: 'scan.png', utilText: '扫一扫' },
            { iconPath: 'add-friend.png', utilText: '我的信息' }
        ];
        this.props.isLogin = store.getStore('isLogin');

        // 判断是否从钱包项目进入
        // if (navigator.userAgent.indexOf('YINENG_ANDROID') > -1 || navigator.userAgent.indexOf('YINENG_IOS') > -1) {  
        this.props.hasWallet = !!walletStore.getStore('wallet');
        const wUser = walletStore.getStore('user/info', { nickName: '' });  // 钱包
        const uid = store.getStore('uid', 0);
        const cUser = store.getStore(`userInfoMap/${uid}`, new UserInfo());  // 聊天
        this.props.avatar = getUserAvatar(uid);
        
        // 钱包修改了姓名、头像等，或钱包退出登陆
        if (wUser.nickName !== cUser.name || wUser.avatar !== cUser.avatar) {
            if (this.props.isLogin && wUser.nickName) { // 钱包和聊天都已登陆
                setUserInfo();
                this.props.avatar = `${uploadFileUrlPrefix}${wUser.avatar}`;
                this.paint();
            } else {
                store.initStore();
                this.state = []; // 清空记录 lastChat
                this.paint();
            }
        } 
        
        // }
    }

    public firstPaint() {
        super.firstPaint();
        
        walletStore.register('user/info',() => { // 钱包用户信息修改
            this.setProps(this.props);  
        });
        store.register('isLogin',() => {
            this.setProps(this.props);
        });
    }

    /**
     * 进入聊天页面
     * @param id 好友ID或群ID
     * @param chatType 群聊或单聊
     */
    public chat(id: number, chatType: GENERATOR_TYPE) {
        this.closeMore();
        popNew('chat-client-app-view-chat-chat', { id: id, chatType: chatType });
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    // 打开更多功能
    public getMore() {
        if (this.props.isLogin) {
            this.props.isUtilVisible = !this.props.isUtilVisible;
            this.paint();
        } else {
            bottomNotice('聊天未登陆');
        }
    }

    public closeMore() {
        this.props.isUtilVisible = false;
        this.paint();
    }

    public handleFatherTap(e: any) {
        
        switch (e.index) {
            case 0:// 点击通讯录
                popNew('chat-client-app-view-contactList-contactList');
                break;
            case 1:// 点击添加好友
                popNew('chat-client-app-view-chat-addUser');
                break;
            case 2:// 创建群聊 setGroupChat
                popNew('chat-client-app-view-group-setGroupChat');
                break;
            case 3:// 扫一扫 
                doScanQrCode((res) => {  // 扫描二维码
                    popNew('chat-client-app-view-chat-addUser',{ rid:res });
                    console.log(res);
                    this.paint();
                });
                   
                // openTestWebview(10001);      
                break;
            case 4:
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
    netClose: boolean; // 网络链接是否断开
    avatar:string; // 头像
    isLogin:boolean; // 聊天是否已经登陆
    hasWallet:boolean; // 本地是否已经创建钱包
}
const STATE = {
    lastChat:[],
    contactMap:''
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