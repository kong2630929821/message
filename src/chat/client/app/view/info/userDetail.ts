/**
 * 联系人详细信息
 */

// ================================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { CUSTOMER_SERVICE } from '../../../../server/data/constant';
import { GENERATOR_TYPE, UserInfo } from '../../../../server/data/db/user.s';
import { getUsersInfo, setData } from '../../../../server/data/rpc/basic.p';
import { GetUserInfoReq, Result, UserArray } from '../../../../server/data/rpc/basic.s';
import { changeFriendAlias } from '../../../../server/data/rpc/user.p';
import { FriendAlias } from '../../../../server/data/rpc/user.s';
import { Logger } from '../../../../utils/logger';
import { genUserHid, genUuid } from '../../../../utils/util';
import * as store from '../../data/store';
import { bottomNotice, copyToClipboard, getFriendAlias, getUserAvatar, rippleShow } from '../../logic/logic';
import { clientRpcFunc, unSubscribe } from '../../net/init';
import { applyFriend, delFriend as delUserFriend } from '../../net/rpc';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class UserDetail extends Widget {
    public ok: () => void;
    public props: Props;
    constructor() {
        super();
        this.props = {
            uid: null,
            inFlag: 0,
            isContactorOpVisible: false,
            utilList: [],
            userInfo: {},
            alias: '',
            isFriend: true,
            avatar:'',
            setting:null,
            msgAvoid:false,
            msgTop:false
        };
    }

    public setProps(props: Json) {
        super.setProps(props);
        this.props.userInfo = {};
        if (props.inFlag === 3) {
            this.props.utilList = [{ utilText: '加入黑名单' }];
        } else if (props.uid === CUSTOMER_SERVICE) {
            this.props.utilList = [
            { utilText: '修改备注' },
            { utilText: '清空聊天记录' }
            ];
        } else {
            this.props.utilList = [
                { utilText: '修改备注' },
                // { utilText: '发送名片' },
                { utilText: '清空聊天记录' },
                // { utilText: '加入黑名单' },
                { utilText: '删除好友' }
            ];
        }

        this.props.isContactorOpVisible = false;
        this.props.isFriend = true;
        this.props.userInfo = store.getStore(`userInfoMap/${this.props.uid}`, new UserInfo());
        this.props.alias = getFriendAlias(this.props.uid);
        if (!this.props.alias) {
            this.getUserData(this.props.uid);
        }
        logger.debug(props);
        this.props.avatar = getUserAvatar(this.props.uid) || '../../res/images/img_avatar1.png';
        
        const setting = store.getStore('setting',{ msgAvoid:[],msgTop:[] });
        const sid = store.getStore('uid');
        
        this.props.setting = setting;
        this.props.msgTop = setting.msgTop.findIndex(item => item === genUserHid(sid,this.props.uid)) > -1;
        this.props.msgAvoid = setting.msgAvoid.findIndex(item => item === genUserHid(sid,this.props.uid)) > -1;
    }

    // 非好友获取信息
    public getUserData(uid: number) {
        const info = new GetUserInfoReq();
        info.uids = [uid];
        this.props.isFriend = false;
        clientRpcFunc(getUsersInfo, info, (r: UserArray) => {
            if (r && r.arr.length > 0) {
                this.props.userInfo = r.arr[0];
                this.paint();
            } else {
                console.error('获取用户信息失败', r);
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
        this.pageClick();
        popNew('chat-client-app-view-chat-chat', { id: this.props.uid, chatType: GENERATOR_TYPE.USER });
    }

    // 添加好友
    public addUser() {
        this.pageClick();
        applyFriend(this.props.uid.toString(), (r: Result) => {
            if (r.r === 0) {
                bottomNotice(`${this.props.uid}已经是你的好友`);
            }
        });
    }
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    // 点击联系人操作列表项
    public handleFatherTap(e: any) {
        this.props.isContactorOpVisible = false;
        this.paint();
        if (this.props.inFlag === 3) {
            popNew('chat-client-app-widget-modalBox-modalBox', { title: '加入黑名单', content: '加入黑名单，您不再收到对方的消息。' });
            
            return;
        }
        switch (e.index) {
            case 0: // 修改备注
                this.changeFriendAlias();
                break;
            // case 1: // 发送名片

            //     break;
            case 1: // 清空聊天记录
                popNew('chat-client-app-widget-modalBox-modalBox', { title: '清空聊天记录', content: `确定清空和${this.props.userInfo.name}的聊天记录吗` },() => {
                    const sid = store.getStore('uid');
                    store.setStore(`userChatMap/${genUserHid(sid,this.props.uid)}`,[]);
                });
                break;
            // case 3: // 加入黑名单
            //     popNew('chat-client-app-widget-modalBox-modalBox', { title: '加入黑名单', content: '加入黑名单，您不再收到对方的消息。' });
            //     break;
            case 2: // 删除联系人
                popNew('chat-client-app-widget-modalBox-modalBox', { title: '删除联系人', content: `将联系人${this.props.userInfo.name}删除，同时删除聊天记录`, sureText: '删除' }, () => {
                    this.delFriend(this.props.uid);
                    this.goBack();
                });
                break;
            default:
        }
    }

    public goBack() {
        this.ok();
    }

    /**
     * 删除好友
     * @param uid 用户ID
     */
    public delFriend(uid: number) {
        delUserFriend(uid, (r: Result) => {
            if (r && r.r === 1) { // 删除成功取消订阅好友消息并清空本地数据
                unSubscribe(uid.toString());

                const sid = store.getStore('uid');
                const userChatMap = store.getStore('userChatMap', new Map());
                userChatMap.delete(genUserHid(sid, uid));  // 删除聊天记录
                store.setStore('userChatMap', userChatMap);

                const userInfoMap = store.getStore('userInfoMap', new Map());
                userInfoMap.delete(uid);  // 删除用户信息
                store.setStore('userInfoMap', userInfoMap);

                const lastChat = store.getStore(`lastChat`, []);
                const index = lastChat.findIndex(item => item[0] === uid && item[2] === GENERATOR_TYPE.USER);
                if (index > -1) { // 删除最近对话记录
                    lastChat.splice(index, 1);
                    store.setStore('lastChat', lastChat);
                }
            } else {
                bottomNotice('删除好友失败');
            }
        });
    }

    /**
     * 页面点击
     */
    public pageClick() {
        this.props.isContactorOpVisible = false;
        this.paint();
    }

    /**
     * 修改好友备注
     */
    public changeFriendAlias() {
        popNew('chat-client-app-widget-pageEdit-pageEdit',{ title:'修改备注', contentInput:this.props.alias },(res:any) => {
            const friend = new FriendAlias();
            friend.rid = this.props.uid;
            friend.alias = res.content;
            clientRpcFunc(changeFriendAlias, friend, (r: Result) => {
                if (r.r === 1) {
                    const sid = store.getStore('uid');
                    const friendlink = store.getStore(`friendLinkMap/${genUuid(sid, this.props.uid)}`, {});
                    friendlink.alias = friend.alias;
                    store.setStore(`friendLinkMap/${genUuid(sid, this.props.uid)}`, friendlink);
                    this.props.alias = friend.alias;
                    this.paint();
                    bottomNotice('修改好友备注成功');

                } else {
                    bottomNotice('修改好友备注失败');
                }
            });
        });
        
    }

    /**
     * 点击复制
     */
    public doCopy(i:number) {
        if (i === 0) {
            copyToClipboard(this.props.uid);
        } else if (i === 1) {
            copyToClipboard(this.props.userInfo.wallet_addr);
        } else {
            copyToClipboard(this.props.userInfo.tel);
        }
        this.props.isContactorOpVisible = false;
        this.paint();
        bottomNotice('复制成功');
    }

    /**
     * 设置消息免打扰
     */
    public msgAvoid(e:any) {
        this.props.msgAvoid = e.newType;
        const setting = this.props.setting;
        const sid = store.getStore('uid');
        const hid = genUserHid(sid,this.props.uid);
        const index = setting.msgAvoid.findIndex(item => item === hid);
        if (e.newType) {
            index === -1 && setting.msgAvoid.push(hid);
        } else {
            setting.msgAvoid.splice(index,1);
        }
        this.props.setting = setting;
        store.setStore('setting',setting);
        clientRpcFunc(setData,JSON.stringify(setting),(res) => {
            // TODO
            console.log(res);
        });
    }

    /**
     * 设置消息置顶
     */
    public msgTop(e:any) {
        this.props.msgTop = e.newType;
        const setting = this.props.setting;
        const sid = store.getStore('uid');
        const hid = genUserHid(sid,this.props.uid);
        const index = setting.msgTop.findIndex(item => item === hid);
        if (e.newType) {
            index === -1 && setting.msgTop.push(hid);
        } else {
            setting.msgTop.splice(index,1);
        }
        this.props.setting = setting;        
        store.setStore('setting',setting);
        this.pushLastChat(e.newType,setting);
        clientRpcFunc(setData,JSON.stringify(setting),(res) => {
            // TODO
            console.log(res);
        });
    }

    public pushLastChat(fg:boolean,setting:any) {
        const lastChat = store.getStore(`lastChat`, []);
        const ind = lastChat.findIndex(item => item[0] === this.props.uid && item[2] === GENERATOR_TYPE.USER);
        ind > -1 && lastChat.splice(ind, 1); 
        if (fg) { // 置顶放到最前面
            lastChat.unshift([this.props.uid, Date.now(), GENERATOR_TYPE.USER]); // 向前压入数组中
        } else {  // 取消置顶放到置顶消息后
            const len = setting.msgTop.length;
            lastChat.splice(len, 0, [this.props.uid, Date.now(), GENERATOR_TYPE.USER]); // 压入到置顶消息后
        }
        store.setStore(`lastChat`,lastChat);

    }
}

// ================================================ 本地

interface Props {
    uid: number;
    inFlag: number; // 从某个页面进入，0 contactList进入, 1 chat 单聊进入，2 chat 群聊进入，3 newfriendapply 新朋友申请进入
    isContactorOpVisible: boolean;
    utilList: any;
    userInfo: any;
    alias: string; // 好友别名
    // editable: boolean; // 是否可编辑别名
    isFriend: boolean; // 是否是好友
    avatar:string; // 头像
    setting:any; // 额外设置，免打扰|置顶
    msgTop:boolean; // 置顶
    msgAvoid:boolean; // 免打扰
}
