/**
 * 添加管理员
 */

 // ================================================ 导入
 import {Widget} from "../../../../pi/widget/widget";
 import {Forelet} from "../../../../pi/widget/forelet";
 import {popNew} from "../../../../pi/ui/root";
 import { login as userLogin} from '../../net/rpc';
 import { Logger } from '../../../../utils/logger';
import { Json } from "../../../../pi/lang/type";
import * as store from "../../data/store";
import { delValueFromArray } from "../../../../utils/util";
import { clientRpcFunc } from "../../net/init";
import { addAdmin } from "../../../../server/data/rpc/group.p";
import { GuidsAdminArray } from "../../../../server/data/rpc/group.s";

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

 // ================================================ 导出
 export class AddAdmin extends Widget {
    public ok:() => void;
    public props:Props ={
        gid:null,
        ginfo:{},
        applyAdminMembers:[]
    }
    public setProps(props){
        super.setProps(props);
        this.props.gid = props.gid;
        this.props.ginfo = this.getGroupInfo(this.props.gid);
        this.props.applyAdminMembers = [];
        //modify props
        // this.props.userList = [
        //     {avatorPath:"user.png",userName:"用户名",isSelect : false},
        //     {avatorPath:"user.png",userName:"用户名",isSelect : false},
        //     {avatorPath:"user.png",userName:"用户名",isSelect : false},
        //     {avatorPath:"user.png",userName:"用户名",isSelect : false}
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
    // 添加管理员
    public addAdminMember(uid:number) {
        if (this.props.applyAdminMembers.findIndex(item => item === uid) === -1) {
            this.props.applyAdminMembers.push(uid);
        } else {
            this.props.applyAdminMembers = delValueFromArray(uid, this.props.applyAdminMembers);
        }
        console.log(`applyAdminMembers is : ${JSON.stringify(this.props.applyAdminMembers)}`);
    }
    // 点击添加
    public completeAddAdmin(){
        if(this.props.applyAdminMembers.length <= 0){
            return ;
        }
        const guidsAdmin = new GuidsAdminArray();
        const guids = this.props.applyAdminMembers.map(item => {
            return `${this.props.gid}:${item}`;
        })
        console.log("===============",guids,typeof guids);
        guidsAdmin.guids = guids;
        clientRpcFunc(addAdmin,guidsAdmin,(r) => {
            console.log("=============completeAddAdmin",r)
        })
    }
 }

 // ================================================ 本地
 interface UserList {
    avatorPath: string;// 头像
    text: string;//文本
}
 interface Props {
     gid:number,
     ginfo:Json,
     applyAdminMembers:number[]
    //  userList: UserList[] 
 }