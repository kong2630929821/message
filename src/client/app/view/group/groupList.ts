/**
 * 群聊列表
 */
// ================================ 导入
import { Json } from '../../../../pi/lang/type';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';

interface GroupList {
    avatorPath: string;// 头像
    text: string;//文本
}

interface Props {
    groupNumber:number;
    userList:GroupList[];
}

// ================================ 导出
export class GroupListt extends Widget {
    setProps(props,oldProps){
        console.log("setProps",props)
       super.setProps(props,oldProps);
       //modify props
       this.props.groupList = [
           {avatorPath:"user.png",text:"群名"},
           {avatorPath:"user.png",text:"群名"},
           {avatorPath:"user.png",text:"群名"},
           {avatorPath:"user.png",text:"群名"}
       ];
    }
    
    public complete(){
        console.log("complete")
    }
}