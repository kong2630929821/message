/*
** nameCard 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../../pi/widget/widget"

interface Props{
    avatorPath : string;// 头像
    cardInfo : string; // 名片信息
    isPerson: boolean;//是否个人名片
}

// ===========================导出
export class NameCard extends Widget{
    public props : Props;
    constructor(){
        super();
        this.props = {
                avatorPath : "emoji.png",
                cardInfo : "群名或用户名或",
                isPerson : false
            } 
        };
    }
    
}

