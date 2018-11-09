/*
** groupManage
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"
import {popNew} from "../../../../pi/ui/root";

interface Manage{
    title:string;// 标题
    quantity?:string;//数量
}

interface GroupSet{
    title:string;// 标题
    content:string;//说明内容
}

interface Props{
    manageList : Manage[];
    groupSetList : GroupSet[];
}


// ===========================导出
export class ManageItem extends Widget{
    public setProps(props,oldProps){
        super.setProps(props,oldProps);
        this.props.manageList = [
            {title : "设置管理员", quantity : "2/5"},
            {title : "转让管理员",quantity : ""},
            {title : "入群申请",quantity : "15"}];

        this.props.groupSetList = [
            {title : "允许群成员邀请入群",content : "关闭后，群成员不能邀请好友加群"},
            {title : "开启进群审核",content : "关闭后，进群不需要经过群主或管理员审核"}];
        this.props.destroyGroupModalObj = {content:"解散后，所有成员将被清出，该群将不存在。",sureText:"确定",cancelText:"取消",style:"color:#F7931A"}
    }   
    // 解散群
    destroyGroup(){
        popNew("client-app-widget-modalBox-modalBox",this.props.destroyGroupModalObj);
    } 
}

