/*
** inputMessage 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"
import {notify} from "../../../../pi/widget/event"

interface Props{
    rid : number,
    isOnInput:boolean
}

// ===========================导出
export class InputMessage extends Widget{

    public setProps(props,oldProps){
        console.log("新旧",props,oldProps)
        super.setProps(props,oldProps);
        this.props.isOnInput = false;
    }
    props:Props={
        rid : 10001,
        isOnInput:false
    }
    
    // 麦克风输入处理
    public playRadio(){
        console.log("playRadio");
    }

    // 打开表情
    public playRemoji(){
        console.log("playRemoji");
    }

    // 打开更多功能
    public openTool(){
        console.log("openTool");
    }

    // 点击发送
    public send(e){
        if(this.props.isOnInput){ // 有输入才触发发送事件处理
            notify(e.node,"ev-send",{})    
        }
    }

    public HandleOnInput(e){
        if(e.value){
            this.props.isOnInput = true;
        }
        else{
            this.props.isOnInput = false;
        }
        notify(e.node,"ev-input-text",{"message":e.value})
        this.paint();
    }

}

