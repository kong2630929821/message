/**
 * contactItem 组件相关处理
 */

// ================================================ 导入
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { GROUP_STATE, GroupInfo } from '../../../../server/data/db/group.s';
import { GENERATOR_TYPE, UserInfo, VIP_LEVEL } from '../../../../server/data/db/user.s';
import { depCopy } from '../../../../utils/util';
import * as store from '../../data/store';
import { getGroupAvatar, getUserAlias, getUserAvatar, rippleShow } from '../../logic/logic';
import { getUsersBasicInfo } from '../../net/rpc';

// ================================================ 导出
export class UserItem extends Widget {
    public props: Props = {
        id:null,
        name:'',
        chatType:GENERATOR_TYPE.USER,  
        text:'',
        totalNew: null,
        official:false,
        msg:'',
        addType:'',
        sex:2
    };
    public bindUpdate:any = this.updateData.bind(this);

    public setProps(props: any) {
        super.setProps(props);
        this.props.show = true;
        
        if (!this.props.text) {
            if (this.props.chatType === GENERATOR_TYPE.USER) {
                if (this.props.id !== store.getStore('uid')) {
                    this.props.name = getUserAlias(this.props.id).name;
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
            store.register(`userInfoMap/${this.props.id}`,this.bindUpdate);
            console.log('contactItem firstPaint',`userInfoMap/${this.props.id}`);
        } else if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            store.register(`groupInfoMap/${this.props.id}`,this.bindUpdate);
        }
    }

    // 更新信息
    public updateData() {
        this.setProps(this.props);
        this.paint();
    }

    public destroy() {
        super.destroy();
        store.unregister(`groupInfoMap/${this.props.id}`,this.bindUpdate);
        store.unregister(`userInfoMap/${this.props.id}`,this.bindUpdate);

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
    sex?:number;// 
    time?:string;// 时间
}
