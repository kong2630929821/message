/**
 * 单人聊天
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
import { sendMessage } from '../../net/rpc';
import { subscribe as subscribeMsg} from "../../net/init";
import { UserArray } from "../../../../server/data/rpc/basic.s"
import { UserHistory, UserMsg } from "../../../../server/data/db/message.s";

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class SingleChat extends Widget {
    props:Props = {
        sid:null,
        rid:null,
        message:"",
        friendName:"",
        isLogin:true
    }
    public setProps(props,oldProps){
        super.setProps(props,oldProps);
        this.props = props;            
    }
    HandleOnInput(e){
        console.log("HandleOnInput",e.message)
        this.props.message = e.message;
    }
     // 订阅消息主题 别人发消息可以收到
    //  subscribeMsg(this.props.sid.toString(),UserMsg,(r:UserMsg) => {
    //     console.log("========别人发给我的消息",r)
    // });

    // 发送消息
    send(){
        sendMessage(this.props.rid,this.props.message,(r:UserHistory) => {
            console.log("=========message",r)
        })
    }
}

// ================================================ 本地
interface Props {
    sid:number,
    rid:number,
    message:string,
    friendName: string,
    isLogin:boolean
}
