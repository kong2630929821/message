/**
 * 群信息
 */

// ================================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupUserLink } from '../../../../server/data/db/group.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { setData } from '../../../../server/data/rpc/basic.p';
import {  GroupUserLinkArray, Result } from '../../../../server/data/rpc/basic.s';
import { getGroupUserLink, updateGroupAlias, userExitGroup } from '../../../../server/data/rpc/group.p';
import { GroupAlias } from '../../../../server/data/rpc/group.s';
import { Logger } from '../../../../utils/logger';
import { depCopy, genGroupHid } from '../../../../utils/util';
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
            isOwner: false,
            isAdmin:false,
            scrollHeight:0,
            setting:null,
            msgAvoid:false,
            msgTop:false
        };
        this.bindCB = this.updateInfo.bind(this);
    }

    public setProps(props:any) {
        super.setProps(props);
        this.props.utilList = [
            { utilText : '发送名片' },
            { utilText : '清空聊天记录' },
            { utilText : '退出该群' }];
        this.props.isGroupOpVisible = false;
        this.props.editable = false;
        const ginfo = store.getStore(`groupInfoMap/${this.props.gid}`);
        this.props.groupInfo = ginfo;
        this.props.groupAlias = depCopy(ginfo.name);
        
        const uid = store.getStore('uid');
        this.props.members = this.props.groupInfo.memberids || [];
        if (uid === this.props.groupInfo.ownerid) {
            this.props.isOwner = true;
        }

        if (ginfo.adminids.indexOf(uid) > -1) {
            this.props.isAdmin = true;
        }

        this.props.setting = store.getStore('setting',{ msgAvoid:[],msgTop:[] });
        this.props.msgTop = this.props.setting.msgTop.findIndex(item => item === genGroupHid(this.props.gid)) > -1;
        this.props.msgAvoid = this.props.setting.msgAvoid.findIndex(item => item === genGroupHid(this.props.gid)) > -1;
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
            case 2: // 退出群
                popNew('chat-client-app-widget-modalBox-modalBox', { content:'退出后，将不再接收此群任何消息',style:'color:#F7931A' },() => {
                    clientRpcFunc(userExitGroup,this.props.gid,(r) => {
                        console.log('========deleteGroup',r);
                        if (r.r === 1) { // 退出成功关闭当前页面
                            console.log('退出群组成功');
                            this.ok();
                        } else {
                            console.log('退出群组失败');
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
        popNew('chat-client-app-view-group-groupAnnounce',{ gid : this.props.gid });
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
            popNew('chat-client-app-view-groupManage-groupManage',{ gid : this.props.gid });
        } else {
            console.log('您没有权限执行此操作');
        }
    }
    // 打开群聊天
    public openGroupChat() {
        setTimeout(() => {
            popNew('chat-client-app-view-chat-chat',{ id:this.props.gid, chatType:GENERATOR_TYPE.GROUP });
            this.pageClick();
        }, 0);
    }
    // 打开群成员
    public openGroupMember() {
        this.pageClick();
        popNew('chat-client-app-view-group-groupMember',{ gid : this.props.gid });
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

    /**
     * 屏幕滑动
     */
    public scrollPage() {
        const scrollTop = document.getElementById('groupInfo').scrollTop;
        this.props.scrollHeight = scrollTop;
        this.paint();
    }

    /**
     * 设置消息免打扰
     */
    public msgAvoid(e:any) {
        this.props.msgAvoid = e.newType;
        const setting = this.props.setting;
        const hid = genGroupHid(this.props.gid);
        const index = setting.msgAvoid.findIndex(item => item === hid);
        if (e.newType) {
            index === -1 && setting.msgAvoid.push(hid);
        } else {
            setting.msgAvoid.splice(index,1);
        }
        this.props.setting = setting;
        store.setStore('setting',setting);
        clientRpcFunc(setData,JSON.stringify(setting),(res) => {
            // TODO
            console.log(res);
        });
    }

    /**
     * 设置消息置顶
     */
    public msgTop(e:any) {
        this.props.msgTop = e.newType;
        const setting = this.props.setting;
        const hid = genGroupHid(this.props.gid);
        const index = setting.msgTop.findIndex(item => item === hid);
        if (e.newType) {
            index === -1 && setting.msgTop.push(hid);
            
            const lastChat = store.getStore(`lastChat`, []);
            const ind = lastChat.findIndex(item => item[0] === this.props.gid && item[2] === GENERATOR_TYPE.GROUP);
            ind > -1 && lastChat.splice(index, 1);    
            lastChat.unshift([]); // 向前压入数组中
            store.setStore(`lastChat`,lastChat);

        } else {
            setting.msgTop.splice(index,1);
        }
        this.props.setting = setting;
        store.setStore('setting',setting);

        clientRpcFunc(setData,JSON.stringify(setting),(res) => {
            // TODO
            console.log(res);
        });
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
    isAdmin:boolean;// 是否时管理员
    scrollHeight:number; 
    setting:any; // 额外设置，免打扰|置顶
    msgTop:boolean; // 置顶
    msgAvoid:boolean; // 免打扰
}

const MAX_DURING = 600;
