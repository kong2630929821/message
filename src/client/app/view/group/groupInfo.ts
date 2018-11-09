/**
 * 群信息
 */

// ================================================ 导入
import { Widget } from "../../../../pi/widget/widget";
import { Forelet } from "../../../../pi/widget/forelet";
import { popNew } from "../../../../pi/ui/root";
import { login as userLogin } from '../../net/rpc';
import { UserInfo } from "../../../../server/data/db/user.s";
import { Logger } from '../../../../utils/logger';
import { factorial } from "../../../../pi/util/math";
import { create } from "../../../../pi/net/rpc";
import { getUserInfo } from "../../../app/net/rpc"
import { UserArray } from "../../../../server/data/rpc/basic.s"

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class GroupInfo extends Widget {
    public setProps(props,oldProps){
        super.setProps(props,oldProps);
        this.props.utilList = [
            {utilText : "发送名片"},
            {utilText : "清空聊天记录"},
            {utilText : "删除"}];
        this.props.isGroupOpVisible = false;
        this.props.modalArr = [
            {title:"清空聊天记录",content:"确定清空聊天记录吗",sureText:"确定",cancelText:"取消"},
            {content:"删除后，将不再接受此群消息",sureText:"确定",cancelText:"取消",style:"color:#F7931A"}];
    }
    // props = {
    //     rid: null
    // } as Props

    // 群信息更多 
    handleMoreGroup(){
        let temp = !this.props.isGroupOpVisible;
        this.props.isGroupOpVisible = temp;
        this.paint();
    }
    // 点击群信息更多操作列表项
    handleFatherTap(e){
        this.props.isGroupOpVisible = false;
        if(e.index === 0){ // 发送名片
           
        }
        if(e.index === 1){ // 清空聊天记录
            popNew("client-app-widget-modalBox-modalBox",this.props.modalArr[0])
        }
        if(e.index === 2){ // 删除
            popNew("client-app-widget-modalBox-modalBox",this.props.modalArr[1])
        }
        this.paint();
    }
    
}

// ================================================ 本地
interface Util{
    iconPath ?: string; // 图标路径
    utilText : string; // 文本
}
interface Props {
    rid: number,
    utilList:Util[], // 操作列表
    isGroupOpVisible:boolean
}
