// ================================================ 导入
import { popNewMessage } from '../../../../../app/utils/pureUtils';
import { Widget } from '../../../../../pi/widget/widget';
import { Result } from '../../../../server/data/rpc/basic.s';
import { CommUserInfo } from '../../../../server/data/rpc/community.s';
import { inviteUsers } from '../../../../server/data/rpc/group.p';
import { Invite, InviteArray } from '../../../../server/data/rpc/group.s';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';
import { getUserInfoByNum } from '../../net/rpc';
 
// ================================================ 导出

interface Props {
    gid:number;
    followAndFans:CommUserInfo[];// 互关列表
    checkedList:CommUserInfo[];// 选中的列表
}

/**
 * 邀请成员
 */
export class InviteMember extends Widget {
    public ok:() => void;
    public props:Props = {
        gid:0,
        followAndFans:[],
        checkedList:[]
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const sid = store.getStore('uid', 0);
        const userinfo = store.getStore(`userInfoMap/${sid}`, {});
        const numsList = store.getStore(`followNumList/${sid}`,{ person_list:[] }).person_list;
        const fansList = store.getStore(`fansNumList/${userinfo.comm_num}`,{ list:[] }).list;
        const memberList = store.getStore(`groupInfoMap/${this.props.gid}`,{ memberids:[] }).memberids;
        const ids = [];
        numsList.forEach(v => {
            if (fansList.indexOf(v) >= 0) {
                ids.push(v);
            }
        });
        getUserInfoByNum(ids).then((r:any[]) => {
            this.props.followAndFans = r.filter(v => {
                return memberList.indexOf(v.user_info.uid) === -1;
            });
            this.paint();
        }).catch(err => {
            console.log('获取互关列表失败：',err);
        });

    }
    
    public goBack() {
        this.ok && this.ok();
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

    // 点击添加
    public completeBtn() {
        if (this.props.checkedList.length <= 0) {
            popNewMessage('请至少邀请一位好友');

            return ;
        }
        const invites = new InviteArray();
        invites.arr = [];
        this.props.checkedList.forEach((v) => {
            const invite = new Invite();
            invite.gid = this.props.gid;
            invite.rid = v.user_info.uid;
            invites.arr.push(invite);
        });
        clientRpcFunc(inviteUsers, invites, (r: Result) => {            
            if (r.r !== 1) {
                popNewMessage(`邀请好友入群失败`);
            }
        });

        this.goBack();
    }
}
 
// ================================================ 本地