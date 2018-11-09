/**
 * 创建群聊
 */
// ================================ 导入
import { Json } from '../../../../pi/lang/type';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';

interface UserList {
    avatorPath: string;// 头像
    text: string;//文本
}

interface Props {
    groupNumber:number;
    userList:UserList[];
}

// ================================ 导出
export class TopBar extends Widget {
    setProps(props,oldProps){
        console.log("setProps",props)
       super.setProps(props,oldProps);
       //modify props
       this.props.userList = [
           {avatorPath:"user.png",userName:"用户名",isSelect:false},
           {avatorPath:"user.png",userName:"用户名",isSelect:false},
           {avatorPath:"user.png",userName:"用户名",isSelect:false},
           {avatorPath:"user.png",userName:"用户名",isSelect:false}
       ];
    }
    
    public complete(){
        console.log("complete")
    }
}