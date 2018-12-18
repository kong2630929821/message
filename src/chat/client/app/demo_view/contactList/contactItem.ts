/**
 * contactItem 组件相关处理
 */

// ================================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { Widget } from '../../../../../pi/widget/widget';
import { GROUP_STATE, GroupInfo } from '../../../../server/data/db/group.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import * as store from '../../data/store';
import { getFriendAlias } from '../../logic/logic';

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
        totalNew: null  
    };
    public setProps(props: any) {
        super.setProps(props);
        this.props.show = true;
        
        if (!this.props.text) {
            if (this.props.chatType === GENERATOR_TYPE.USER) {
                this.props.name = getFriendAlias(this.props.id);
            }
            if (this.props.chatType === GENERATOR_TYPE.GROUP) {
                const group = store.getStore(`groupInfoMap/${this.props.id}`,new GroupInfo());
                this.props.name = group.name; 
                this.props.show = group.state === GROUP_STATE.CREATED;
            }
        }
    }
   
}

// ================================================ 本地
interface Props {
    id?:number; // 用户id或者群组id
    name?:string; // 用户名或者群名
    chatType:GENERATOR_TYPE; // 用户或者群组
    text?:string; // 显示文本
    totalNew?: number; // 多少条消息
    show?:boolean; // 是否显示
}