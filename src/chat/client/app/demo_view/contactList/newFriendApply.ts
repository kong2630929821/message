/**
 * 新朋友验证信息
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { Result } from '../../../../server/data/rpc/basic.s';
import { acceptUser, agreeJoinGroup } from '../../../../server/data/rpc/group.p';
import { GroupAgree } from '../../../../server/data/rpc/group.s';
import { Logger } from '../../../../utils/logger';
import { acceptFriend } from '../../../app/net/rpc';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class NewFriendApply extends Widget {
    public ok:() => void;
    public props:Props = {
        id:null,
        guid:null,
        name:'',
        applyInfo: '',
        chatType:GENERATOR_TYPE.USER,
        isSolve:'',
        title:'',
        activeToGGid:null
    };
    public setProps(props:any) {
        super.setProps(props);
        logger.debug('===============new friend apply props',props);
        
    }

    public goBack() {
        this.ok();
    }

    // 点击拒绝添加好友/群
    public rejectBtn() {
        if (this.props.chatType === 'user') {
            acceptFriend(this.props.id,false,(r:Result) => {
                // TODO:
                this.props.isSolve = '已拒绝';
                this.paint();
            });
        } else if (!this.props.activeToGGid) {
            logger.debug('==============group reject');
            const agree = new GroupAgree();
            agree.agree = false;
            agree.gid = this.props.id;
            agree.uid = store.getStore(`uid`);
            clientRpcFunc(agreeJoinGroup, agree,(gInfo:GroupInfo) => {
                if (gInfo.gid === -2) {
                    this.props.isSolve = '已拒绝';
                    this.paint();

                    return;
                }
            });
        } else {
            const agree = new GroupAgree();
            agree.gid = this.props.activeToGGid;
            agree.uid = this.props.id;
            agree.agree = false;
            logger.debug('==========active GroupApplyInfo reject',agree);
            clientRpcFunc(acceptUser,agree,(r) => {
                logger.debug('==========active GroupApplyInfo reject result',r);
                this.props.isSolve = '已拒绝';
                this.paint();
            });
        }
        
    }

    // 点击同意添加好友/群
    public agreeBtn() {
        if (this.props.chatType === 'user') {
            acceptFriend(this.props.id,true,(r:Result) => {
                this.props.isSolve = '已同意';
                this.paint();
            });
        } else if (!this.props.activeToGGid) {
            logger.debug('==============group agree');
            const agree = new GroupAgree();
            agree.agree = true;
            agree.gid = this.props.id;
            agree.uid = store.getStore(`uid`);
            clientRpcFunc(agreeJoinGroup, agree,(gInfo:GroupInfo) => {
                if (gInfo.gid === -1) {

                    return;
                }
                store.setStore(`groupInfoMap/${gInfo.gid}`,gInfo);
                this.props.isSolve = '已同意';
                this.paint();
            });
        } else {
            const agree = new GroupAgree();
            agree.gid = this.props.activeToGGid;
            agree.uid = this.props.id;
            agree.agree = true;
            logger.debug('==========active GroupApplyInfo agree',agree);
            clientRpcFunc(acceptUser,agree,(r) => {
                logger.debug('==========active GroupApplyInfo agree result',r);
                this.props.isSolve = '已同意';
                this.paint();
            });
        }
    }
    
    // 点击查看用户或群组详情
    public goDetail() {
        if (this.props.chatType === GENERATOR_TYPE.USER) {
            popNew('chat-client-app-demo_view-info-userDetail',{ uid:this.props.id, inFlag: 3 });  // 陌生人，仅查看基础信息
        } else if (this.props.activeToGGid) {
            popNew('chat-client-app-demo_view-info-userDetail',{ uid:this.props.id }); 
        } else {
            popNew('chat-client-app-demo_view-group-groupInfo', { gid:this.props.id });
        }
    }
}

// ================================================ 本地

interface Props {
    id:number; // 用户id 或群id
    guid:string; // 群内成员ID
    name:string; // 用户名或者群名
    applyInfo: string; // 申请信息
    chatType:GENERATOR_TYPE; // 类型 群或用户
    isSolve:string;
    title:string; // topbar 标题
    activeToGGid:number; // 主动入群 群id
}
