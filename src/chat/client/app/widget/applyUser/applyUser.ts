/**
 * applyUser 组件相关处理
 */ 

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { getUsersInfo } from '../../../../server/data/rpc/basic.p';
import { GetUserInfoReq, UserArray } from '../../../../server/data/rpc/basic.s';
import { Logger } from '../../../../utils/logger';
import { getGidFromGuid, getUidFromGuid } from '../../../../utils/util';
import * as store from '../../data/store';
import { getGroupAvatar, getUserAvatar, rippleShow } from '../../logic/logic';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
 // tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class ApplyUser extends Widget {
    public props: Props = {
        id:null,
        guid:null,
        name:'哈哈哈',
        chatType:GENERATOR_TYPE.USER,
        applyInfo: '申请加为好友',
        isActiveToGroup:true,
        isagree:false,
        activeToGGid:null,
        avatar:'../../res/images/user_avatar.png'
    };

    public setProps(props:any) {
        super.setProps(props);
        this.props.isagree = false;
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            const userInfo = store.getStore(`userInfoMap/${this.props.id}`,null);
            this.props.name = userInfo ? userInfo.name : '';
            this.props.applyInfo = '请求添加你为好友';
            this.props.avatar = getUserAvatar(this.props.id) || '../../res/images/user_avatar.png';

        } else if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            if (this.props.isActiveToGroup) { // 主动申请加群
                const info = new GetUserInfoReq();
                info.uids = [this.props.id];
                info.acc_ids = [];
                clientRpcFunc(getUsersInfo,info,(r:UserArray) => {
                    if (r.arr.length > 0) {
                        this.props.name = r.arr[0].name; 
                        this.props.applyInfo = `用户${this.props.name}申请进群`;
                        this.paint();
                    }
                });
                
            } else { // 被动进群
                const gid = getGidFromGuid(this.props.guid);
                const rid = getUidFromGuid(this.props.guid);
                const ginfo = store.getStore(`groupInfoMap/${gid}`);
                const userInfo = store.getStore(`userInfoMap/${rid}`);
                this.props.name = ginfo ? ginfo.name :'';
                this.props.applyInfo = `${userInfo ? userInfo.name : ''}邀请你加入群`;
                this.props.id = gid;
                this.props.avatar = getGroupAvatar(gid) || '../../res/images/groups.png';
            }
            
        }
    }
        // 查看申请详细信息 
    public viewApplyDetail() {
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            popNew('chat-client-app-widget-newFriendApply-newFriendApply',{ ...this.props,title:'新的朋友' });
        }
        if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            if (this.props.isActiveToGroup) { // 主动申请加群
                popNew('chat-client-app-widget-newFriendApply-newFriendApply',{ ...this.props,title:'申请入群' });
            } else { // 被动进群
                popNew('chat-client-app-widget-newFriendApply-newFriendApply',{ ...this.props,title:'邀请入群' });
            }
            
        }
        
    }

    public agreenBtn(e:any) {
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            notify(e.node,'ev-agree-friend',{ value:this.props.id });
        }
        if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            if (this.props.isActiveToGroup) { // 主动申请加群
                notify(e.node,'ev-agree-joinGroup',{ value:this.props.id });
            } else { // 被动进群
                notify(e.node,'ev-agree-group',{ value:getGidFromGuid(this.props.guid) });
            }  
        }
        this.props.isagree = true;
        this.paint();
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}

// ================================================ 本地
interface Props {
    id?: number; // 用户id或群组id
    guid?:string; // 群内成员ID
    name?: string; // 用户名或群名
    chatType: GENERATOR_TYPE; // 是用户还是群组
    applyInfo?: string; // 验证信息
    isActiveToGroup: boolean; // 是否主动加群
    isagree:boolean;
    activeToGGid:number; // 主动入群 群id
    avatar:string; // 头像
}