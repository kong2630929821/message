/**
 * selectUser 组件相关处理
 */

 // ================================================ 导入
import { Json } from '../../../../pi/lang/type';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';
import { GENERATOR_TYPE, UserInfo } from '../../../../server/data/db/user.s';
import * as store from '../../data/store';

// ================================================ 导出
export class SelectUser extends Widget {
    public props : Props = {
        id: null,
        name: '',
        chatType:GENERATOR_TYPE.USER,
        isSelect: false
    };
   
    public setProps(props: any) {
        super.setProps(props);
        this.props.id = props.id;
        this.props.chatType = props.chatType;
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            // 好友别名
            const userInfo = store.getStore(`userInfoMap/${this.props.id}`,new UserInfo());
            this.props.name = userInfo ? userInfo.name : '';
        }
        if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            // 群名片
            const userInfo = store.getStore(`userInfoMap/${this.props.id}`,new UserInfo());
            this.props.name = userInfo ? userInfo.name : '';
        }
    }

    // 点击改变选中状态
    // public changeSelect(event:any){
    //     let temp = this.props.isSelect;
    //     this.props.isSelect = !temp;
    //     notify(event.node,"ev-addMember",{});
    //     this.paint();
    // }
    
}

// ================================================ 本地
interface Props {
    id?:number; // 好友id 或者群成员id
    name:string;// 好友名 或者 群中的用户名
    chatType:GENERATOR_TYPE;
    isSelect: boolean;// 是否选中
}