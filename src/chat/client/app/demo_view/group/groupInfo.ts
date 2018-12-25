/**
 * 群信息
 */

// ================================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo, GroupUserLink } from '../../../../server/data/db/group.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import {  GroupUserLinkArray, Result } from '../../../../server/data/rpc/basic.s';
import { getGroupUserLink, updateGroupAlias, userExitGroup } from '../../../../server/data/rpc/group.p';
import { GroupAlias } from '../../../../server/data/rpc/group.s';
import { Logger } from '../../../../utils/logger';
import { depCopy } from '../../../../utils/util';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class GroupInfos extends Widget {
    public ok:() => void;
    public props:Props;
    public bindCB: any;
    constructor() {
        super();
        this.props = {
            gid:null,
            groupInfo:{},
            members:[],
            isGroupOpVisible:false,
            utilList:[],
            editable:false,
            groupAlias:'',
            isOwner: false
        };
        this.bindCB = this.updateInfo.bind(this);
    }

    public setProps(props:any) {
        super.setProps(props);
        this.props.utilList = [
            { utilText : '发送名片' },
            { utilText : '清空聊天记录' },
            { utilText : '删除' }];
        this.props.isGroupOpVisible = false;
        this.props.editable = false;
        const ginfo = store.getStore(`groupInfoMap/${this.props.gid}`);
        this.props.groupInfo = ginfo;
        this.props.groupAlias = depCopy(ginfo.name);
        
        const uid = store.getStore('uid');
        const members = this.props.groupInfo.memberids;
        this.props.members = members ? members : [];
        if (uid === this.props.groupInfo.ownerid) {
            this.props.isOwner = true;
        }

        if (ginfo.memberids.indexOf(uid) < 0) {
            this.ok();
        }
    }

    public firstPaint() {
        super.firstPaint();
        this.getGroupUserLinkInfo(this.props.gid);
        store.register(`groupInfoMap/${this.props.gid}`,this.bindCB);
    }
    public goBack() {
        this.ok();
    }

    // 获取群内成员信息
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
        this.props.isGroupOpVisible = !this.props.isGroupOpVisible;
        this.paint();
    }
    // 点击群信息更多操作列表项
    public handleFatherTap(e:any) {
        this.props.isGroupOpVisible = false;
        switch (e.index) {
            case 0: // 发送名片
                break;
            case 1:  // 清空聊天记录
                popNew('chat-client-app-widget-modalBox-modalBox', { title:'清空聊天记录',content:'确定清空聊天记录吗' });
                break;
            case 2: // 删除，退出群
                popNew('chat-client-app-widget-modalBox-modalBox', { content:'删除后，将不再接受此群消息',style:'color:#F7931A' },() => {
                    clientRpcFunc(userExitGroup,this.props.gid,(r) => {
                        console.log('========deleteGroup',r);
                        if (r.r === 1) { // 退出成功关闭当前页面
                            this.ok();
                        } else {
                            alert('退出群组失败');
                        }
                    });
                });
                break;
            default:
        }
        
        this.paint();
    }

    // 页面点击
    public pageClick() {
        this.props.editable = false;
        this.props.isGroupOpVisible = false;
        this.paint();
    }

    // 点击后可编辑群别名
    public editGroupAlias() {
        this.props.editable = true;
        this.props.isGroupOpVisible = false;
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
        gAlias.groupAlias = this.props.groupAlias || this.props.groupInfo.name;
        clientRpcFunc(updateGroupAlias, gAlias, (r: Result) => {
            logger.debug('====================changeGroupAlias',r);
            if (r.r === 1) {
                this.props.groupInfo.name = this.props.groupAlias; 
                
                store.setStore(`groupInfoMap/${this.props.gid}`,this.props.groupInfo);
                logger.debug('==========修改群名成功',this.props.groupAlias);
            }
        });
        
    }
    // 打开群公告
    public openGroupAnnounce() {
        this.pageClick();
        popNew('chat-client-app-demo_view-group-groupAnnounce',{ gid : this.props.gid });
    }
    // 打开群管理
    public openGroupManage() {
        this.props.isGroupOpVisible = false;
        this.paint();
        const ownerid = this.props.groupInfo.ownerid;
        const adminids = this.props.groupInfo.adminids;
        const uid = store.getStore('uid');
        logger.debug('============openGroupManage',ownerid,adminids,uid);
        if (ownerid === uid || adminids.indexOf(uid) > -1) {
            popNew('chat-client-app-demo_view-groupManage-groupManage',{ gid : this.props.gid });
        } else {
            alert('您没有权限进行群管理');
        }
    }
    // 打开群聊天
    public openGroupChat() {
        this.pageClick();
        popNew('chat-client-app-demo_view-chat-chat',{ id:this.props.gid, chatType:GENERATOR_TYPE.GROUP });
    }
    // 打开群成员
    public openGroupMember() {
        this.pageClick();
        popNew('chat-client-app-demo_view-group-groupMember',{ gid : this.props.gid });
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
interface Util {
    iconPath ?: string; // 图标路径
    utilText : string; // 文本
}
interface Props {
    gid: number;
    groupInfo:Json;// 群信息
    members:Json; // 群成员数组
    utilList:Util[]; // 操作列表
    isGroupOpVisible:boolean;
    editable:boolean; // 是否可编辑
    groupAlias:string; // 群别名
    isOwner:boolean; // 是否是群主
}

const MAX_DURING = 600;
