/**
 * 最新公告组件
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
export class LatestAnnounce extends Widget {
    public setProps(props,oldProps){
        super.setProps(props,oldProps);     
    }
    props:Props = {
        announceContent:"最新公告内容",
    }
    removeAnnounce(){
        console.log("removeAnnounce")
    }
}

// ================================================ 本地
interface Props {
    announceContent: string,
}
