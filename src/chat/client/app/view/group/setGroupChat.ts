/**
 * 创建群聊
 */

// ================================================ 导入
import { popNewLoading } from '../../../../../app/utils/pureUtils';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { Contact, UserInfo } from '../../../../server/data/db/user.s';
import { Result } from '../../../../server/data/rpc/basic.s';
import { createGroup, inviteUsers } from '../../../../server/data/rpc/group.p';
import { GroupCreate, Invite, InviteArray } from '../../../../server/data/rpc/group.s';
import { Logger } from '../../../../utils/logger';
import { delValueFromArray } from '../../../../utils/util';
import * as store from '../../data/store';
import { popNewMessage } from '../../logic/tools';
import { clientRpcFunc } from '../../net/init';
import { createGroup as createNPGroup, getFansList, getUserInfoByNum } from '../../net/rpc';
// ================================================ 本地
interface Props {
    name:string;// 群组名
    inputName:string; // 输入的群名称
    inviteMembers:number[];// 被邀请的成员uid
    inviteUserName:string[];// 被邀请的成员名字
    isSelect:boolean;// 是否被选择
    avatar:string; // 群头像展示
    userInfos:UserInfo[];  // 客服账号
    followData:any;// 关注列表
    checkedList:any;// 选中的列表
    id:number;// 用户id

}
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
            inviteMembers:[],
            inviteUserName:[],
            isSelect:false,
            avatar:'',
            userInfos:[],
            inputName:'',
            followData:[],
            checkedList:[],
            id:0
        };
        this.state = new Contact();
    }
    public create() {
        super.create();
        const sid = store.getStore('uid').toString();
        this.props.id = JSON.parse(sid);
        this.state = store.getStore(`contactMap/${sid}`,new Contact());
        this.props.userInfos = store.getStore('userInfoMap', new Map());
        const numsList = store.getStore(`followNumList/${sid}`,{ person_list:[],public_list:[]  });
        const userinfo = store.getStore(`userInfoMap/${sid}`, {});
        this.props.avatar = userinfo.avatar;
        const ids = [];
        getFansList(userinfo.comm_num).then((r:string[]) => {
            numsList.person_list.forEach(v => {
                if (r.indexOf(v) !== -1) {
                    ids.push(v);
                }
            });
            getUserInfoByNum(ids).then((r:any[]) => {
                this.props.followData = r;
                this.paint();
            });
        });
        
    }
    
    // 返回上一页
    public back() {
        this.ok();
    }

    // 点击完成
    public completeClick() {
        const list  = this.props.checkedList.slice(0,3);
        list.forEach(v => {
            this.props.name += v.user_info.name;
        });
        if (this.props.checkedList.length === 0) {
            popNewMessage('请至少选择一位好友');

            return;
        }
       
        const groupInfo = new GroupCreate();
        groupInfo.name = this.props.name;
        groupInfo.note = '';
        groupInfo.avatar = '';
        groupInfo.need_agree = true; // 入群需要同意
        clientRpcFunc(createGroup, groupInfo, (r: GroupInfo) => {
            if (r.gid === -1) {
                popNewMessage(`创建群组失败`);

                return;
            } else {
                popNewMessage(`创建群组成功`);
            }
            store.setStore(`groupInfoMap/${r.gid}`, r);

            // 邀请好友进群
            if (this.props.checkedList.length > 0) {
                const invites = new InviteArray();
                const invite = new Invite();
                invite.gid = r.gid;
                invite.rid = this.props.id;
                invites.arr = [invite];

                this.props.checkedList.forEach((item) => {
                    const invite = new Invite();
                    invite.gid = r.gid;
                    invite.rid = item.user_info.uid;
                    invites.arr.push(invite);
                });

                clientRpcFunc(inviteUsers, invites, (r: Result) => {
                    if (r.r !== 1) {
                        popNewMessage(`邀请好友入群失败`);
                    }
                });
            }
        });
        this.ok();
    }

    /**
     * 创建入群无需同意的群组
     * 暂留接口
     */
    public createNPG() {
        if (this.props.name) {
            createNPGroup(this.props.name,'','',false);
            this.ok();
        } else {
            popNewMessage('请输入群名');
        }
    }

    public checked(e:any) {
        if (e.fg) {
            this.props.checkedList.push(this.props.followData[e.value]);
        } else {
            this.props.checkedList.splice(e.value,1);
        }
        this.paint();
    }
}
store.register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (const value of r.values()) {
        forelet.paint(value);
    }    
});