/*
** utilList 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../../pi/widget/widget"

interface Util{
    iconPath ?: string; // 图标路径
    utilText : string; // 文本
}
interface Props{
    utilList : Util[];// 操作列表
}


// ===========================导出
export class UtilList extends Widget{
    public props : Props;
    constructor(){
        super();
        this.props = {
            utilList : [{iconPath : "emoji.png",utilText : "搜索"},
                        {iconPath : "emoji.png",utilText : "通讯录"},
                        {iconPath : "",utilText : "添加好友"}
                    ]
        };
    }
    
}

