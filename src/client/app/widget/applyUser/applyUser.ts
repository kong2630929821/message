/*
** applyUser 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"
import { popNew } from "../../../../pi/ui/root";

interface Props{
    uid:number;//id
    avatorPath : string;// 头像
    userName : string;//用户名
    applyInfo : string; // 其他
}

// ===========================导出
export class applyUser extends Widget{
        props:Props = {
            uid:null,
            avatorPath : "emoji.png",
            userName : "好友用户名",
            applyInfo : "填写验证信息",
        }
        setProps(props:any){
            this.props = props;
        }
        // 查看申请详细信息 
        viewApplyDetail(uid:number){
            popNew("client-app-view-addUser-newFriendApply",{'uid':uid});
        }
}

