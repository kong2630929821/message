/**
 * 新朋友验证信息
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
import { getUsersBasicInfo, acceptFriend } from "../../../app/net/rpc"
import { Result, UserArray } from "../../../../server/data/rpc/basic.s"


declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class NewFriendApply extends Widget {
    props = {
        uid:null,
        applyInfo: ""
    } as Props

    setProps(props:any){
        this.props = props;
    }
    // 点击拒绝添加好友
    reject(uid:number){
        console.log("reject")
        acceptFriend(uid,false,(r:Result)=>{
            //TODO:
        })
    }

    // 点击同意添加好友
    agree(uid:number){
        console.log("agree")
        acceptFriend(uid,true,(r:Result)=>{
            //TODO:
        })
        // popNew("client-app-view-addUser-newFriend",{});
    }
    
}

// ================================================ 本地

interface Props {
    uid:number,
    applyInfo: string
}
