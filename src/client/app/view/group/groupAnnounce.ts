/**
 * 群公告
 */

// ================================================ 导入
import { Widget } from "../../../../pi/widget/widget";
import { Forelet } from "../../../../pi/widget/forelet";
import { popNew } from "../../../../pi/ui/root";
import { Logger } from '../../../../utils/logger';
import { factorial } from "../../../../pi/util/math";


declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class GroupAnnounce extends Widget {
    public setProps(props,oldProps){
        super.setProps(props,oldProps); 
        this.props.announceList = [
            {title:"公告标题",timeStamp:"8月3号 14：00"},
            {title:"公告标题",timeStamp:"8月3号 14：00"},
            {title:"公告标题",timeStamp:"8月3号 14：00"},
            {title:"公告标题",timeStamp:"8月3号 14：00"},
        ]    
    }
    // props:Props = {
    //     avatorPath:"user.png",
    //     text:"成员名",
    //     isOrdinary:true
    // }
}

// ================================================ 本地
interface AnnounceList{
    title:string,
    timeStamp:string
}
interface Props {
    announceList:AnnounceList[],
}
