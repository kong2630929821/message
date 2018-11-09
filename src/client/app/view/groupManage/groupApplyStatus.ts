/**
 * 入群申请验证状态
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
export class GroupApplyStatus extends Widget {
    public setProps(props,oldProps){
        super.setProps(props,oldProps);
        this.props.applyUserList = [{
            avatorPath : "emoji.png",
            userName : "好友用户名",
            applyInfo : "填写验证信息",
            isAgree : true
        },
        {
            avatorPath : "emoji.png",
            userName : "好友用户名",
            applyInfo : "填写验证信息",
            isAgree : true
        },
        {
            avatorPath : "emoji.png",
            userName : "好友用户名",
            applyInfo : "填写验证信息",
            isAgree : false
        }];
    }
}

// ================================================ 本地
interface ApplyUserList{
    avatorPath : string;// 头像
    userName : string;//用户名
    applyInfo : string; // 其他
    isAgree: boolean;//是否已同意
}
interface Props {
    sid: number,
    applyUserList : ApplyUserList[];
}
