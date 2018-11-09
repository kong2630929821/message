/**
 * 群组成员
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
export class GroupMember extends Widget {
    public setProps(props,oldProps){
        super.setProps(props,oldProps); 
        this.props.memberList = [
            {avatorPath:"user.png",text:"赵铁柱",isOrdinary:true},
            {avatorPath:"user.png",text:"赵铁柱",isOrdinary:true},
            {avatorPath:"user.png",text:"赵铁柱",isOrdinary:true},
            {avatorPath:"user.png",text:"赵铁柱",isOrdinary:true},
            {avatorPath:"user.png",text:"赵铁柱",isOrdinary:true},
            {avatorPath:"user.png",text:"赵铁柱",isOrdinary:true},
            {avatorPath:"user.png",text:"赵铁柱",isOrdinary:true},
            {avatorPath:"user.png",text:"赵铁柱",isOrdinary:false,isOwner:true},
            {avatorPath:"user.png",text:"赵铁柱",isOrdinary:true},
            {avatorPath:"user.png",text:"赵铁柱",isOrdinary:true},
            {avatorPath:"user.png",text:"赵铁柱",isOrdinary:false,isOwner:false},
            {avatorPath:"user.png",text:"赵铁柱",isOrdinary:true}
        ]    
    }
    // props:Props = {
    //     avatorPath:"user.png",
    //     text:"成员名",
    //     isOrdinary:true
    // }
}

// ================================================ 本地
interface MemberList{
    avatorPath:string,
    text:string,
    isOrdinary:boolean,
    isOwner:boolean
}
interface Props {
    memberList:MemberList[],
}
