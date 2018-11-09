/*
** contactItem 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"
import { notify } from "../../../../pi/widget/event"

interface Props{
    avatorPath : string;// 头像
    text : string;//文本
    isNewAdd?: boolean;//是否有新消息
    totalNew?: number;//多少条
}


// ===========================导出
export class ContactItem extends Widget{
    public props : Props;
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props, oldProps);
        // this.props = {
            
        //     avatorPath : "emoji.png",
        //     text : "Evan Wood",
        //     isNewAdd : true,
        //     totalNew : 17
        // };
    }
}

