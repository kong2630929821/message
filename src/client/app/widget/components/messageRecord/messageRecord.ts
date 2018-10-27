/*
** messageRecord 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../../pi/widget/widget"

interface Props{
    avatorPath : string;// 头像
    resIconPath ?: string;// 标志来源图标
    userName : string;//用户名
    recordInfo : string; // 简短的消息记录
    recordTime: string;//消息记录时间
}


// ===========================导出
export class MessageRecord extends Widget{
    public props : Props;
    constructor(){
        super();
        this.props = {
            
                avatorPath : "emoji.png",
                resIconPath : "",
                userName : "Evan Wood",
                recordInfo : "给我发个红包看看",
                recordTime : "18:30"
            
        };
    }
    
}

