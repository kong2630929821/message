/**
 * applyUser 组件相关处理
 */ 

// ================================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { GENERATOR_TYPE, UserInfo } from '../../../../server/data/db/user.s';
import { Logger } from '../../../../utils/logger';import * as store from '../../data/store';
import { UserInfo } from '../../../../server/data/db/user.s';

// ================================================ 导出
 // tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class ApplyUser extends Widget {
    public props: Props = {
        id:null,
        name:'',
        chatType:GENERATOR_TYPE.USER,
        applyInfo: '',
        isActiveToGroup:true,
        isagree:false,
        activeToGGid:null
    };

    public setProps(props:any) {
        super.setProps(props);
        this.props.ginfo = store.getStore(`groupInfoMap/${this.props.gid}`,new GroupInfo());
        this.props.isagree = false;
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            logger.debug('------------',store.getStore(`userInfoMap/${this.props.id}`));
            const userInfo = store.getStore(`userInfoMap/${this.props.id}`);
            this.props.name = userInfo ? userInfo.name : '';
            this.props.applyInfo = `${this.props.name}请求添加你为好友`;
        }
        if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            if (this.props.isActiveToGroup) { // 主动申请加群
                const userInfo = store.getStore(`userInfoMap/${this.props.id}`);
                this.props.name = userInfo ? userInfo.name : ''; 
                this.props.applyInfo = `用户${this.props.name}申请进群`;
                this.props.activeToGGid = props.activeToGGid;
            } else { // 被动进群
                const ginfo = store.getStore(`groupInfoMap/${this.props.id}`);
                this.props.name = ginfo ? ginfo.name : ''; 
                this.props.applyInfo = `邀请你进群：${this.props.name}`;
            }
            
        }
    }
        // 查看申请详细信息 
    public viewApplyDetail() {
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            popNew('chat-client-app-demo_view-contactList-newFriendApply',this.props);
        }
        if (this.props.chatType === GENERATOR_TYPE.GROUP) {
            if (this.props.isActiveToGroup) { // 主动申请加群
                popNew('chat-client-app-demo_view-groupManage-groupApplyInfo',this.props);
            } else { // 被动进群
                popNew('chat-client-app-demo_view-contactList-newFriendApply',this.props);
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
                notify(e.node,'ev-agree-group',{ value:this.props.id });
            }  
        }
        this.props.isagree = true;
        this.paint();
    }
}

// ================================================ 本地
interface Props {
    id?: number; // 用户id或群组id
    name?: string; // 用户名或群名
    chatType: GENERATOR_TYPE; // 是用户还是群组
    applyInfo?: string; // 验证信息
    isActiveToGroup: boolean; // 是否主动加群
    isagree:boolean;
    activeToGGid:number; // 主动入群 群id
}