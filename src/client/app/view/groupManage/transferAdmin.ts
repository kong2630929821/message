/**
 * 转让管理员
 */

 // ================================================ 导入
 import {Widget} from "../../../../pi/widget/widget";
 import {Forelet} from "../../../../pi/widget/forelet";
 import {popNew} from "../../../../pi/ui/root";
 import { login as userLogin} from '../../net/rpc';
 import {UserInfo} from "../../../../server/data/db/user.s";
 import { Logger } from '../../../../utils/logger';

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

 // ================================================ 导出
 export class TransferAdmin extends Widget {
     setProps(props,oldProps){
        console.log("setProps",props)
        super.setProps(props,oldProps);
        //modify props
        this.props.userList = [
            {avatorPath:"user.png",text:"用户名"},
            {avatorPath:"user.png",text:"用户名"},
            {avatorPath:"user.png",text:"用户名"},
            {avatorPath:"user.png",text:"用户名"}
        ];
        this.props.modalObj = {content:"'赵铁柱'将成为新群主，确认后您将你失去群主身份。",sureText:"确定",cancelText:"取消",style:"color:#F7931A"};
        // this.props.sid = 10000;
     }
     openConfirmTranBox(){
         console.log("openConfirmTranBox")
         popNew("client-app-widget-modalBox-modalBox",this.props.modalObj);
         this.paint();
     }
 }

 // ================================================ 本地
 interface UserList {
    avatorPath: string;// 头像
    text: string;//文本
}
 interface Props {
     sid:number,
     userList: UserList[] 
 }