import { popNewMessage } from '../../../../../app/utils/tools';
import { popModalBoxs, popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { GENERATOR_TYPE, UserInfo } from '../../../../server/data/db/user.s';
import { setData } from '../../../../server/data/rpc/basic.p';
import { Result, UserArray } from '../../../../server/data/rpc/basic.s';
import { addToBlackList, changeFriendAlias, removeFromBlackList } from '../../../../server/data/rpc/user.p';
import { FriendAlias } from '../../../../server/data/rpc/user.s';
import { genUserHid, genUuid } from '../../../../utils/util';
import * as store from '../../data/store';
import { complaintUser, getFriendAlias, getUserAvatar } from '../../logic/logic';
import { clientRpcFunc } from '../../net/init';
import { delFriend as delUserFriend, getUsersBasicInfo } from '../../net/rpc';
import { unSubscribeUserInfo } from '../../net/subscribedb';

interface Props {
    userAlias:string;  // 好友备注
    setList:any[][];
    uid: number;
    userInfo: any;
    isFriend: boolean; // 是否是好友
    avatar:string; // 头像
    setting:any; // 额外设置，免打扰|置顶
    msgTop:boolean; // 置顶
    msgAvoid:boolean; // 免打扰
}

/**
 * 消息设置
 */
export class Setting extends Widget {
    public ok:() => void;
    public props:Props = {
        userAlias:'哈哈哈',
        setList:[
            ['修改备注',0,''],
            ['发送名片',0],
            ['查找聊天记录',0],
            ['聊天置顶',1],  // 1 表示右侧是滑块了切换
            ['消息免打扰',1],
            ['清空聊天记录',0],
            ['举报',0],
            ['加入黑名单',0],
            ['删除好友',0]
        ],
        uid: null,
        userInfo: {},
        isFriend: true,
        avatar:'',
        setting:null,
        msgAvoid:false,
        msgTop:false
    };
    private blackPerson:boolean;

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.props.userInfo = store.getStore(`userInfoMap/${this.props.uid}`, new UserInfo());
        
        this.props.setList[0][2] = this.props.userAlias = getFriendAlias(this.props.uid).name;
        this.props.isFriend = getFriendAlias(this.props.uid).isFriend;
        if (!this.props.userAlias) {
            this.getUserData(this.props.uid);
        }
        this.props.avatar = getUserAvatar(this.props.uid) || '../../res/images/user_avatar.png';
        
        const setting = store.getStore('setting',{ msgAvoid:[],msgTop:[] });
        const sid = store.getStore('uid');
        
        this.props.setting = setting;
        this.props.msgTop = setting.msgTop.findIndex(item => item === genUserHid(sid,this.props.uid)) > -1;
        this.props.msgAvoid = setting.msgAvoid.findIndex(item => item === genUserHid(sid,this.props.uid)) > -1;
    }

        // 非好友获取信息
    public getUserData(uid: number) {
        getUsersBasicInfo([uid]).then((r: UserArray) => {
            this.props.userInfo = r.arr[0];
            store.setStore(`userInfoMap/${uid}`,r.arr[0]);
            this.paint();
        },(r) => {
            console.error('获取用户信息失败', r);
        });
    }

    // 返回
    public goBack() {
        this.ok && this.ok();
    }

    // 单项点击
    public itemClick(i:number) {
        switch (i) {
            case 0:  // 修改备注
                popNew('chat-client-app-widget-pageEdit-pageEdit',{ title:'修改备注', contentInput:this.props.userAlias,maxLength:10 },(res:any) => {
                    const friend = new FriendAlias();
                    friend.rid = this.props.uid;
                    friend.alias = res.content;
                    clientRpcFunc(changeFriendAlias, friend, (r: Result) => {
                        if (r.r === 1) {
                            const sid = store.getStore('uid');
                            const friendlink = store.getStore(`friendLinkMap/${genUuid(sid, this.props.uid)}`, {});
                            friendlink.alias = friend.alias;
                            store.setStore(`friendLinkMap/${genUuid(sid, this.props.uid)}`, friendlink);
                            this.props.setList[0][2] = this.props.userAlias = friend.alias;
                            this.paint();
                            popNewMessage('修改好友备注成功');
    
                        } else {
                            popNewMessage('修改好友备注失败');
                        }
                    });
                });
                break;

            case 1:  // 发送名片

                break;
            case 2:  // 查找聊天记录
                
                break;
            case 5: // 清空聊天记录
                popModalBoxs('chat-client-app-widget-modalBox-modalBox', { title: '清空聊天记录', content: `确定清空和${this.props.userInfo.name}的聊天记录吗` },() => {
                    const sid = store.getStore('uid');
                    store.setStore(`userChatMap/${genUserHid(sid,this.props.uid)}`,[]);
                });
                break;
            case 6: // 举报
                this.complaint();
                break;
            case 7:  // 加入黑名单
                this.blackList();
                break;
            case 8: // 删除好友
                popModalBoxs('chat-client-app-widget-modalBox-modalBox', { title: '删除联系人', content: `将联系人${this.props.userInfo.name}删除，同时删除聊天记录`, sureText: '删除' }, () => {
                    this.delFriend(this.props.uid);
                    this.goBack();
                });
                break;
            default:
        }
    }

    // 滑块点击
    public switchClick(e:any,i:number) {
        switch (i) {
            case 3:
                this.msgTop(e.newType);
                break;
            case 4:
                this.msgAvoid(e.newType);
                break;
            default:
        }
    }

    /**
     * 删除好友
     * @param uid 用户ID
     */
    public delFriend(uid: number) {
        delUserFriend(uid, (r: Result) => {
            // 删除成功取消订阅好友消息并清空本地数据
            if (r && r.r === 1) { 
                unSubscribeUserInfo(uid);  // 取消订阅用户信息

                const sid = store.getStore('uid');
                const userChatMap = store.getStore('userChatMap', new Map());
                userChatMap.delete(genUserHid(sid, uid));  // 删除聊天记录
                store.setStore('userChatMap', userChatMap);

                const userInfoMap = store.getStore('userInfoMap', new Map());
                userInfoMap.delete(uid.toString());  // 删除用户信息
                store.setStore('userInfoMap', userInfoMap);

                const lastChat = store.getStore(`lastChat`, []);
                const index = lastChat.findIndex(item => item[0] === uid && item[2] === GENERATOR_TYPE.USER);
                if (index > -1) { // 删除最近对话记录
                    lastChat.splice(index, 1);
                    store.setStore('lastChat', lastChat);
                }

                const lastRead = store.getStore(`lastRead`, []);
                lastRead.delete(genUserHid(sid,uid));  // 删除已读消息记录
                store.setStore(`lastRead`, lastRead);
            } else {
                popNewMessage('删除好友失败');
            }
        });
    }

    /**
     * 设置消息免打扰
     */
    public msgAvoid(fg:boolean) {
        this.props.msgAvoid = fg;
        const setting = this.props.setting;
        const sid = store.getStore('uid');
        const hid = genUserHid(sid,this.props.uid);
        const index = setting.msgAvoid.findIndex(item => item === hid);
        if (fg) {
            index === -1 && setting.msgAvoid.push(hid);
        } else {
            setting.msgAvoid.splice(index,1);
        }
        this.props.setting = setting;
        store.setStore('setting',setting);
        clientRpcFunc(setData,JSON.stringify(setting),(res) => {
            console.log(res);
        });
    }

    /**
     * 设置消息置顶
     */
    public msgTop(fg:boolean) {
        this.props.msgTop = fg;
        const setting = this.props.setting;
        const sid = store.getStore('uid');
        const hid = genUserHid(sid,this.props.uid);
        const index = setting.msgTop.findIndex(item => item === hid);
        if (fg) {
            index === -1 && setting.msgTop.push(hid);
        } else {
            setting.msgTop.splice(index,1);
        }
        this.props.setting = setting;        
        store.setStore('setting',setting);
        this.pushLastChat(fg,setting);
        clientRpcFunc(setData,JSON.stringify(setting),(res) => {
            console.log(res);
        });
    }

    // 压入最近会话列表
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

    /**
     * 举报用户
     */
    public complaint() {
        complaintUser(this.props.userInfo.name);
    }

    /**
     * 
     * 加入或移除黑名单
     */
    public blackList() {
        if (this.blackPerson) {
            clientRpcFunc(removeFromBlackList, this.props.uid, (r) => {
                if (r && r.r === 1) {
                    this.blackPerson = false;
                    popNewMessage('移出黑名单');
                }
            });
        } else {
            popModalBoxs('chat-client-app-widget-modalBox-modalBox', { title: '加入黑名单', content: '加入黑名单，您不再收到对方的消息。' },() => {
                clientRpcFunc(addToBlackList, this.props.uid, (r) => {
                    if (r && r.r === 1) {
                        this.blackPerson = true;
                        popNewMessage('加入黑名单成功');    

                        const sid = store.getStore('uid');
                        const uid = this.props.uid;
                        const lastChat = store.getStore(`lastChat`, []);
                        const index = lastChat.findIndex(item => item[0] === uid && item[2] === GENERATOR_TYPE.USER);
                        if (index > -1) { // 删除最近对话记录
                            lastChat.splice(index, 1);
                            store.setStore('lastChat', lastChat);
                        }

                        const lastRead = store.getStore(`lastRead`, []);
                        lastRead.delete(genUserHid(sid,uid));  // 删除已读消息记录
                        store.setStore(`lastRead`, lastRead);
                    }
                    
                });
            });
        }
    }
}