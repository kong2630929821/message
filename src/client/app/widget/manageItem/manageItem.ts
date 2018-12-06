/*
** manageItem 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"
import { notify } from "../../../../pi/widget/event";

interface Manage{
    title:string;// 标题
    quantity?:string;//数量
}

interface Props{
    manageList : Manage[];
}


// ===========================导出
export class ManageItem extends Widget{
    public props : Props;
    constructor(){
        super();
        this.props = {
            manageList : [
                {
                    title : "设置管理员",
                    quantity : "2/5"
                },
                {
                    title : "转让管理员",
                    quantity : ""
                },
                {
                    title : "待审核",
                    quantity : "15"
                }
            
            ]
           
        };
    }

    public openManageItem(e,index){
        notify(e.node,"ev-openManageItem",{value : index});
    }
    
}

