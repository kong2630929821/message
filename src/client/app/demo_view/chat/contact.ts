/**
 * 登录
 */

// ================================================ 导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import * as store from '../../data/store';
// ================================================ 导出
export const forelet = new Forelet();
export class Contact extends Widget {
    public props:Props;

    public setProps(props:Json) {
        super.setProps(props);
        this.props.messageList = [];
        this.props.isUtilVisible = false;
        this.props.utilList = [
                { iconPath:'search.png',utilText:'搜索' },
                { iconPath:'adress-book.png',utilText:'通讯录' },
                { iconPath:'add-friend.png',utilText:'添加好友' },
                { iconPath:'group-chat.png',utilText:'创建群聊' },
                { iconPath:'scan.png',utilText:'扫一扫' }
        ];
    }

    public chat(uid:number) {
        popNew('client-app-demo_view-chat-chat', { rid:uid });
    }

    public openAddUser() {
        popNew('client-app-demo_view-chat-addUser', { sid: this.props.sid });
    }

    // 打开更多功能
    public getMore() {
        this.props.isUtilVisible = !this.props.isUtilVisible;
        this.paint();
    }

    public closeMore() {
        this.props.isUtilVisible = false;
        this.paint();
    }

    public handleFatherTap(e:any) {
        // 如果点击的是通讯录
        if (e.index === 1) {
            popNew('client-app-demo_view-contactList-contactList',{ sid : this.props.sid });
        }
        // 如果点击的是添加好友
        if (e.index === 2) {
            this.openAddUser();
        }
    }
}

store.register(`lastChat`,(r:[number,number][]) => {    
    forelet.paint(r);
});

// ================================================ 本地
interface Props {
    sid: number;
    messageList:any[];
    isUtilVisible:boolean;
    utilList:any[];
}
