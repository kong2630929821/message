/**
 * contactItem 组件相关处理
 */

// ================================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { GROUP_STATE, GroupInfo } from '../../../../server/data/db/group.s';
import { GENERATOR_TYPE, UserInfo, VIP_LEVEL } from '../../../../server/data/db/user.s';
import { depCopy, genUuid } from '../../../../utils/util';
import * as store from '../../data/store';
import { getFriendAlias, getGroupAvatar, getUserAvatar, rippleShow } from '../../logic/logic';
import { getUsersBasicInfo } from '../../net/rpc';

interface Props {
    uid?:number;
    gid?:number;
    ginfo?:Json;
    info?:Json; // 用户信息
    text?:string; // 显示文本
    totalNew?: number;// 多少条消息
}

// ================================================ 导出
export class ContactItem extends Widget {
    public props: Props = {
        id:null,
        name:'',
        chatType:GENERATOR_TYPE.USER,  
        text:'',
        totalNew: null,
        official:false,
        msg:'',
        addType:'' 
    };

    public setProps(props: any) {
        super.setProps(props);
        this.props.show = true;
        
        if (!this.props.text) {
            if (this.props.chatType === GENERATOR_TYPE.USER) {
                if (this.props.id !== store.getStore('uid')) {
                    this.props.name = getFriendAlias(this.props.id).name;
                    if (!this.props.name) { 
                        getUsersBasicInfo([this.props.id]).then((r:any) => {
                            store.setStore(`userInfoMap/${this.props.id}`,r.arr[0]);
                            this.props.name = r.arr[0].name;
                            this.props.img = getUserAvatar(this.props.id) || '../../res/images/user_avatar.png';
                            this.paint();
                        });
                    }
                    
                } else {
                    this.props.name = depCopy(store.getStore(`userInfoMap/${this.props.id}`,new UserInfo()).name || '');
                    this.props.name += '(本人)';
                }
                this.props.img = getUserAvatar(this.props.id) || '../../res/images/user_avatar.png';
                this.props.official = store.getStore(`userInfoMap/${this.props.id}`,{ level:0 }).level === VIP_LEVEL.VIP5;
                
            } else {
                const group = store.getStore(`groupInfoMap/${this.props.id}`,new GroupInfo());
                this.props.official = group.level === 5;
                this.props.name = group.name; 
                this.props.show = group.state === GROUP_STATE.CREATED;
                this.props.img = getGroupAvatar(this.props.id) || '../../res/images/groups.png';
            }
        }
    }

    public firstPaint() {
        super.firstPaint();
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            store.register(`userInfoMap/${this.props.id}`,this.updateUserinfo);
            const sid = store.getStore(`uid`);
            if (sid !== this.props.id) {
                store.register(`friendLinkMap/${genUuid(sid,this.props.id)}`,this.updateAlias);
            }
        } else if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            store.register(`groupInfoMap/${this.props.id}`,this.updateGroupinfo);
        }
    }

    // 更新别名
    public updateAlias(r:any) {
        this.props.name = r.alias;
        this.paint();
    }

    // 更新用户信息
    public updateUserinfo(r:UserInfo) {
        this.props.name = r.name;
        this.props.img = getUserAvatar(this.props.id) || '../../res/images/user_avatar.png';
        this.paint();
    }

    // 更新群组信息
    public updateGroupinfo(r:GroupInfo) {
        this.props.name = r.name;
        this.props.img = getGroupAvatar(this.props.id) || '../../res/images/groups.png';
        this.paint();
    }

    public destroy() {
        super.destroy();
        const sid = store.getStore(`uid`);
        if (sid !== this.props.uid) {
            store.unregister(`friendLinkMap/${genUuid(sid,this.props.uid)}`,this.updateAlias);
        }
        store.unregister(`groupInfoMap/${this.props.id}`,this.updateGroupinfo);
        store.unregister(`userInfoMap/${this.props.id}`,this.updateUserinfo);

        return true;
    }

    // 添加
    public addType(e:any) {
        notify(e.node,'ev-addType',null);
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}

// ================================================ 本地
interface Props {
    id?:number; // 用户id或者群组id
    name?:string; // 用户名或者群名
    chatType?:GENERATOR_TYPE; // 用户或者群组
    text?:string; // 显示文本
    totalNew?: number; // 多少条消息
    show?:boolean; // 是否显示
    img?:string; // 图标或头像
    official:boolean; // 是否是官方群组
    msg?:string;// 聊天记录
    addType?:string;// 添加好友群公众号
}
