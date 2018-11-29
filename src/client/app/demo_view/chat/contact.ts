/**
 * 登录
 */

// ================================================ 导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
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

    public chat(e:any, id:number, chatType:GENERATOR_TYPE) {
        if (chatType === GENERATOR_TYPE.USER) {
            popNew('client-app-demo_view-chat-chat', { rid:id });
        } else if (chatType === GENERATOR_TYPE.GROUP) {
            popNew('client-app-demo_view-chat-group', { gid:id });
        }
        
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
        switch (e.index) {
            case 0:// 搜索
            
                break;
            case 1:// 点击通讯录
                popNew('client-app-demo_view-contactList-contactList',{ sid : this.props.sid });
                break;
            case 2:// 点击添加好友
                this.openAddUser();
                break;
            case 3:// 创建群聊
                popNew('client-app-demo_view-group-create');
                break;
            case 4:// 扫一扫            
                break;

            default:
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
