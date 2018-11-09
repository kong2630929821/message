/*
** textMessage 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"

interface Props{
    message : string; // 消息内容
    sendTime:string;//发送时间
    isYourSelf: boolean;//是否本人的消息
    isRead:boolean;//是否已读
}

// ===========================导出
export class TextMessage extends Widget{
    public props : Props;
    constructor(){
        super();
        this.props = {
                message : "大家好在我是新手请多多指教大家啊好，我是新手请多多指教大家好，我是新手请多多指教",
                sendTime : "17:56",
                isYourSelf : true,
                isRead:true
        };
    }
}

