/**
 * 陌生人详细信息
 */

// ================================================ 导入
import { Widget } from "../../../../pi/widget/widget";
import { Forelet } from "../../../../pi/widget/forelet";
import { popNew } from "../../../../pi/ui/root";
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
export class StrangerInfo extends Widget {
    props = {
        rid: null,
        userInfo:{}
    } as Props

    setProps(props,oldProps){
        super.setProps(props,oldProps);
        this.props = props;
        console.log("========陌生人信息页面",this.props)
    }

    attach(){
        console.log("===attach===",this.props.rid)
        let uidsArr:Array<number> = [this.props.rid];
        getUsersBasicInfo(uidsArr,(r:UserArray) => {
            console.log("===陌生人信息===",r)
            this.props.userInfo = r.arr[0];
        })
    }
    
    // 点击添加好友 进入发送验证消息界面
    openApplyInfo(){
        console.log("openApplyInfo")
        popNew("client-app-view-addUser-applyInfo",{"rid":this.props.rid});
    }
    
}

// ================================================ 本地

interface Props {
    rid: number,
    userInfo:object
}
