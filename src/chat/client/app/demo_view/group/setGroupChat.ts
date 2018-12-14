/**
 * 创建群聊
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
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
        console.log(`start create Group`);
        if (this.props.name.length <= 0 || this.props.applyMembers.length <= 0) {
            logger.debug('群名不能为空，且必须选择了除自己以外的用户');

            return;          
        } 
        const groupInfo = new GroupCreate();
        groupInfo.name = this.props.name;
        groupInfo.note = '';
        clientRpcFunc(createGroup, groupInfo, (r: GroupInfo) => {
            if (r.gid === -1) {
                logger.debug(`创建群组失败`);

                return;
            }
            logger.debug(`创建群成功,gid is : ${r.gid}`);
            store.setStore(`groupInfoMap/${r.gid}`, r);
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
                    logger.debug(`邀请加入群失败`);
                }
                logger.debug('成功发送邀请好友信息');
            });
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