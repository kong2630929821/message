// ================================================ 导入
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { Result } from '../../../../server/data/rpc/basic.s';
import { CommUserInfo } from '../../../../server/data/rpc/community.s';
import { createGroup, inviteUsers } from '../../../../server/data/rpc/group.p';
import { GroupCreate, Invite, InviteArray } from '../../../../server/data/rpc/group.s';
import * as store from '../../data/store';
import { popNewMessage } from '../../logic/tools';
import { clientRpcFunc } from '../../net/init';
import { getUserInfoByNum } from '../../net/rpc';
// ================================================ 本地
interface Props {
    followAndFans:CommUserInfo[];// 互关列表
    checkedList:CommUserInfo[];// 选中的列表
}
// ================================================ 导出

/**
 * 创建群聊
 */
export class SetGroupChat extends Widget {
    public props:Props;
    public ok:() => void;
    constructor() {
        super();
        this.props = {
            followAndFans:[],
            checkedList:[]
        };
    }
    public create() {
        super.create();
        const sid = store.getStore('uid', 0);
        const userinfo = store.getStore(`userInfoMap/${sid}`, {});
        const numsList = store.getStore(`followNumList/${sid}`,{ person_list:[] }).person_list;
        const fansList = store.getStore(`fansNumList/${userinfo.comm_num}`,{ list:[] }).list;
        const ids = [];
        numsList.forEach(v => {
            if (fansList.indexOf(v) >= 0) {
                ids.push(v);
            }
        });
        getUserInfoByNum(ids).then((r:any[]) => {
            this.props.followAndFans = r;
            this.paint();
        }).catch(err => {
            console.log('获取互关列表失败：',err);
        });
    }
    
    // 返回上一页
    public back() {
        this.ok && this.ok();
    }

    // 点击完成
    public completeClick() {        
        if (this.props.checkedList.length === 0) {
            popNewMessage('请至少选择一位好友');

            return;
        }

        const groupName = [];
        for (const v of this.props.checkedList) {
            groupName.push(v.user_info.name);
        }

        const groupInfo = new GroupCreate();
        groupInfo.name = groupName.join('、').slice(0,12);
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
                invite.rid = store.getStore('uid', 0);
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

    // 添加群成员
    public checked(e:any,index:number) {
        if (e.fg) {
            this.props.checkedList.push(this.props.followAndFans[index]);
        } else {
            this.props.checkedList.splice(index,1);
        }
        this.paint();
    }
}
