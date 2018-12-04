/**
 * 设置管理员
 */

 // ================================================ 导入
 import {Widget} from "../../../../pi/widget/widget";
 import {Forelet} from "../../../../pi/widget/forelet";
 import {popNew} from "../../../../pi/ui/root";
 import { login as userLogin} from '../../net/rpc';
 import {UserInfo} from "../../../../server/data/db/user.s";
 import { Logger } from '../../../../utils/logger';
import * as store from "../../data/store";
import { Json } from "../../../../pi/lang/type";

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

 // ================================================ 导出
 export class SetupAdmin extends Widget {
    public ok:() => void;
    public props:Props ={
        gid:null,
        ginfo:{}
    }
    public setProps(props){
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
        // this.props.sid = 10000;
     }
    public goBack(){
        this.ok();
    }
    public getGroupInfo(gid:number){
        const ginfo = store.getStore(`groupInfoMap/${gid}`);
        console.log("============ginfo",ginfo)
        return ginfo;
    }
    // 打开添加管理员页面
    public openAddAdmin(){
        popNew("client-app-demo_view-groupManage-addAdmin",{gid:this.props.gid});
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