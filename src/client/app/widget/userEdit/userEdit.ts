/*
** userEdit 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"

interface Props{
    avatorPath : string;// 头像
    userName : string;//用户名
    otherInfo : string; // 其他
}


// ===========================导出
export class UserEdit extends Widget{
    public props : Props;
    constructor(){
        super();
        this.props = {
            avatorPath : "emoji.png",
            userName : "好友用户名",
            otherInfo : "ox59b49493bb587g"
        };
    }
    
}

