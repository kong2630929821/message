/**
 * 邀请成员
 */

 // ================================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { Contact } from '../../../../server/data/db/user.s';
import { Result } from '../../../../server/data/rpc/basic.s';
import { inviteUsers } from '../../../../server/data/rpc/group.p';
import { Invite, InviteArray } from '../../../../server/data/rpc/group.s';
import { Logger } from '../../../../utils/logger';
import { delValueFromArray } from '../../../../utils/util';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';
 
  // ================================================ 导出
  // tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);
export const forelet = new Forelet();
 
export class InviteMember extends Widget {
    public ok:() => void;
    public props:Props = {
        gid:null,
        ginfo:{},
        applyGroupMembers:[]
    };
    public setProps(props:any) {
        super.setProps(props);
        this.props.gid = props.gid;
        this.props.ginfo = this.getGroupInfo(this.props.gid);
        this.props.applyGroupMembers = [];
    }
    public goBack() {
        this.ok();
    }
    public getGroupInfo(gid:number) {
        const ginfo = store.getStore(`groupInfoMap/${gid}`);
        logger.debug('============ginfo',ginfo);
 
        return ginfo;
    }
     // 添加群成员
    public addGroupMember(e:any) {
        const uid = e.value;
        logger.debug('====邀请成员',uid);
        if (this.props.applyGroupMembers.findIndex(item => item === uid) === -1) {
            this.props.applyGroupMembers.push(uid);
        } else {
            this.props.applyGroupMembers = delValueFromArray(uid, this.props.applyGroupMembers);
        }
        logger.debug(`applyGroupMembers is : ${JSON.stringify(this.props.applyGroupMembers)}`);
    }
     // 点击添加
    public completeAddGroupMember() {
        if (this.props.applyGroupMembers.length <= 0) {
            console.log('请至少选择一位邀请好友');

            return ;
        }
        const invites = new InviteArray();
        invites.arr = [];
        this.props.applyGroupMembers.forEach((id) => {
            const invite = new Invite();
            invite.gid = this.props.gid;
            invite.rid = id;
            invites.arr.push(invite);
        });
        clientRpcFunc(inviteUsers, invites, (r: Result) => {
            if (r.r !== 1) {
                console.log(`邀请好友入群失败`);
            }
            console.log('成功发送邀请好友信息');
            this.ok();
        });
    }
}
 
  // ================================================ 本地
interface Props {
    gid:number;
    ginfo:Json;
    applyGroupMembers:number[];
}

store.register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (const value of r.values()) {
        forelet.paint(value);
    }    
});