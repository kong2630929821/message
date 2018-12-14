/**
 * 登录
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
import { delValueFromArray } from '../../../../utils/util';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
// declare var module;
// const WIDGET_NAME = module.id.replace(/\//g, '-');
export const forelet = new Forelet();

export class Create extends Widget {
    public props:Props;
    public ok:() => void;
    constructor() {
        super();
        this.props = {
            name:'',
            applyMembers:[]
        };
        this.state = new Map();
    }

    public back() {
        this.ok();
    }

    public createGroup() {
        console.log(`start create Group`);
        if (this.props.name.length <= 0 || this.props.applyMembers.length <= 0) {
            alert('群名不能为空，且必须选择了除自己以外的用户');

            return;          
        } 
        const groupInfo = new GroupCreate();
        groupInfo.name = this.props.name;
        groupInfo.note = '';
        clientRpcFunc(createGroup, groupInfo, (r: GroupInfo) => {
            if (r.gid === -1) {
                alert(`创建群组失败`);

                return;
            }
            console.log(`创建群成功,gid is : ${r.gid}`);
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
                    alert(`邀请加入群失败`);
                }
                console.log('成功发送邀请好友信息');
            });
        });
    }
    
    public inputName(e:any) {
        this.props.name = e.value;
    }

    public addMember(uid:number) {
        if (this.props.applyMembers.findIndex(item => item === uid) === -1) {
            this.props.applyMembers.push(uid);
        } else {
            this.props.applyMembers = delValueFromArray(uid, this.props.applyMembers);
        }
        console.log(`applyMembers is : ${JSON.stringify(this.props.applyMembers)}`);
    }
}

// ================================================ 本地
interface Props {
    name:string;// 群组名
    applyMembers:number[];// 被邀请的成员
}

store.register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (const value of r.values()) {
        forelet.paint(value);
    }    
});