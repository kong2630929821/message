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
        rid:-1,
        lastMessage: undefined
    } as Props

    setProps(props){
        super.setProps(props)
        let sid = store.getStore(`uid`);
        let friendLink = store.getStore(`friendLinkMap/${sid}:${this.props.rid}`)
        let hid = friendLink.number;
        let hIncIdArr = store.getStore(`userChatMap/${hid}`);
        let hincId = hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
        this.props.lastMessage = hincId ? store.getStore(`userHistoryMap/${hincId}`) : "没有最新消息";
    }
}

// ================================================ 本地

interface Props {
    rid:number,
    lastMessage:UserHistory
}