/**
 * 联系人详细信息
 */

// ================================================ 导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { UserInfo } from '../../../../server/data/db/user.s';
import { Result } from '../../../../server/data/rpc/basic.s';
import { Logger } from '../../../../utils/logger';
import * as store from '../../data/store';
import { delFriend as delUserFriend } from '../../net/rpc';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class UserDetail extends Widget {
    public ok:() => void;
    public props:Props = {
        uid:null,
        isContactorOpVisible:false,
        isModalBoxVisible:false,
        utilList:[],
        userInfo:{}
    };

    public setProps(props:Json) {
        super.setProps(props);
        this.props.userInfo = {};
        this.props.utilList = [
            { utilText:'发送名片' },
            { utilText:'删除聊天记录' },
            { utilText:'加入黑名单' },
            { utilText:'删除' }
        ];
        
        this.props.isContactorOpVisible = false;
        this.props.isModalBoxVisible = false;
        this.props.userInfo = store.getStore(`userInfoMap/${this.props.uid}`,new UserInfo());
    }
    
    // 点击...展开联系人操作列表
    public handleMoreContactor() {
        console.log('handleMoreContactor');
        const temp = !this.props.isContactorOpVisible;
        this.props.isContactorOpVisible = temp;
        this.paint();
    }
    // 开始对话
    public startDialog() {
        console.log('startDialog');
        popNew('client-app-demo_view-chat-chat',{ rid:this.props.uid });
    }  
    // 点击联系人操作列表项
    public handleFatherTap(e:any) {
        console.log('handleFatherTap');
        this.props.isContactorOpVisible = false;
        if (e.index === 1) { // 清空聊天记录
            popNew('client-app-widget-modalBox-modalBox',{ title:'清空聊天记录',content:'确定清空和' + `${this.props.userInfo.name}` + '的聊天记录吗' });       
        }
        if (e.index === 2) { // 加入黑名单
            popNew('client-app-widget-modalBox-modalBox',{ title:'加入黑名单',content:'加入黑名单，您不再收到对方的消息。' });
        }
        if (e.index === 3) { // 删除联系人
            popNew('client-app-widget-modalBox-modalBox',{ title:'删除联系人',content:'将联系人' + `${this.props.userInfo.name}` + '删除，同时删除聊天记录',sureText:'删除',cancelText:'取消' },() => {
                this.delFriend(this.props.uid);
                this.goBack();
            });
        }
        this.paint();
    }

    public goBack() {
        this.ok();
    }

    public delFriend(uid:number) {
        delUserFriend(uid,(r:Result) => {
            // TODO:
        });
    }
}

// ================================================ 本地

interface Props {
    uid: number;
    isContactorOpVisible:boolean;
    isModalBoxVisible:boolean;
    utilList:any;
    userInfo:any;
}
