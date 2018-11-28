/**
 * 联系人详细信息
 */

// ================================================ 导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { UserArray } from '../../../../server/data/rpc/basic.s';
import { Logger } from '../../../../utils/logger';
import { getUsersBasicInfo } from '../../../app/net/rpc';

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
        modalArr:[],
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
        this.props.modalArr = [
            { title:'清空聊天记录',content:'确定清空和赵铁柱的聊天记录吗',sureText:'确定',cancelText:'取消' },
            { title:'加入黑名单',content:'加入黑名单，您不再收到对方的消息。',sureText:'确定',cancelText:'取消' },
            { title:'删除联系人',content:'将联系人\'赵铁柱\'删除，同时删除聊天记录',sureText:'删除',cancelText:'取消' }];
        this.props.isContactorOpVisible = false;
        this.props.isModalBoxVisible = false;
        this.getContactorInfo();
    }
    
    // 获取联系人信息
    public getContactorInfo() {
        const uids:number[] = [this.props.uid];
        getUsersBasicInfo(uids,(r:UserArray) => {
            console.log('===联系人信息===',r);
            this.props.userInfo = r.arr[0];
            this.paint();                    
        });
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
            popNew('client-app-widget-modalBox-modalBox',this.props.modalArr[0]);       
        }
        if (e.index === 2) { // 加入黑名单
            popNew('client-app-widget-modalBox-modalBox',this.props.modalArr[1]);
        }
        if (e.index === 3) { // 删除联系人
            popNew('client-app-widget-modalBox-modalBox',this.props.modalArr[2]);
        }
        this.paint();
    }

    public goBack() {
        this.ok();
    }
}

// ================================================ 本地

interface Props {
    uid: number;
    isContactorOpVisible:boolean;
    isModalBoxVisible:boolean;
    utilList:Object;
    modalArr:Object;
    userInfo:Object;
}
