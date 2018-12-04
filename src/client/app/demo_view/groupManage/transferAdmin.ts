/**
 * 转让群主
 */

 // ================================================ 导入
 import {Widget} from "../../../../pi/widget/widget";
 import {Forelet} from "../../../../pi/widget/forelet";
 import {popNew} from "../../../../pi/ui/root";
 import { login as userLogin} from '../../net/rpc';
 import {UserInfo} from "../../../../server/data/db/user.s";
 import { Logger } from '../../../../utils/logger';
import * as store from "../../data/store";
import { GroupInfo } from "../../../../server/data/db/group.s";
import { Json } from "../../../../pi/lang/type";

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
export const forelet = new Forelet();
const logger = new Logger(WIDGET_NAME);

 // ================================================ 导出
 export class TransferGroupOwner extends Widget {
    public ok:() => void;
    public props:Props ={
        gid:null,
        ginfo:{}
    }
     setProps(props){
        console.log("setProps",props)
        super.setProps(props);
        this.props.gid = props.gid;
        this.props.ginfo = this.getGroupInfo(this.props.gid);
        //modify props
        // this.props.userList = [
        //     {avatorPath:"user.png",text:"用户名"},
        //     {avatorPath:"user.png",text:"用户名"},
        //     {avatorPath:"user.png",text:"用户名"},
        //     {avatorPath:"user.png",text:"用户名"}
        // ];
        // this.props.modalObj = {content:"'赵铁柱'将成为新群主，确认后您将你失去群主身份。",sureText:"确定",cancelText:"取消",style:"color:#F7931A"};
        // this.props.sid = 10000;
     }
     public goBack(){
        this.ok();
    } 
    getGroupInfo(gid:number){
        const ginfo = store.getStore(`groupInfoMap/${gid}`);
        console.log("============ginfo",ginfo)
        return ginfo;
    }
     openConfirmTranBox(uid:number){
         console.log("openConfirmTranBox")
         let modalObj = {content:`"${uid}"将成为新群主，确认后您将你失去群主身份。`,sureText:"确定",cancelText:"取消",style:"color:#F7931A"};
         let guid = `${this.props.gid}:${uid}`;
         popNew("client-app-widget-modalBox-modalBox",{...modalObj,guid:guid,topic:"transOwner"});
         this.paint();
     }
 }

 // ================================================ 本地
 interface UserList {
    avatorPath: string;// 头像
    text: string;//文本
}
 interface Props {
     gid:number,
     ginfo:Json
    //  userList: UserList[] 
 }
