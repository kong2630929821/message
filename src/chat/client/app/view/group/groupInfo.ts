/**
 * 群信息
 */

// ================================================ 导入
import { popNewLoading, popNewMessage } from '../../../../../app/utils/tools';
import { popModalBoxs, popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { GROUP_STATE, GroupInfo, GroupUserLink } from '../../../../server/data/db/group.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { setData } from '../../../../server/data/rpc/basic.p';
import {  GroupUserLinkArray, Result } from '../../../../server/data/rpc/basic.s';
import { getGroupUserLink, updateGroupInfo, userExitGroup } from '../../../../server/data/rpc/group.p';
import { NewGroup } from '../../../../server/data/rpc/group.s';
import { Logger } from '../../../../utils/logger';
import { depCopy, genGroupHid } from '../../../../utils/util';
import * as store from '../../data/store';
import { getGroupAvatar, getGroupUserAvatar, INFLAG, rippleShow } from '../../logic/logic';
import { selectImage } from '../../logic/native';
import { clientRpcFunc, unSubscribe } from '../../net/init';
import { applyToGroup } from '../../net/rpc';
import { arrayBuffer2File, imgResize, uploadFile } from '../../net/upload';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class GroupInfos extends Widget {
    public ok:(fg:boolean) => void;
    public props:Props;
    public bindCB: any;
    constructor() {
        super();
        this.props = {
            gid:null,
            groupInfo:{},
            members:[],
            showUtils:false,
            utilList:[],
            editable:false,
            groupAlias:'',
            isOwner: false,
            isAdmin:false,
            scrollHeight:0,
            setting:null,
            msgAvoid:false,
            msgTop:false,
            inFlag:INFLAG.contactList,
            avatar:'',
            avatarHtml:'',
            lastAnnounce:''
        };
        this.bindCB = this.updateInfo.bind(this);
    }

    public setProps(props:any) {
        super.setProps(props);
        this.props.utilList = [
            { utilText : '清空聊天记录' },
            { utilText : '退出该群' }];
        this.props.showUtils = false;
        this.props.editable = false;
        gid = this.props.gid;
        const uid = store.getStore('uid');
        const ginfo = store.getStore(`groupInfoMap/${this.props.gid}`,new GroupInfo());

        // 群已经解散或已被踢出群
        if ((!isNaN(ginfo.state) && ginfo.state === GROUP_STATE.DISSOLVE) || (ginfo.memberids && ginfo.memberids.indexOf(uid) < 0)) {
            this.goBack(true); 
        }
        this.props.groupInfo = ginfo;
        this.props.groupAlias = depCopy(ginfo.name);
        this.props.avatar = getGroupAvatar(this.props.gid) || '../../res/images/user_avatar.png';
        
        this.props.members = [];
        for (const v of ginfo.memberids) {
            this.props.members.push(getGroupUserAvatar(this.props.gid,v));
            
        }
        if (uid === this.props.groupInfo.ownerid) {
            this.props.isOwner = true;
        }

        if (ginfo.adminids.indexOf(uid) > -1) {
            this.props.isAdmin = true;
        }

        const setting = store.getStore('setting',{ msgAvoid:[],msgTop:[] });
        this.props.setting = setting;
        this.props.msgTop = setting.msgTop.findIndex(item => item === genGroupHid(this.props.gid)) > -1;
        this.props.msgAvoid = setting.msgAvoid.findIndex(item => item === genGroupHid(this.props.gid)) > -1;
        if (ginfo.annoceids) {
            const announce = store.getStore(`announceHistoryMap/${ginfo.annoceids[ginfo.annoceids.length - 1]}`,null);
            if (announce) {
                this.props.lastAnnounce = JSON.parse(announce.msg);
            } else {
                this.props.lastAnnounce = {
                    title:'无',
                    content:'群公告'
                };
            }
        }

    }

    public firstPaint() {
        super.firstPaint();
        getGroupUserLinkInfo(this.props.gid);
        store.register(`groupInfoMap/${this.props.gid}`,this.bindCB);
        store.register(`announceHistoryMap`,this.bindCB);
    }
    public goBack(fg:boolean = false) {
        this.ok && this.ok(fg);
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    // 重新上传群头像
    public selectAvatar() {
        if (this.props.isAdmin) {
            
            const imagePicker = selectImage((width, height, url) => {
                console.log('selectImage url = ',url);
                // tslint:disable-next-line:max-line-length
                this.props.avatarHtml = `<div style="background-image: url(${url});width: 190px;height: 190px;background-size: cover;background-position: center;background-repeat: no-repeat;border-radius:50%"></div>`;
                this.paint();

                const loading = popNewLoading('图片上传中');
                imagePicker.getContent({
                    quality:70,
                    success(buffer:ArrayBuffer) {
                        imgResize(buffer,(res) => {
                            uploadFile(arrayBuffer2File(res.ab),(url) => {
                                popNewMessage('图片上传成功');
                                loading.callback(loading.widget);
                            
                                const ginfo = store.getStore(`groupInfoMap/${gid}`,new GroupInfo());
                                const newGroup = new NewGroup();
                                newGroup.gid = gid;
                                newGroup.name = ginfo.name;
                                newGroup.avatar = url;
                                newGroup.note = '';
                                clientRpcFunc(updateGroupInfo, newGroup, (r: Result) => {
                                    if (r.r === 1) {
                                        this.props.groupInfo.avatar = url; 
                                        store.setStore(`groupInfoMap/${this.props.gid}`,this.props.groupInfo);
                                        logger.debug('==========修改群头像成功');
                                    }
                                });
                            });
                        });
                    }
                });
            });
        } else {
            this.showBigImg();
        }
    }

    // 群信息更多 
    public getMore() {
        this.props.showUtils = !this.props.showUtils;
        this.paint();
    }

    // 点击群信息更多操作列表项
    public utilClick(ind:number) {
        this.props.showUtils = false;
        this.paint();
        switch (ind) {
            case 0:  // 清空聊天记录
                popModalBoxs('chat-client-app-widget-modalBox-modalBox', { title:'清空聊天记录',content:'确定清空聊天记录吗' },() => {
                    store.setStore(`groupChatMap/${genGroupHid(this.props.gid)}`,[]);
                });
                break;
            case 1: // 退出群
                popModalBoxs('chat-client-app-widget-modalBox-modalBox', { content:'退出后，将不再接收此群任何消息',style:'color:#F7931A' },() => {
                    unSubscribe(`ims/group/msg/${this.props.gid}`);  // 退订群聊消息
        
                    clientRpcFunc(userExitGroup,this.props.gid,(r) => {
                        console.log('========deleteGroup',r);
                        if (r.r === 1) { // 退出成功关闭当前页面
                            popNewMessage('退出群组成功');
                            this.goBack(true);
                        } else {
                            popNewMessage('群主不能退出');
                        }
                    });
                });
                break;
            default:
        }
        
    }

    // 页面点击
    public pageClick() {
        this.props.editable = false;
        this.props.showUtils = false;
        this.paint();
    }

    // 点击后可编辑群别名
    public editGroupAlias() {
        this.props.editable = true;
        this.props.showUtils = false;
        this.paint();
    }
    
    // 修改群名
    public groupAliasChange(e:any) {
        this.props.groupAlias = e.value;
    }

    // 修改群名请求
    public changeGroupAlias() {
        const newGroup = new NewGroup();
        newGroup.gid = this.props.gid;
        newGroup.name = this.props.groupAlias || this.props.groupInfo.name;
        newGroup.avatar = this.props.groupInfo.avatar;
        newGroup.note = '';
        clientRpcFunc(updateGroupInfo, newGroup, (r: Result) => {
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
        this.props.showUtils = false;
        this.paint();
        const ownerid = this.props.groupInfo.ownerid;
        const adminids = this.props.groupInfo.adminids;
        const uid = store.getStore('uid');
        logger.debug('============openGroupManage',ownerid,adminids,uid);
        if (ownerid === uid || adminids.indexOf(uid) > -1) {
            popNew('chat-client-app-view-groupManage-groupManage',{ gid : this.props.gid });
        } else {
            popNewMessage('您没有权限执行此操作');
        }
    }
    // 打开群聊天
    public openGroupChat() {
        this.pageClick();
        popNew('chat-client-app-view-chat-chat',{ id:this.props.gid, chatType:GENERATOR_TYPE.GROUP });
        
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
            
        } else {
            setting.msgTop.splice(index,1);
        }
        this.props.setting = setting;
        store.setStore('setting',setting);
        this.pushLastChat(e.newType, setting);
        clientRpcFunc(setData,JSON.stringify(setting),(res) => {
            // TODO
            console.log(res);
        });
    }

    public pushLastChat(fg:boolean,setting:any) {
        const lastChat = store.getStore(`lastChat`, []);
        const ind = lastChat.findIndex(item => item[0] === this.props.gid && item[2] === GENERATOR_TYPE.GROUP);
        ind > -1 && lastChat.splice(ind, 1); 
        if (fg) { // 置顶放到最前面
            lastChat.unshift([this.props.gid, Date.now(), GENERATOR_TYPE.GROUP]); // 向前压入数组中
        } else {  // 取消置顶放到置顶消息后
            const len = setting.msgTop.length;
            lastChat.splice(len, 0, [this.props.gid, Date.now(), GENERATOR_TYPE.GROUP]); // 压入到置顶消息后
        }
        store.setStore(`lastChat`,lastChat);

    }

    /**
     * 申请加入群组
     */
    public applyGroup() {
        applyToGroup(this.props.gid).then(() => {
            popNewMessage('发送成功');
        },(r) => {
            popNewMessage('申请入群失败');
        });
    }

    // 点击查看大图头像
    public showBigImg() {
        popNew('chat-client-app-widget1-bigImage-bigImage',{ img: this.props.avatar });
    }
}

// ================================================ 本地
interface Util {
    iconPath ?: string; // 图标路径
    utilText : string; // 文本
}
interface Props {
    gid: number;
    groupInfo:any;// 群信息
    members:any[]; // 群成员数组
    utilList:Util[]; // 操作列表
    showUtils:boolean;
    editable:boolean; // 是否可编辑
    groupAlias:string; // 群别名
    isOwner:boolean; // 是否是群主
    isAdmin:boolean;// 是否时管理员
    scrollHeight:number; 
    setting:any; // 额外设置，免打扰|置顶
    msgTop:boolean; // 置顶
    msgAvoid:boolean; // 免打扰
    inFlag:INFLAG; // 从哪里进入
    avatar:string; // 群头像
    avatarHtml:string; // 新群头像展示
    lastAnnounce:any; // 最新一条群公告
}

const MAX_DURING = 600;

let gid;  // 群ID

// 获取群内成员信息
export const getGroupUserLinkInfo = (gid:number) => {
    if (Date.now() - store.getStore(`readGroupTimeMap/${gid}`, -1) > MAX_DURING) {
        clientRpcFunc(getGroupUserLink,gid,(r:GroupUserLinkArray) => {
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
    
};
