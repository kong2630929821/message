/**
 * 联系人详细信息
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
import { getUsersBasicInfo } from "../../../app/net/rpc"
import { UserArray } from "../../../../server/data/rpc/basic.s"

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class ContactorInfo extends Widget {
    props = {
        uid:null,
        isContactorOpVisible:false,
        isModalBoxVisible:false,
        utilList:[],
        modalArr:[],
        userInfo:{}
    } as Props

    public setProps(props,oldProps){
        console.log("setProps")
        super.setProps(props,oldProps);
        this.props =props; 
        this.props.userInfo = {};
        this.props.utilList = [
            {utilText:"发送名片"},
            {utilText:"删除聊天记录"},
            {utilText:"加入黑名单"},
            {utilText:"删除"}
        ];
        this.props.modalArr = [
            {title:"清空聊天记录",content:"确定清空和赵铁柱的聊天记录吗",sureText:"确定",cancelText:"取消"},
            {title:"加入黑名单",content:"加入黑名单，您不再收到对方的消息。",sureText:"确定",cancelText:"取消"},
            {title:"删除联系人",content:"将联系人'赵铁柱'删除，同时删除聊天记录",sureText:"删除",cancelText:"取消"}];
        this.props.isContactorOpVisible = false;
        this.props.isModalBoxVisible = false;
        // this.props = {
        //     rid: null,
        //     isContactorOpVisible:false,
        //     utilList:[
        //         {utilText:"发送名片"},
        //         {utilText:"删除聊天记录"},
        //         {utilText:"加入黑名单"},
        //         {utilText:"删除"}
        //     ]
        // }
        this.getContactorInfo();
    }
    
    create(){
        console.log("====初始化数据===",this.props);
    }
    // 获取联系人信息
    public getContactorInfo(){
        let uids:Array<number> = [this.props.uid];
        getUsersBasicInfo(uids,(r:UserArray) => {
            console.log("===联系人信息===",r)
            this.props.userInfo = r.arr[0];
            this.paint();                    
        })
    }

    // 点击...展开联系人操作列表
    handleMoreContactor(){
        console.log("handleMoreContactor")
        let temp = !this.props.isContactorOpVisible;
        this.props.isContactorOpVisible = temp;
        this.paint();
    }
    // 开始对话
    startDialog(){
        console.log("startDialog");
        popNew("client-app-view-chat-chat",{"rid":this.props.uid});
    }  
    // 点击联系人操作列表项
    handleFatherTap(e){
        console.log("handleFatherTap")
        this.props.isContactorOpVisible = false;
        if(e.index === 1){ // 清空聊天记录
            popNew("client-app-widget-modalBox-modalBox",this.props.modalArr[0])       
        }
        if(e.index === 2){ // 加入黑名单
            popNew("client-app-widget-modalBox-modalBox",this.props.modalArr[1])
        }
        if(e.index === 3){ // 删除联系人
            popNew("client-app-widget-modalBox-modalBox",this.props.modalArr[2])
        }
        this.paint();
    }
}

// ================================================ 本地

interface Props {
    uid: number,
    isContactorOpVisible:boolean,
    isModalBoxVisible:boolean,
    utilList:Object,
    modalArr:Object,
    userInfo:Object
}
