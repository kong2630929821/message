/*
** groupManage
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"
import {popNew} from "../../../../pi/ui/root";
import { Json } from "../../../../pi/lang/type";
import { GetGroupInfoReq } from "../../../../server/data/rpc/basic.s";
import { clientRpcFunc } from "../../net/init";
import { getGroupsInfo } from "../../../../server/data/rpc/basic.p";
import * as store from "../../data/store";




// ===========================导出
export class ManageItem extends Widget{
    public ok:() => void;
    public props:Props ={
        gid : null,
        groupInfo:{},
        manageList: [],
        groupSetList:[],
        destroyGroupModalObj:{}
    }
    public setProps(props,oldProps){
        super.setProps(props,oldProps);
        this.props.groupInfo = props.groupInfo;
        this.props.gid = props.groupInfo.gid;
        this.props.manageList = [
            {title : "设置管理员", quantity : "2/5"},
            {title : "转让群主",quantity : ""},
            {title : "入群申请",quantity : `${this.props.groupInfo.applyUser.length}`}];

        this.props.groupSetList = [
            {title : "允许群成员邀请入群",content : "关闭后，群成员不能邀请好友加群"},
            {title : "开启进群审核",content : "关闭后，进群不需要经过群主或管理员审核"}];
        this.props.destroyGroupModalObj = {content:"解散后，所有成员将被清出，该群将不存在。",sureText:"确定",cancelText:"取消",style:"color:#F7931A"}
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
    // 打开群管理项
    openManageItem(e){
        const ownerid = this.props.groupInfo.ownerid;
        const uid = store.getStore('uid');
        console.log("==============openManageItem",e.value);
        if(ownerid === uid && e.value === 0){ // 设置管理员
            popNew("client-app-demo_view-groupManage-setupAdmin",{gid:this.props.gid});
        }
        if(ownerid === uid && e.value === 1){ // 转让群主
            popNew("client-app-demo_view-groupManage-transferAdmin",{gid:this.props.gid});
        }
        if(e.value === 2){ // 入群申请
            popNew("client-app-demo_view-groupManage-groupApplyStatus",{gid:this.props.gid, applyUser:this.props.groupInfo.applyUser});
        }
    }
    // 解散群
    destroyGroup(){
        const ownerid = this.props.groupInfo.ownerid;
        const uid = store.getStore('uid');
        if(ownerid === uid){
            popNew("client-app-widget-modalBox-modalBox",{...this.props.destroyGroupModalObj, gid:this.props.gid, topic:"dissolveGroup"});
        }
    } 
}

// ================================================ 本地
interface Manage{
    title:string;// 标题
    quantity?:string;//数量
}

interface GroupSet{
    title:string;// 标题
    content:string;//说明内容
}

interface Props{
    gid:number;
    groupInfo:Json;
    manageList : Manage[];
    groupSetList : GroupSet[];
    destroyGroupModalObj:Json
}
