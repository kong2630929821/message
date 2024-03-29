/**
 * 最近会话列表
 */

// ================================================ 导入
import { getStoreData, setStoreData } from '../../../../../app/api/walletApi';
import { registerStoreData } from '../../../../../app/postMessage/listenerStore';
import { OfflienType } from '../../../../../app/publicComponents/offlineTip/offlineTip';
import { getStore } from '../../../../../app/store/memstore';
import { popNewMessage } from '../../../../../app/utils/pureUtils';
import { popNew3 } from '../../../../../app/utils/tools';
import { notify } from '../../../../../pi/widget/event';
import { Forelet } from '../../../../../pi/widget/forelet';
import { GENERATOR_TYPE, UserInfo } from '../../../../server/data/db/user.s';
import { depCopy } from '../../../../utils/util';
import * as store from '../../data/store';
import { deelNotice } from '../../logic/logic';
import { doScanQrCode } from '../../logic/native';
import { setUserInfo } from '../../net/init_1';
import { showPost } from '../../net/rpc';
import { SpecialWidget } from '../specialWidget';

// ================================================ 导出
export const forelet = new Forelet();

interface Props {
    offlienType:OfflienType;
    sid: number;
    messageList: any[];
    isUtilVisible: boolean;
    utilList: any[];
    userInfo:any; 
    netClose: boolean; // 网络链接是否断开    
    isLogin:boolean; // 聊天是否已经登陆
    hasWallet:boolean; // 本地是否已经创建钱包
    activeTab:string;  // 当前活跃的tab
    acTag:number;   // 当前活跃的广场标签下标
    showTag:boolean;  // 展示广场下拉
    tabBarList:any;
    labelList:any;
    gameName:string;   // 从游戏跳到广场对应的标签
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
        utilList:[
            { iconPath: 'add-blue.png', utilText: '添加好友' },
            { iconPath: 'group-chat.png', utilText: '创建群聊' },
            { iconPath: 'scan.png', utilText: '扫一扫' },
            { iconPath: 'add-friend.png', utilText: '我的信息' }
        ],
        isUtilVisible:false,
        messageList:[],
        activeTab:TAB.square,
        isLogin:false,
        hasWallet:false,
        netClose:false,
        userInfo:{},
        acTag:0,
        showTag:false,
        tabBarList:[
            {
                modulName:'square',
                components:'chat-client-app-view-home-square'
            },
            {
                modulName:'message',
                components:'chat-client-app-view-home-contactNotice'
            }
        ],
        labelList:[],
        gameName:''
    };
    constructor() {
        super();
        this.props.labelList = getStore('game/allGame',[]);
    }

    public create() {
        super.create();
        this.state = STATE;
        this.state.pubNum = store.getStore('pubNum',0);
        this.state.tagList = store.getStore('tagList',[]);
        // this.initDate();
    }

    public setProps(props: Props) {
        if (props.gameName) {
            let index:number =  this.state.tagList.indexOf(props.gameName);
            index = index >= 0 ? index :0;
            props.acTag = index;
            console.log('tagList',this.state.tagList,'index',index);
        }
        this.props = {
            ...this.props,
            ...props
        };
        this.initDate();
    }

    public initDate() {
        const uid = store.getStore('uid', 0);
        this.props.isLogin = !!uid;
        if (this.props.isLogin) {   // 聊天已登录成功
            this.changeUserinfo();
        }
    }

    public changeUserinfo() {
        const uid = store.getStore('uid', 0);
        const cUser = store.getStore(`userInfoMap/${uid}`, new UserInfo());  // 聊天
     
        getStoreData('user',{ info:{},id:'' }).then(wUser => {
            // 钱包修改了姓名、头像等，或钱包退出登陆 切换账号
            if (wUser.info.nickName !== cUser.name || wUser.info.avatar !== cUser.avatar || wUser.acc_id !== cUser.acc_id || wUser.info.sex !== cUser.sex || wUser.info.phoneNumber !== cUser.tel || wUser.info.note !== cUser.note) {
                if (this.props.isLogin && wUser.info.nickName) { // 钱包和聊天都已登陆
                    setUserInfo();
                } else if (cUser.uid) {  // 聊天已登录
                    store.initStore();
                    this.state.lastChat = []; // 清空记录 lastChat
                    this.paint();
                }
            } 
        });
    }
    public firstPaint() {
        super.firstPaint();
        registerStoreData('user/info',() => { // 钱包用户信息修改
            if (this.props.isLogin) {   // 聊天已登录成功
                this.changeUserinfo();
            }
        });
        store.register('uid',() => {  // 聊天用户登陆成功
            this.setProps(this.props);
            this.props.isLogin = true;
        });
        store.register('flags/logout',() => { // 退出钱包时刷新页面
            this.setProps(this.props);
            this.state = {
                lastChat:[],
                contactMap:{
                    applyUser:[],
                    applyGroup:[],
                    friends:[]
                },
                inviteUsers:[],
                convertUser:[],
                notice:[],
                pubNum:0
            };
            this.paint();
        });
    }

    // 打开更多功能
    public getMore() {
        // gotoGameService('fairyChivalry');
        // gotoOfficialGroupChat('fairyChivalry');
        if (this.props.isLogin) {
            if (this.props.activeTab === TAB.square) {
                let label = {
                    name:'',
                    icon:''
                };
                if (this.props.acTag >= 2) {
                    const currentItem = this.props.labelList.find(item => item.title === this.state.tagList[this.props.acTag]);
                    label = {
                        name:this.state.tagList[this.props.acTag],
                        icon:currentItem.img[0]
                    };
                }
                popNew3('chat-client-app-view-info-editPost',{ isPublic:false,label },() => {
                    if (this.props.acTag < 2) {
                        showPost(this.props.acTag + 1);
                    } else {
                        showPost(5,this.state.tagList[this.props.acTag]);
                    }
                    
                });
            } else {
                // 通讯录
                popNew3('chat-client-app-view-person-addressBook');
                
            }
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
        this.closeMore();
        this.props.activeTab = e.activeTab;
        if (e.activeTab === TAB.square) {
            this.props.showTag = e.showTag;
        } else {
            this.props.showTag = false;
        }
        this.paint();
        notify(e.node,'ev-chat-square-change-tab',{ activeTab:this.props.activeTab });
    }
    // 切换tag
    public changeTagItem(ind:number) {
        this.props.showTag = false;
        this.props.acTag = ind;
        this.paint();
    }
    // // 切换tag
    // public changeTag(e:any) {
    //     this.props.showTag = false;
    //     this.props.acTag = e.value;
    //     this.paint();
    // }

    // 聊天通知点击
    public evChat() {
        this.closeMore();
    }

    public labelChangeTag(e:any) {
        this.props.acTag = e.value;
        this.paint(true);
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
    convertUser:[],
    notice:[],
    pubNum:0,
    tagList:[]
};

store.register('contactMap', (r) => {
    getStoreData('inviteUsers').then(inviteUsers => {
        for (const value of r.values()) {
            STATE.contactMap = value;
            STATE.inviteUsers = updateInviteUsers(inviteUsers.invite_success || []);
            STATE.convertUser = updateInviteUsers(inviteUsers.convert_invite || []);
            inviteUsers.invite_success = STATE.inviteUsers;
            inviteUsers.convert_invite = STATE.convertUser;
            setStoreData('inviteUsers',inviteUsers);
            forelet.paint(STATE);
        }  
    });
   
});

// 邀请好友成功
registerStoreData('inviteUsers/invite_success', (r) => {
    const ans = updateInviteUsers(depCopy(r) || []);
    if (ans.length < r.length) {
        setStoreData('inviteUsers/invite_success',ans);
    }
    STATE.inviteUsers = ans;
    deelNotice(r,store.GENERATORTYPE.NOTICE_1);
    forelet.paint(STATE);
});

// 兑换好友邀请码成功
registerStoreData('inviteUsers/convert_invite',(r) => {
    const ans = updateInviteUsers(depCopy(r) || []);
    if (ans.length < r.length) {
        setStoreData('inviteUsers/convert_invite',ans);
    }
    deelNotice([r],store.GENERATORTYPE.NOTICE_2);
    STATE.convertUser = ans;
    forelet.paint(STATE);
});

// 更新邀请好友记录
const updateInviteUsers = (ans) => {
    const userInfoMap = store.getStore('userInfoMap',new Map());
    for (const v of STATE.contactMap.friends) {
        const user = userInfoMap.get(v.toString());
        if (user) {
            // const index = ans.indexOf(user.acc_id); 
            // index > -1 && ans.splice(index,1);
            let index = null;
            ans.forEach((v,i) => {
                if (v[0] === user.acc_id) {
                    index = i;
                }
            });
            index > -1 && ans.splice(index,1);
        }
    }

    return ans;
};
store.register(`noticeList`, (r:any) => {
    if (r.length === 0) {
        return ;
    }
    const data = r[r.length - 1];
    // STATE.notice = r[r.length - 1];
    const lastChat = store.getStore(`lastChat`, []);
    const index = lastChat.findIndex(item => item[2] !== GENERATOR_TYPE.USER && item[2] !== GENERATOR_TYPE.GROUP);
    if (index > -1) {
        lastChat.splice(index,1,data);
        
    } else {
        lastChat.push(data);
    }
    store.setStore('lastChat',lastChat);
    // forelet.paint(STATE);
});

// 监听点赞列表变化
store.register(`fabulousList`, (r:any) => {
    if (r.length === 0) {
        return ;
    }
    deelNotice(r,store.GENERATORTYPE.NOTICE_3);
});

// 监听评论列表变化
store.register(`conmentList`, (r:any) => {
    if (r.length === 0) {
        return ;
    }
    deelNotice(r,store.GENERATORTYPE.NOTICE_4);
});

// 监听公众号变化
store.register(`pubNum`,(r:number) => {
    STATE.pubNum = r;
    forelet.paint(STATE);
});

store.register('tagList',(r) => {
    STATE.tagList = r;
    forelet.paint(STATE);
});