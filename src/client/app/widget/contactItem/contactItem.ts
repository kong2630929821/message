/*
** contactItem 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"
import { notify } from "../../../../pi/widget/event"
import { popNew } from "../../../../pi/ui/root";

interface Props{
    uid:number;
    avatorPath : string;// 头像
    text : string;//文本
    totalNew?: number;//多少条
}


// ===========================导出
export class ContactItem extends Widget{
    props : Props = {
        uid:null,
        avatorPath : "",// 头像
        text : "",//文本
        totalNew: null//多少条   
    };
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props, oldProps);
        this.props = props;
        // this.props = {
            
        //     avatorPath : "emoji.png",
        //     text : "Evan Wood",
        //     totalNew : 17
        // };
    }
    // 跳转至新的朋友验证消息界面
    toNewFriend(e){
        console.log("========1")
        notify(e.node,"ev-toNewFriend",{});
    }
    // 跳转至联系人详细信息页面
    toContactorInfo(){
        console.log("======跳转至联系人详细信息页面")
        popNew("client-app-view-contactorInfo-contactorInfo",{"uid" : this.props.uid});
    }
    // 转让管理员
    transferAdmin(e){
        console.log("========2")
        notify(e.node,"ev-transferAdmin",{});
    }
}

