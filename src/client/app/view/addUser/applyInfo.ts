/**
 * 好友验证信息
 */

// ================================================ 导入
import { Widget } from "../../../../pi/widget/widget";
import { Forelet } from "../../../../pi/widget/forelet";
import { popNew } from "../../../../pi/ui/root";
import { applyFriend as applyUserFriend } from '../../net/rpc';
import { UserInfo } from "../../../../server/data/db/user.s";
import { Logger } from '../../../../utils/logger';
import { factorial } from "../../../../pi/util/math";
import { create } from "../../../../pi/net/rpc";
import { getUserInfo } from "../../../app/net/rpc"
import { Result } from "../../../../server/data/rpc/basic.s"

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class ApplyInfo extends Widget {
    props = {
        rid:null,
        applyInfo: "",
        value:""
    } as Props
    setProps(props:any){
        console.log("===ggg===",props)
        this.props = props;
        console.log("===hhh===", this.props)
    }
    // 获取输入的验证信息
    change(e){
        this.props.applyInfo = e.value;
    }
    // 点击申请加好友
    applyFriend(){
        applyUserFriend(this.props.rid,(r:Result)=>{
            console.log("====applyFriend===",r)
        })
    }
    // 点击跳转 验证消息界面
    // referApplyInfo(){
    //     console.log("===referApplyInfo")
    //     popNew("client-app-view-addUser-newFriendApply",{"applyInfo":this.props.applyInfo});
    // }
    
}

// ================================================ 本地

interface Props {
    rid:number;
    applyInfo: string;
    value:string;
}
