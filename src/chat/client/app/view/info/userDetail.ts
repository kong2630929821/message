/**
 * 联系人详细信息
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    uid: number;
    userInfo: any;
    alias: string; // 好友别名
    avatar:string; // 头像
    numList:any[][];
}

// ================================================ 导出
export class UserDetail extends Widget {
    public ok: () => void;
    public props: Props;
    constructor() {
        super();
        this.props = {
            uid: null,
            userInfo: {},
            alias: '',
            avatar:'',
            numList:[
                [114,'动态'],
                [302,'关注'],
                [159,'粉丝']
            ]
        };
    }

    public goBack() {
        this.ok && this.ok();
    }

    public goSetting() {
        popNew('chat-client-app-view-info-setting');
    }

    public goPersonHome(i:number) {
        popNew('chat-client-app-view-person-personHome',{ activeTab:i });
    }
}

// ================================================ 本地
