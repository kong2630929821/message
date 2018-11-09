/**
 * 添加好友
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

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class AddUser extends Widget {
    props = {
        sid: null,
        rid: null
    } as Props

    setProps(props:any){
        this.props = props;
    }
    // 要添加的好友的id
    inputUid(e){
        this.props.rid = parseInt(e.value);
    }
    // 跳转到该陌生人个人信息页面
    openStrangerInfo(){
        console.log("openStrangerInfo")
        popNew("client-app-view-strangerInfo-strangerInfo",{"rid":this.props.rid})
    }
}

// ================================================ 本地

interface Props {
    sid: number,
    rid: number
}

