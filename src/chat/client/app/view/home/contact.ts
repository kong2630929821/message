/**
 * 最近会话列表
 */

// ================================================ 导入
import { OfflienType } from '../../../../../app/components1/offlineTip/offlineTip';
import { uploadFileUrlPrefix } from '../../../../../app/config';
import * as walletStore from '../../../../../app/store/memstore';
import { popNew3, popNewMessage } from '../../../../../app/utils/tools';
import { Json } from '../../../../../pi/lang/type';
import { Forelet } from '../../../../../pi/widget/forelet';
import { UserInfo } from '../../../../server/data/db/user.s';
import { depCopy } from '../../../../utils/util';
import * as store from '../../data/store';
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
    showUtils: boolean;
    avatar:string; // 头像
    isLogin:boolean; // 聊天是否已经登陆
    hasWallet:boolean; // 本地是否已经创建钱包
    activeTab:string;  // 当前活跃的tab
    showTag:boolean; // 展示广场下拉
    acTag:number;   // 标签下标
    showMsgUtils:number;  // 消息卡片当前显示操作框的下标
}
export const TAB = {
    message:'message',
    friend:'friend',
    square:'square'
};

export class Contact extends SpecialWidget {
    public web3Promise: Promise<string>;
    public defaultInjectPromise: Promise<string>;
    public props: Props = {
        offlienType:OfflienType.CHAT,
        sid:0,
        showUtils:false,
        messageList:[],
        activeTab:TAB.square,
        isLogin:false,
        hasWallet:false,
        avatar:'',
        showTag:false,
        acTag:0,
        showMsgUtils:-1
    };

    public create() {
        super.create();
        this.state = STATE;
    }

    public setProps(props: Json) {
        super.setProps(props);
        this.props.isLogin = !!store.getStore('uid');
        this.props.activeTab = TAB.square;

        // 判断是否从钱包项目进入
        // if (navigator.userAgent.indexOf('YINENG_ANDROID') > -1 || navigator.userAgent.indexOf('YINENG_IOS') > -1) {  
        this.props.hasWallet = !!walletStore.getStore('wallet');
        const wUser = walletStore.getStore('user/info', { nickName: '' });  // 钱包
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

        // }
    }

    public firstPaint() {
        super.firstPaint();
        walletStore.register('user/info',() => { // 钱包用户信息修改
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

    // 打开更多功能
    public getMore() {
        if (this.props.isLogin) {
            this.props.showUtils = !this.props.showUtils;
            this.paint();
        } else {
            popNewMessage('聊天未登陆');
        }
    }

    public closeMore() {
        this.props.showUtils = false;
        this.props.showMsgUtils = -1;
        this.paint();
    }

    // 切换tab
    public changeTab(e:any) {
        this.props.activeTab = e.activeTab;
        this.props.showTag = e.showTag;
        this.props.showUtils = false;
        this.paint();
    }

    // 切换标签
    public changeTag(e:any) {
        this.props.acTag = e.value;
        this.props.showTag = false;
        this.paint();
    }

    // 点击搜索
    public goSearch() {
        popNew3('chat-client-app-view-chat-search');
    }

    // 操作栏显示隐藏
    public changeUtils(e:any,ind:number) {
        console.log(e,ind);
        this.props.showMsgUtils = e.value ? ind :-1;
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
walletStore.register('inviteUsers/invite_success',(r) => {
    const ans = updateInviteUsers(depCopy(r));
    
    if (ans.length < r.length) {
        walletStore.setStore('inviteUsers/invite_success',ans);
    }
    STATE.inviteUsers = ans;
    forelet.paint(STATE);
});

// 兑换好友邀请码成功
walletStore.register('inviteUsers/convert_invite',(r) => {
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