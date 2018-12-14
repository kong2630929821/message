/**
 * 群信息
 */

// ================================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo, GroupUserLink } from '../../../../server/data/db/group.s';
import {  GroupUserLinkArray, Result } from '../../../../server/data/rpc/basic.s';
import { getGroupUserLink, updateGroupAlias, userExitGroup } from '../../../../server/data/rpc/group.p';
import { GroupAlias } from '../../../../server/data/rpc/group.s';
import { Logger } from '../../../../utils/logger';
import * as store from '../../data/store';
import { getGroupAlias } from '../../logic/logic';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class GroupInfos extends Widget {
    public ok:() => void;
    public props : Props = {
        gid:null,
        groupInfo:{},
        memberCount:null,
        members:[],
        isGroupOpVisible:false,
        utilList:[],
        modalArr:[],
        editable:false,
        groupAlias:'',
        isOwner: false
    };

    public setProps(props:any) {
        super.setProps(props);
        this.props.utilList = [
            { utilText : '发送名片' },
            { utilText : '清空聊天记录' },
            { utilText : '删除' }];
        this.props.isGroupOpVisible = false;
        this.props.modalArr = [
            { title:'清空聊天记录',content:'确定清空聊天记录吗',sureText:'确定',cancelText:'取消' },
            { content:'删除后，将不再接受此群消息',sureText:'确定',cancelText:'取消',style:'color:#F7931A' }];
        // this.getGroupInfo();
        this.props.editable = false;
        this.props.groupAlias = getGroupAlias(this.props.gid);
        
        this.props.groupInfo = this.getGroupInfo(this.props.gid);
        const uid = store.getStore('uid');
        const members = this.props.groupInfo.memberids;
        this.props.members = members.length > 0 ? members : [];
        this.props.memberCount = members ? members.length : 0;
        if (uid === this.props.groupInfo.ownerid) {
            this.props.isOwner = true;
        }
    }

    public firstPaint() {
        super.firstPaint();
        // 获取群成员的groupUserLink
        this.getGroupUserLinkInfo(this.props.gid);
        store.register(`groupInfoMap/${this.props.gid}`,(r:GroupInfo) => {
            this.props.memberCount = r.memberids.length;
            this.props.members = r.memberids.length <= 4 ? r.memberids : r.memberids.filter(index => index < 4);
            this.paint();
        });
    }
    public goBack() {
        this.ok();
    }

    // 获取群组信息
    public getGroupInfo(gid:number) {
        const ginfo = store.getStore(`groupInfoMap/${gid}`);
        logger.debug('============ginfo',ginfo);

        return ginfo;
    }
    // 获取用户在群组内的信息
    public getGroupUserLinkInfo(gid:number) {
        if (Date.now() - store.getStore(`readGroupTimeMap/${gid}`, -1) > MAX_DURING) {
            clientRpcFunc(getGroupUserLink,this.props.gid,(r:GroupUserLinkArray) => {
                logger.debug('===============',r);
                // 判断是否返回成功
                if (r.arr.length > 0) {
                    r.arr.forEach((item:GroupUserLink) => {
                        store.setStore(`groupUserLinkMap/${item.guid}`,item);
                    });
                    store.setStore(`readGroupTimeMap/${gid}`, Date.now());
                }
            });
        }
        
    }
    // 群信息更多 
    public handleMoreGroup() {
        const temp = !this.props.isGroupOpVisible;
        this.props.isGroupOpVisible = temp;
        this.paint();
    }
    // 点击群信息更多操作列表项
    public handleFatherTap(e:any) {
        this.props.isGroupOpVisible = false;
        if (e.index === 0) { // 发送名片
           
        }
        if (e.index === 1) { // 清空聊天记录
            popNew('chat-client-app-widget-modalBox-modalBox',this.props.modalArr[0]);
        }
        if (e.index === 2) { // 删除
            popNew('chat-client-app-widget-modalBox-modalBox',this.props.modalArr[1],
            () => {
                logger.debug('===============deleteGroup');
                clientRpcFunc(userExitGroup,this.props.gid,(r) => {
                    logger.debug('========deleteGroup',r);
                });
            },
            () => {
                logger.debug('=============== cancel deleteGroup');
            });
        }
        this.paint();
    }
    // 页面点击
    public pageClick() {
        this.props.editable = false;
        this.paint();
    }
    public editGroupAlias() {
        this.props.editable = true;
        this.paint();
    }
    public groupAliasChange(e:any) {
        this.props.groupAlias = e.target.value;
        this.paint();
    }
    // 修改群名
    public changeGroupAlias() {
        const gAlias = new GroupAlias();
        gAlias.gid = this.props.gid;
        gAlias.groupAlias = this.props.groupAlias;
        clientRpcFunc(updateGroupAlias, gAlias, (r: Result) => {
            logger.debug('====================changeGroupAlias',r);
            if (r.r === 1) {
                // const ginfo = store.getStore(`groupInfoMap/${this.props.gid}`,new GroupInfo());
                // ginfo.name = this.props.groupAlias;
                this.props.groupInfo.name = this.props.groupAlias; 
                
                store.setStore(`groupInfoMap/${this.props.gid}`,this.props.groupInfo);
                logger.debug('==========修改群名成功',this.props.groupAlias);
            }
        });
        
    }
    // 打开群公告
    public openGroupAnnounce() {
        popNew('chat-client-app-demo_view-group-groupAnnounce',{ gid : this.props.gid });
    }
    // 打开群管理
    public openGroupManage() {
        const ownerid = this.props.groupInfo.ownerid;
        const adminids = this.props.groupInfo.adminids;
        const uid = store.getStore('uid');
        logger.debug('============openGroupManage',ownerid,adminids,uid);
        if (ownerid === uid || adminids.indexOf(uid) > -1) {
            popNew('chat-client-app-demo_view-groupManage-groupManage',{ gid : this.props.gid });
        }
    }
    // 打开群聊天
    public openGroupChat() {
        popNew('chat-client-app-demo_view-group-groupChat',{ gid : this.props.gid });
    }
    // 打开群成员
    public openGroupMember() {
        popNew('chat-client-app-demo_view-group-groupMember',{ gid : this.props.gid });
    }
}

// ================================================ 本地
interface Util {
    iconPath ?: string; // 图标路径
    utilText : string; // 文本
}
interface Props {
    gid: number;
    groupInfo:Json;// 群信息
    memberCount:number; // 群成员个数
    members:Json; // 群成员数组
    utilList:Util[]; // 操作列表
    isGroupOpVisible:boolean;
    modalArr:Object;
    editable:boolean; // 是否可编辑
    groupAlias:string; // 群别名
    isOwner:boolean; // 是否是群主
}

const MAX_DURING = 600;