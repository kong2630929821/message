/**
 * 群公告详细
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
export class AnnounceDetail extends Widget {
    public setProps(props,oldProps){
        super.setProps(props,oldProps);  
    }
    // props:Props = {
    //     avatorPath:"user.png",
    //     text:"成员名",
    //     isOrdinary:true
    // }
    // 完成公告编辑
    completeEdit(){
        console.log("completeEdit")
    }
}

// ================================================ 本地
interface Props {
    
}
