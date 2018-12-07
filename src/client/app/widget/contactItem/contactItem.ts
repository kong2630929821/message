/**
 * contactItem 组件相关处理
 */

// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import * as store from '../../data/store';
import { getFriendAlias } from '../../logic/logic';

// ================================================ 导出
export class ContactItem extends Widget {
    public props: Props = {
        id:null,
        name:'',
        chatType:GENERATOR_TYPE.USER,  
        text:'',
        totalNew: null  
    };
    public setProps(props: Props) {
        super.setProps(props);
        this.props.chatType = props.chatType;
        this.props.id = props.id;
        if (!this.props.text) {
            if (this.props.chatType === GENERATOR_TYPE.USER) {
                this.props.name = getFriendAlias(this.props.id);
            }
            if (this.props.chatType === GENERATOR_TYPE.GROUP) {
                this.props.name = store.getStore(`groupInfoMap/${this.props.id}`,new GroupInfo()).name; 
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
}