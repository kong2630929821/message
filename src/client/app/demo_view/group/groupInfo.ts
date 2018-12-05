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
import { UserArray, GetGroupInfoReq, GroupArray } from "../../../../server/data/rpc/basic.s"
import { getGroupsInfo } from "../../../../server/data/rpc/basic.p";
import { clientRpcFunc } from "../../net/init";
import { getStore } from "../../data/store";
import { GroupInfo } from "../../../../server/data/db/group.s";
import { Json } from "../../../../pi/lang/type";

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class GroupInfos extends Widget {
    public ok:() => void;
    public props : Props = {
        gid:null,
        groupInfo:{},
        isGroupOpVisible:false,
        utilList:[],
        modalArr:[]
    }
    public setProps(props,oldProps){
        super.setProps(props,oldProps);
        this.props.gid = props.gid;
        this.props.groupInfo = {};
        this.props.utilList = [
            {utilText : "发送名片"},
            {utilText : "清空聊天记录"},
            {utilText : "删除"}];
        this.props.isGroupOpVisible = false;
        this.props.modalArr = [
            {title:"清空聊天记录",content:"确定清空聊天记录吗",sureText:"确定",cancelText:"取消"},
            {content:"删除后，将不再接受此群消息",sureText:"确定",cancelText:"取消",style:"color:#F7931A"}];
        this.getGroupInfo();
    }

    public goBack(){
        this.ok();
    }
    // 获取群组信息
    getGroupInfo(){
        const info = new GetGroupInfoReq();
        const gids:number[] = [this.props.gid];
        info.gids = gids;
        clientRpcFunc(getGroupsInfo,info,(r) => {
            console.log("======r",r)
            this.props.groupInfo = r.arr[0];
            this.paint();
        });
    }
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
            popNew("client-app-widget-modalBox-modalBox",{...this.props.modalArr[1],gid:this.props.gid, record :e.index})
        }
        this.paint();
    }
    deleteGroup(){
        console.log("=========deleteGroup")
    }
    // 打开群管理
    openGroupManage(){
        const ownerid = this.props.groupInfo.ownerid;
        const adminids = this.props.groupInfo.adminids;
        const uid = getStore('uid');
        console.log("============openGroupManage",ownerid,adminids,uid)
        if(ownerid === uid || adminids.indexOf(uid) > -1){
            popNew("client-app-demo_view-groupManage-groupManage",{"groupInfo" : this.props.groupInfo});
        }
    }
    // 打开群聊天
    openGroupChat(){
        popNew("client-app-demo_view-group-groupChat",{"gid" : this.props.gid});
    }
    
}

// ================================================ 本地
interface Util{
    iconPath ?: string; // 图标路径
    utilText : string; // 文本
}
interface Props {
    gid: number,
    groupInfo:Json,//群信息
    utilList:Util[], // 操作列表
    isGroupOpVisible:boolean,
    modalArr:Object
}
