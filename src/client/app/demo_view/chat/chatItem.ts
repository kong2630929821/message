/**
 * 登录
 */

// ================================================ 导入
import { Widget } from "../../../../pi/widget/widget";
import { UserHistory, UserMsg } from "../../../../server/data/db/message.s";
import * as store from "../../data/store"
// ================================================ 导出
export class Chat extends Widget {
    props = {
        hIncid: "",
        msg: undefined
    } as UserHistory

    setProps(props){
        super.setProps(props)
        this.props.msg = store.getStore(`userHistoryMap/${this.props.hIncid}`);
    }
}

// ================================================ 本地