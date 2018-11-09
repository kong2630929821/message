/*
** featureBar 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"
import { notify } from "../../../../pi/widget/event"

interface Props{
    iconPath : string;// 头像
    text : string;//文本
}


// ===========================导出
export class FeatureBar extends Widget{
    props:Props = {
        iconPath : "emoji.png",
        text : "Evan Wood",
    };
    // 点击更多
    more(e){
        notify(e.node,"ev-getMore",{});
    }
}

