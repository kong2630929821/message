/**
 * 最近历史消息记录
 */

// ================================================ 导入
import { create } from '../../../../pi/net/rpc';
import { popNew } from '../../../../pi/ui/root';
import { factorial } from '../../../../pi/util/math';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { UserInfo } from '../../../../server/data/db/user.s';
import { Logger } from '../../../../utils/logger';
import { login as userLogin } from '../../net/rpc';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class RecentHistory extends Widget {
    /**
     * setProps
     */
    public setProps(props:JSON,oldProps:JSON) {
        super.setProps(props,oldProps);
        this.props.messageList = [
                { avatorPath: 'user.png', isGroupMessage: true, name: '小天', recordInfo: '给我发个红包看看', recordTime: '18:38', isNotDisturb: true, unReadCount: 0 },
                { avatorPath: 'user.png', isGroupMessage: true, name: '小天', recordInfo: '给我发个红包看看', recordTime: '18:38', isNotDisturb: true, unReadCount: 27 },
                { avatorPath: 'user.png', isGroupMessage: false, name: '小天', recordInfo: '给我发个红包看看', recordTime: '18:38', isNotDisturb: true, unReadCount: 27 },
                { avatorPath: 'user.png', isGroupMessage: true, name: '小天', recordInfo: '给我发个红包看看', recordTime: '18:38', isNotDisturb: false, unReadCount: 27 },
                { avatorPath: 'user.png', isGroupMessage: true, name: '小天', recordInfo: '给我发个红包看看', recordTime: '18:38', isNotDisturb: true, unReadCount: 27 },
                { avatorPath: 'user.png', isGroupMessage: false, name: '小天', recordInfo: '给我发个红包看看', recordTime: '18:38', isNotDisturb: false, unReadCount: 27 },
                { avatorPath: 'user.png', isGroupMessage: true, name: '小天', recordInfo: '给我发个红包看看', recordTime: '18:38', isNotDisturb: true, unReadCount: 27 }];
        this.props.isUtilVisible = false;
        this.props.utilList = [
                { iconPath:'search.png',utilText:'搜索' },
                { iconPath:'adress-book.png',utilText:'通讯录' },
                { iconPath:'add-friend.png',utilText:'添加好友' },
                { iconPath:'group-chat.png',utilText:'创建群聊' },
                { iconPath:'scan.png',utilText:'扫一扫' }
        ];
    }
    
    public getMore() {
        console.log('getMore');
        const temp = !this.props.isUtilVisible;
        this.props.isUtilVisible = temp;
        this.paint();
    }
    // 父组件接收子组件的传值
    public handleFatherTap(e:any) {
        // 如果点击的是通讯录
        if (e.index === 1) {
            console.log('hhhh');
            popNew('client-app-view-contactList-contactList',{ sid : this.props.uid });
        }
        // 如果点击的是添加好友
        if (e.index === 2) {
            console.log('hhhh');
            popNew('client-app-view-addUser-addUser',{ sid : this.props.uid });
        }
    }
    // 打开添加好友界面
    public openAddUser() {
        popNew('client-app-view-addUser-addUser',{ sid : this.props.uid });
    }
}

// ================================================ 本地
interface MessageList {
    avatorPath: string;// 头像
    isGroupMessage: boolean;// 标志来源是否是群消息
    name: string;// 用户名或群名
    recordInfo: string; // 简短的消息记录
    recordTime: string;// 消息记录时间
    isNotDisturb: boolean;// 是否免打扰
    unReadCount: number;// 未读条数
}
interface UtilList {
    iconPath?: string;// 头像
    utilText: string;// 文本
}
interface Props {
    uid: number;
    messageList: MessageList[];
    utilList:UtilList[];
    isUtilVisible: boolean;// 操作列表是否可见
}
