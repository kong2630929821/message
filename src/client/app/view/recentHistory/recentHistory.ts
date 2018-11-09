/**
 * 最近历史消息记录
 */

// ================================================ 导入
import { Widget } from "../../../../pi/widget/widget";
import { Forelet } from "../../../../pi/widget/forelet";
import { open } from "../../../../pi/ui/root";
import { login as userLogin } from '../../net/rpc';
import { UserInfo } from "../../../../server/data/db/user.s";
import { Logger } from '../../../../utils/logger';
import { factorial } from "../../../../pi/util/math";

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class RecentHistory extends Widget {
    /**
     * setProps
     */
    // props:Props={
    //     messageList:[
    //         { avatorPath: "user.png", isGroupMessage: true, name: "小天", recordInfo: "给我发个红包看看", recordTime: "18:38", isNotDisturb: true, unReadCount: 0 },
    //         { avatorPath: "user.png", isGroupMessage: true, name: "小天", recordInfo: "给我发个红包看看", recordTime: "18:38", isNotDisturb: true, unReadCount: 27 },
    //         { avatorPath: "user.png", isGroupMessage: false, name: "小天", recordInfo: "给我发个红包看看", recordTime: "18:38", isNotDisturb: true, unReadCount: 27 },
    //         { avatorPath: "user.png", isGroupMessage: true, name: "小天", recordInfo: "给我发个红包看看", recordTime: "18:38", isNotDisturb: false, unReadCount: 27 },
    //         { avatorPath: "user.png", isGroupMessage: true, name: "小天", recordInfo: "给我发个红包看看", recordTime: "18:38", isNotDisturb: true, unReadCount: 27 },
    //         { avatorPath: "user.png", isGroupMessage: false, name: "小天", recordInfo: "给我发个红包看看", recordTime: "18:38", isNotDisturb: false, unReadCount: 27 },
    //         { avatorPath: "user.png", isGroupMessage: true, name: "小天", recordInfo: "给我发个红包看看", recordTime: "18:38", isNotDisturb: true, unReadCount: 27 }],
    //     isUtilVisible: false
    // };

    // getMore() {
    //     console.log("getMore")
    //     let temp = !this.props.isUtilVisible;
    //     this.props.isUtilVisible = temp;
    //     this.paint();
    // }
    // 父组件接收子组件的传值
    handleFatherTap(e){
        if(e.index === 1){
            console.log("hhhh")
            open("client-app-view-contactList-contactList");
        }
        // switch(e.index){
        //     case 1 :
        //     {
        //         open("client-app-view-contactList-contactList");
        //         break;
        //     }
        //     case 2 :{
        //         open("client-app-view-contactList-contactList");
        //         break;
        //     }
        // }
    }
}

// ================================================ 本地
interface MessageList {
    avatorPath: string;// 头像
    isGroupMessage: boolean;// 标志来源是否是群消息
    name: string;//用户名或群名
    recordInfo: string; // 简短的消息记录
    recordTime: string;//消息记录时间
    isNotDisturb: boolean;//是否免打扰
    unReadCount: number;//未读条数
}
interface UtilList {
    iconPath?: string;// 头像
    utilText: string;//文本
}
interface Props {
    messageList: MessageList[],
    utilList:UtilList[],
    isUtilVisible: boolean// 操作列表是否可见
}

register("userChatMap",()=>{

})

register("lastChat",()=>{

})
