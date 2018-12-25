/**
 * 群组成员
 */

// ================================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { GROUP_STATE } from '../../../../server/data/db/group.s';
import { delMember } from '../../../../server/data/rpc/group.p';
import { Logger } from '../../../../utils/logger';
import { genGuid } from '../../../../utils/util';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class GroupMember extends Widget {
    public ok:() => void;
    public props:Props;
    public bindCB:any;
    constructor () {
        super();
        this.props = {
            gid: null,
            groupInfo:{},
            deleteBtn:false
        };
        this.bindCB = this.updateInfo.bind(this);
    }

    public setProps(props:any) {        
        super.setProps(props); 
        this.props.groupInfo = this.getGroupInfo();
        this.props.deleteBtn = this.props.deleteBtn || false;
        const uid = store.getStore('uid');
        if (this.props.groupInfo.memberids.indexOf(uid) < 0) {
            alert('您已被移除该群');
            this.ok();
        } else  if (this.props.groupInfo.state === GROUP_STATE.DISSOLVE) {
            alert('该群已被解散');
            this.ok();
        }
    }
    public goBack() {
        this.ok();
    }
    public firstPaint() {
        super.firstPaint();
        store.register(`groupInfoMap/${this.props.gid}`,this.bindCB);
    }
    // 获取群组信息
    public getGroupInfo() {
        const ginfo = store.getStore(`groupInfoMap/${this.props.gid}`);
        logger.debug('============groupmember ginfo',ginfo);

        return ginfo;
    }
    // 打开邀请成员
    public inviteMember() {
        popNew('chat-client-app-demo_view-group-inviteMember',{ gid : this.props.gid });
    }
    // 进入移除成员操作状态
    public deleteMember() {
        const uid = store.getStore('uid');
        if (uid !== this.props.groupInfo.ownerid && this.props.groupInfo.adminids.indexOf(uid) === -1) {  // 用户既不是群主也不是管理员
            alert('您没有权限执行此操作');

            return ;
        }
        this.props.deleteBtn = true;
        this.paint();
    }
    // 移除成员
    public removeMember(uid:number) {
        const guid = genGuid(this.props.gid,uid);
        clientRpcFunc(delMember,guid,(r) => {
            logger.debug('===============removeMember',r);
        });
    }

    // 群组信息变化更新
    public updateInfo() {
        this.setProps(this.props);
        this.paint();
    }

    public destroy() {
        store.unregister(`groupInfoMap/${this.props.gid}`,this.bindCB);

        return super.destroy();
    }
}

// ================================================ 本地
interface Props {
    gid: number;
    groupInfo:Json; // 群信息
    deleteBtn:boolean; // 群成员是否处于移除状态
}
