/*
** groupSetItem 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"

interface GroupSet{
    title:string;// 标题
    content:string;//说明内容
}

interface Props{
    groupSetList : GroupSet[];
}


// ===========================导出
export class ManageItem extends Widget{
    public props : Props;
    constructor(){
        super();
        this.props = {
            groupSetList : [
                {
                    title : "设置管理员",
                    content : "关闭后，群成员将不能邀请好友加群"
                },
                {
                    title : "转让管理员",
                    content : "关闭后，群成员将不能邀请好友加群"
                }
            ]
           
        };
    }
    
}

