/*
** utilList 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"
import { notify } from "../../../../pi/widget/event"

interface Util{
    iconPath ?: string; // 图标路径
    utilText : string; // 文本
}
interface Props{
    utilList : Util[];// 操作列表
}


// ===========================导出
export class UtilList extends Widget{
    public props: Props;
    public setProps(props:Props,oldProps:Props){
        super.setProps(props,oldProps);
        // this.props = {
        //     utilList : [{iconPath : "emoji.png",utilText : "搜索"},
        //                 {iconPath : "emoji.png",utilText : "通讯录"},
        //                 {iconPath : "",utilText : "添加好友"}]
        // }   
    }
    // 处理点击每一项功能列表
    handleUtilItemTap(event,index){
        notify(event.node,"ev-handleFatherTap",{index:index});
    }
    
}

