/**
 * selectUser 组件相关处理
 */

 // ================================================ 导入
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { genGuid } from '../../../../utils/util';
import * as store from '../../data/store';
import { getGroupUserAvatar, getUserAlias, getUserAvatar } from '../../logic/logic';

// ================================================ 导出
export class SelectUser extends Widget {
    public props : Props = {
        id: null,
        gid:null,
        name: '',
        chatType:GENERATOR_TYPE.USER,
        isSelect: false,
        disabled:false,
        avatar:''
    };
   
    public setProps(props: any) {
        super.setProps(props);
        this.props.id = props.id;
        this.props.chatType = props.chatType;
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            // 好友别名
            this.props.name = getUserAlias(this.props.id);
            this.props.avatar = getUserAvatar(this.props.id);
        }
        if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            // 群成员
            const groupUser = store.getStore(`groupUserLinkMap/${genGuid(this.props.gid, this.props.id)}`);
            this.props.name = groupUser ? groupUser.userAlias : '';
            this.props.avatar = getGroupUserAvatar(this.props.gid,this.props.id);
        }
    }

    // 点击改变选中状态
    public changeSelect(event:any) {
        if (!this.props.disabled) {
            this.props.isSelect = !this.props.isSelect;
            notify(event.node,'ev-addMember',{ value :  this.props.id,name:this.props.name });
            this.paint();
        }
        
    }
    
}

// ================================================ 本地
interface Props {
    id:number; // 好友id 或者群成员id
    avatar:string; // 用户头像
    gid:number; // 群ID
    name:string;// 好友名 或者 群中的用户名
    chatType:GENERATOR_TYPE;
    isSelect: boolean;// 是否选中
    disabled:boolean; // 是否不允许选择
}