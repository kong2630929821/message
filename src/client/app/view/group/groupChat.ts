/**
 * 群组聊天
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
import { getUserInfo } from "../../../app/net/rpc"
import { UserArray } from "../../../../server/data/rpc/basic.s"

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class GroupChat extends Widget {
    public setProps(props,oldProps){
        super.setProps(props,oldProps);
        this.props.groupName = "KuPay官方群(24)";
        this.props.isLogin = false;
            
    }
    props:Props = {
        rid:null,
        groupName:"KuPay官方群(24)",
        isLogin:true
    }
    create(){
        console.log("create",this.props)
    }
}

// ================================================ 本地
interface Props {
    rid:number,
    groupName: string,
    isLogin:boolean
}
