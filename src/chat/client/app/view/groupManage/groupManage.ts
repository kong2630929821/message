/**
 * 群管理相关处理
 */

// ================================================ 导入
import { popNewMessage } from '../../../../../app/utils/tools';
import { Json } from '../../../../../pi/lang/type';
import { popModalBoxs, popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { Result } from '../../../../server/data/rpc/basic.s';
import { dissolveGroup, updateNeedAgree } from '../../../../server/data/rpc/group.p';
import { NeedAgree } from '../../../../server/data/rpc/group.s';
import { Logger } from '../../../../utils/logger';
import * as store from '../../data/store';
import { rippleShow } from '../../logic/logic';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class GroupManage extends Widget {
    public ok:() => void;
    public props:Props = {
        gid : null,
        groupInfo:{},
        adminNum:null,
        applyUserNum:null,
        manageList: [],
        groupSets:[]
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
            { title : '入群申请',quantity : `${this.props.applyUserNum}` },
            { title : '解散群',quantity : '' }
        ];
        this.props.groupSets = [
            { title:'开启进群审核',content:'关闭后，进群不需要经过群主或管理员审核',showSwitch:true }
        ];

        // 是否是官方群组
        if (this.props.groupInfo.level === 5) {
            this.props.manageList.pop();
            this.props.groupSets = [
                { title:'无需进群审核',content:'进群不需要经过群主或管理员审核',showSwitch:false }
            ];
        }
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

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
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
            popNew('chat-client-app-view-groupManage-groupApplyStatus',{ gid:this.props.gid });
        } else if (ownerid !== uid) {  // 是否是群主
            popNewMessage('你没有权限执行此操作');

            return;
        }
        if (e.value === 0) { // 设置管理员
            popNew('chat-client-app-view-groupManage-setupAdmin',{ gid:this.props.gid });
        } else if (e.value === 1) { // 转让群主
            popNew('chat-client-app-view-groupManage-transferAdmin',{ gid:this.props.gid });
        } 
    }

    // 解散群
    public destroyGroup() {
        const ownerid = this.props.groupInfo.ownerid;
        const uid = store.getStore('uid');
        if (ownerid === uid) {
            popModalBoxs('chat-client-app-widget-modalBox-modalBox',{ content:'解散后，所有成员将被清出，该群将不存在。',style:'color:#F7931A' },
            () => {
                logger.debug('dissolveGroup');
                clientRpcFunc(dissolveGroup,this.props.gid,(r) => {
                    console.log('========dissolveGroup',r);
                    this.ok();
                });
            },
            () => {
                logger.debug('================cancel dissolveGroup');
            });
        }
    } 

    // 入群是否需要管理员同意
    public joinNeedAgree(e:any) {
        // TODO 导入文件
        const need = new NeedAgree();
        need.gid = this.props.gid;
        need.need_agree = e.newType;
        clientRpcFunc(updateNeedAgree, need, (r:Result) => {
            if (r && r.r === 1) {
                this.props.groupInfo.need_agree = need.need_agree;
                this.paint();

            }
        });

    }
}

// ================================================ 本地

interface Props {
    gid:number;
    groupInfo:Json;
    adminNum:number;
    applyUserNum:number; 
    manageList: any[];  // 群管理
    groupSets:any[];  // 其他群设置
}
