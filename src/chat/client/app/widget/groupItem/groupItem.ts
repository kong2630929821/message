/*
** groupItem 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../../pi/widget/widget"

interface Props{
    groupAvatorPath : string;// 群头像
    groupName : string;//群名
    groupNum : number;//群人数
    groupNo : string; // 群号
    isJoin: boolean;//是否已加入
}


// ===========================导出
export class GroupItem extends Widget{
    public props : Props;
    constructor(){
        super();
        this.props = {
            
            groupAvatorPath : "emoji.png",
            groupName : "成都户外运动群",
            groupNum : 200,
            groupNo : "11100",
            isJoin : true
            
        };
    }
    
}

