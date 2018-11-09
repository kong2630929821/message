/*
** selectUser 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"
import { notify } from "../../../../pi/widget/event"

interface Props{
    avatorPath : string;// 头像
    userName : string;//用户名
    isSelect: boolean;//是否选中
}


// ===========================导出
export class SelectUser extends Widget{
    public props : Props;
    constructor(){
        super();
        this.props = {
            
                avatorPath : "emoji.png",
                userName : "Evan Wood",
                isSelect : false
            
        };
    }

    // 点击改变选中状态
    public changeSelect(event:any){
        let temp = this.props.isSelect;
        this.props.isSelect = !temp;
        notify(event.node,"ev-changeSelect",{key : this.props});
        this.paint();
    }
    
}

