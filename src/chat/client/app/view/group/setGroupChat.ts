/**
 * 创建群聊
 */

// ================================================ 导入
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { Contact } from '../../../../server/data/db/user.s';
import { Result } from '../../../../server/data/rpc/basic.s';
import { createGroup, inviteUsers } from '../../../../server/data/rpc/group.p';
import { GroupCreate, Invite, InviteArray } from '../../../../server/data/rpc/group.s';
import { Logger } from '../../../../utils/logger';
import { delValueFromArray } from '../../../../utils/util';
import * as store from '../../data/store';
import { bottomNotice } from '../../logic/logic';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);
export const forelet = new Forelet();

export class SetGroupChat extends Widget {
    public props:Props;
    public ok:() => void;
    constructor() {
        super();
        this.props = {
            name:'',
            applyMembers:[],
            isSelect:false
        };
        this.state = new Map();
    }
    // 返回上一页
    public back() {
        this.ok();
    }
    public createGroup() {
        if (!this.props.name) {
            bottomNotice('群名不能为空');

            return;          
        } 
        const groupInfo = new GroupCreate();
        groupInfo.name = this.props.name;
        groupInfo.note = '';
        clientRpcFunc(createGroup, groupInfo, (r: GroupInfo) => {
            if (r.gid === -1) {
                bottomNotice(`创建群组失败`);

                return;
            }
            store.setStore(`groupInfoMap/${r.gid}`, r);

            // 邀请好友进群
            if (this.props.applyMembers.length > 0) {
                const invites = new InviteArray();
                invites.arr = [];
                this.props.applyMembers.forEach((id) => {
                    const invite = new Invite();
                    invite.gid = r.gid;
                    invite.rid = id;
                    invites.arr.push(invite);
                });

                clientRpcFunc(inviteUsers, invites, (r: Result) => {
                    if (r.r !== 1) {
                        bottomNotice(`邀请好友入群失败`);
                    }
                });
            }
            this.ok();
        });
    }

    public inputName(e:any) {
        this.props.name = e.value;
    }

    public addMember(e:any) {
        const uid = e.value;
        logger.debug('=========创建群聊',uid);
        if (this.props.applyMembers.findIndex(item => item === uid) === -1) {
            this.props.applyMembers.push(uid);
        } else {
            this.props.applyMembers = delValueFromArray(uid, this.props.applyMembers);
        }
        logger.debug(`applyMembers is : ${JSON.stringify(this.props.applyMembers)}`);
    }
}

// ================================================ 本地
interface Props {
    name:string;// 群组名
    applyMembers:number[];// 被邀请的成员
    isSelect:boolean;// 是否被选择
}

store.register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (const value of r.values()) {
        forelet.paint(value);
    }    
});