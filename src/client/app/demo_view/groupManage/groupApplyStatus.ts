/**
 * 入群申请验证状态
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
import { UserArray } from "../../../../server/data/rpc/basic.s"
import { Json } from "../../../../pi/lang/type";
import { GroupAgree } from "../../../../server/data/rpc/group.s";
import { clientRpcFunc } from "../../net/init";
import { acceptUser } from "../../../../server/data/rpc/group.p";
import * as store from "../../data/store";
import { GroupInfo } from "../../../../server/data/db/group.s";

declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class GroupApplyStatus extends Widget {
    public ok:() => void;
    public props : Props = {
        gid:null,
        applyUser:[],
    }
    public setProps(props,oldProps){
        super.setProps(props,oldProps);
        this.props.applyUser = props.applyUser;
        // this.props.applyUserList = [{
        //     avatorPath : "emoji.png",
        //     userName : "好友用户名",
        //     applyInfo : "填写验证信息",
        //     isAgree : true
        // },
        // {
        //     avatorPath : "emoji.png",
        //     userName : "好友用户名",
        //     applyInfo : "填写验证信息",
        //     isAgree : true
        // },
        // {
        //     avatorPath : "emoji.png",
        //     userName : "好友用户名",
        //     applyInfo : "填写验证信息",
        //     isAgree : false
        // }];
    }
    public goBack(){
        this.ok();
    }
    // 同意入群申请
    public agreeJoinGroup(e){
        const uid = parseInt(e.value,10);
        const gid = this.props.gid;
        const agree = new GroupAgree();
        agree.gid = gid;
        agree.uid = uid;
        agree.agree = true;
        console.log("==========agreeJoinGroup agree",agree)
        clientRpcFunc(acceptUser,agree,(r)=>{
            console.log("==========agreeJoinGroup result",r)
        })
    }
}

// ================================================ 本地
interface ApplyUserList{
    avatorPath : string;// 头像
    userName : string;//用户名
    applyInfo : string; // 其他
    isAgree: boolean;//是否已同意
}
interface Props {
    gid:number;
    applyUser:Json;
    // applyUserList : ApplyUserList[];
}
store.register('groupInfoMap', (r: Map<number, GroupInfo>) => {
    console.log("==========agreeJoinGroup value ggggggg",r)
    for (const value of r.values()) {
        console.log("==========agreeJoinGroup value",value)
        forelet.paint(value);
    }    
});
