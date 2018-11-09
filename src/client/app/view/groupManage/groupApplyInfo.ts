/**
 * 入群验证信息
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
export class GroupApplyInfo extends Widget {
    props = {
        applyInfo: "该用户填写的入群申请该用户填写的入群申请该用户填写"
    } as Props
    
    // 点击拒绝添加好友
    reject(){
        console.log("reject")
    }

    // 点击同意添加好友
    agree(){
        console.log("agree")
        popNew("client-app-view-addUser-newFriend",{"sid" : 10001});
    }
    
}

// ================================================ 本地

interface Props {
    applyInfo: string
}
