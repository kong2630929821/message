/*
** inputMessage 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"


// ===========================导出
export class InputMessage extends Widget{

    public create(){
        super.create();
        this.state = {
            isOnInput : false
        }
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

    public HandleOnInput(e){
        if(e.text){
            this.state.isOnInput = true;
        }
        else{
            this.state.isOnInput = false;
        }
        this.paint();
    }

}

