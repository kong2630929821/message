/**
 * 最近会话列表
 */

// ================================================ 导入
import { OfflienType } from '../../../../../app/components1/offlineTip/offlineTip';
import { getStoreData, registerStore } from '../../../../../app/middleLayer/wrap';
import { uploadFileUrlPrefix } from '../../../../../app/publicLib/config';
import { popNew3, popNewMessage } from '../../../../../app/utils/tools';
import { Json } from '../../../../../pi/lang/type';
import { Forelet } from '../../../../../pi/widget/forelet';
import { UserInfo } from '../../../../server/data/db/user.s';
import { depCopy } from '../../../../utils/util';
import * as store from '../../data/store';
import { rippleShow } from '../../logic/logic';
import { doScanQrCode } from '../../logic/native';
import { setUserInfo } from '../../net/init_1';
import { SpecialWidget } from '../specialWidget';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    offlienType:OfflienType;
    sid: number;
    messageList: any[];
    isUtilVisible: boolean;
    utilList: any[];
    netClose: boolean; // 网络链接是否断开
    avatar:string; // 头像
    isLogin:boolean; // 聊天是否已经登陆
    hasWallet:boolean; // 本地是否已经创建钱包
    activeTab:string;  // 当前活跃的tab
}
export const TAB = {
    message:'message',
    friend:'friend'
};

export class Contact extends SpecialWidget {
    public web3Promise: Promise<string>;
    public defaultInjectPromise: Promise<string>;
    public props: Props = {
        offlienType:OfflienType.CHAT,
        sid:0,
        utilList:[
            { iconPath: 'add-blue.png', utilText: '添加好友' },
            { iconPath: 'group-chat.png', utilText: '创建群聊' },
            { iconPath: 'scan.png', utilText: '扫一扫' },
            { iconPath: 'add-friend.png', utilText: '我的信息' }
        ],
        isUtilVisible:false,
        messageList:[],
        activeTab:TAB.message,
        isLogin:false,
        hasWallet:false,
        avatar:'',
        netClose:false
    };

    public create() {
        super.create();
        this.state = STATE;
    }

    public setProps(props: Json) {
        super.setProps(props);
        this.props.isLogin = !!store.getStore('uid');
        this.props.activeTab = TAB.message;

        // 判断是否从钱包项目进入
        // if (navigator.userAgent.indexOf('YINENG_ANDROID') > -1 || navigator.userAgent.indexOf('YINENG_IOS') > -1) {  
        Promise.all([getStoreData('wallet'),getStoreData('user/info', { nickName: '' })]).then(([wallet,wUser]) => {
            this.props.hasWallet = !!wallet;
            const uid = store.getStore('uid', 0);
            const cUser = store.getStore(`userInfoMap/${uid}`, new UserInfo());  // 聊天
            this.props.avatar = wUser.avatar ? `${uploadFileUrlPrefix}${wUser.avatar}` :'' ;
            
            // 钱包修改了姓名、头像等，或钱包退出登陆 切换账号
            if (wUser.nickName !== cUser.name || wUser.avatar !== cUser.avatar || wUser.acc_id !== cUser.acc_id) {
                if (this.props.isLogin && wUser.nickName) { // 钱包和聊天都已登陆
                    setUserInfo();
                    this.paint();
                } else {
                    store.initStore();
                    this.state.lastChat = []; // 清空记录 lastChat
                    this.paint();
                }
            } 
        });
        
        // }
    }

    public firstPaint() {
        super.firstPaint();
        registerStore('user/info',() => { // 钱包用户信息修改
            this.setProps(this.props);  
        });
        store.register('uid',() => {  // 聊天用户登陆成功
            this.setProps(this.props);
        });
        store.register('flags/logout',() => { // 退出钱包时刷新页面
            this.setProps(this.props);
        });
    }

    /**
     * 进入聊天页面
     * @param id 好友ID或群ID
     * @param chatType 群聊或单聊
     */
    public chat(num:number) {
        this.closeMore();
        const value = this.state.lastChat[num];
        const gid = value.length === 4 ? value[3] :null ;
        popNew3('chat-client-app-view-chat-chat', { id: value[0], chatType: value[2], groupId:gid }) ;
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    // 打开更多功能
    public getMore() {
        // gotoGameService('fairyChivalry');
        // gotoOfficialGroupChat('fairyChivalry');
        if (this.props.isLogin) {
            this.props.isUtilVisible = !this.props.isUtilVisible;
            this.paint();
        } else {
            popNewMessage('聊天未登陆');
        }
    }

    public closeMore() {
        this.props.isUtilVisible = false;
        this.paint();
    }

    public handleFatherTap(e: any) {
        
        switch (e.index) {
            case 0:// 点击添加好友
                popNew3('chat-client-app-view-chat-addUser');
                break;
            case 1:// 创建群聊 setGroupChat
                popNew3('chat-client-app-view-group-setGroupChat');
                break;
            case 2:// 扫一扫 
                doScanQrCode((res) => {  // 扫描二维码
                    popNew3('chat-client-app-view-chat-addUser',{ rid:res });
                    console.log(res);
                    this.paint();
                });
                // openTestWebview(10001);      
                break;
            case 3:
                popNew3('app-view-mine-other-addFriend'); 
                break;

            default:
        }
        this.closeMore();
        this.paint();
    }

    // 切换tab
    public changeTab(e:any) {
        this.props.activeTab = e.activeTab;
        this.paint();
    }

}

// ================================================ 本地
const STATE = {
    lastChat:[],
    contactMap:{
        applyUser:[],
        applyGroup:[],
        friends:[]
    },
    inviteUsers:[],
    convertUser:[]
};
store.register(`lastChat`, (r: [number, number][]) => {
    STATE.lastChat = r;
    forelet.paint(STATE);
});
store.register('contactMap', (r) => {
    for (const value of r.values()) {
        STATE.contactMap = value;
        STATE.inviteUsers = updateInviteUsers(walletStore.getStore('inviteUsers/invite_success', []));
        walletStore.setStore('inviteUsers/invite_success',STATE.inviteUsers);

        STATE.convertUser = updateInviteUsers(walletStore.getStore('inviteUsers/convert_invite', []));
        walletStore.setStore('inviteUsers/convert_invite',STATE.convertUser);
        forelet.paint(STATE);
    }  
});

// 邀请好友成功
registerStore('inviteUsers/invite_success',(r) => {
    const ans = updateInviteUsers(depCopy(r));
    
    if (ans.length < r.length) {
        walletStore.setStore('inviteUsers/invite_success',ans);
    }
    STATE.inviteUsers = ans;
    forelet.paint(STATE);
});

// 兑换好友邀请码成功
registerStore('inviteUsers/convert_invite',(r) => {
    const ans = updateInviteUsers(depCopy(r));
    
    if (ans.length < r.length) {
        walletStore.setStore('inviteUsers/convert_invite',ans);
    }
    STATE.convertUser = ans;
    forelet.paint(STATE);
});
store.register('friendLinkMap',() => {
    const w = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.paint(true);
    }
});
// 更新邀请好友记录
const updateInviteUsers = (ans) => {
    const userInfoMap = store.getStore('userInfoMap',new Map());
    if (STATE.contactMap.friends.length > 0) {
        for (const v of STATE.contactMap.friends) {
            const user = userInfoMap.get(v.toString());
            if (user) {
                const index = ans.indexOf(user.acc_id); 
                index > -1 && ans.splice(index,1);
            }
        }
    }

    return ans;
};