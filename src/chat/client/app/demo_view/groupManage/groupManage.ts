/**
 * 群管理相关处理
 */

// ================================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { dissolveGroup } from '../../../../server/data/rpc/group.p';
import { Logger } from '../../../../utils/logger';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class ManageItem extends Widget {
    public ok:() => void;
    public props:Props = {
        gid : null,
        groupInfo:{},
        adminNum:null,
        applyUserNum:null,
        manageList: [],
        groupSetList:[],
        destroyGroupModalObj:{}
    };
    public setProps(props:any) {
        super.setProps(props);
        this.props.gid = props.gid;
        this.props.groupInfo = this.getGroupInfo(this.props.gid);
        this.props.adminNum = this.props.groupInfo.adminids.length;
        this.props.applyUserNum = this.props.groupInfo.applyUser.length;
        this.props.manageList = [
            { title : '设置管理员', quantity : `${this.props.adminNum}/5` },
            { title : '转让群主',quantity : '' },
            { title : '入群申请',quantity : `${this.props.applyUserNum}` }];

        this.props.groupSetList = [
            { title : '允许群成员邀请入群',content : '关闭后，群成员不能邀请好友加群' },
            { title : '开启进群审核',content : '关闭后，进群不需要经过群主或管理员审核' }];
        this.props.destroyGroupModalObj = { content:'解散后，所有成员将被清出，该群将不存在。',sureText:'确定',cancelText:'取消',style:'color:#F7931A' };
    }  
    public goBack() {
        this.ok();
    } 
    public firstPaint() {
        super.firstPaint();
        store.register(`groupInfoMap/${this.props.gid}`,(r:GroupInfo) => {
            this.props.groupInfo = r;
            this.props.adminNum = r.adminids.length;
            this.props.applyUserNum = r.applyUser.length;
            logger.debug('=============group manage', this.props);
            this.setProps(this.props);
            this.paint();
        });
    }
    // 获取群组信息
    public getGroupInfo(gid:number) {
        const ginfo = store.getStore(`groupInfoMap/${gid}`);
        logger.debug('============ginfo',ginfo);

        return ginfo;
    }
    // 打开群管理项
    public openManageItem(e:any) {
        const ownerid = this.props.groupInfo.ownerid;
        const uid = store.getStore('uid');
        logger.debug('==============openManageItem',e.value);
        if (e.value === 2) { // 入群申请
            popNew('chat-client-app-demo_view-groupManage-groupApplyStatus',{ gid:this.props.gid });
        } else if (ownerid !== uid) {  // 是否是群主
            alert('你没有权限执行此操作');

            return;
        }
        if (e.value === 0) { // 设置管理员
            popNew('chat-client-app-demo_view-groupManage-setupAdmin',{ gid:this.props.gid });
        } else if (e.value === 1) { // 转让群主
            popNew('chat-client-app-demo_view-groupManage-transferAdmin',{ gid:this.props.gid });
        } 
    }
    // 解散群
    public destroyGroup() {
        const ownerid = this.props.groupInfo.ownerid;
        const uid = store.getStore('uid');
        if (ownerid === uid) {
            popNew('chat-client-app-widget-modalBox-modalBox',this.props.destroyGroupModalObj,
            () => {
                logger.debug('dissolveGroup');
                clientRpcFunc(dissolveGroup,this.props.gid,(r) => {
                    logger.debug('========dissolveGroup',r);
                    this.ok();
                });
            },
            () => {
                logger.debug('================cancel dissolveGroup');
            });
        }
    } 
}

// ================================================ 本地
interface Manage {
    title:string;// 标题
    quantity?:string;// 数量
}

interface GroupSet {
    title:string;// 标题
    content:string;// 说明内容
}

interface Props {
    gid:number;
    groupInfo:Json;
    adminNum:number;
    applyUserNum:number;
    manageList : Manage[];
    groupSetList : GroupSet[];
    destroyGroupModalObj:Json;
}
