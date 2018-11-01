/*
** applyUser 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"

interface ApplyUserList{
    avatorPath : string;// 头像
    userName : string;//用户名
    applyInfo : string; // 其他
    isAgree: boolean;//是否已同意
}
interface Props{
    applyUserList : ApplyUserList[];
}

// ===========================导出
export class UserEdit extends Widget{
    public props : Props;
    constructor(){
        super();
        this.props = {
            applyUserList : [{
                avatorPath : "emoji.png",
                userName : "好友用户名",
                applyInfo : "填写验证信息",
                isAgree : true
            },
            {
                avatorPath : "emoji.png",
                userName : "好友用户名",
                applyInfo : "填写验证信息",
                isAgree : true
            },
            {
                avatorPath : "emoji.png",
                userName : "好友用户名",
                applyInfo : "填写验证信息",
                isAgree : false
            }]
            
        };
    }
    
}

