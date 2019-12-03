// ================================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { GROUP_STATE } from '../../../../server/data/db/group.s';
import { CommUserInfo } from '../../../../server/data/rpc/community.s';
import { genGuid } from '../../../../utils/util';
import * as store from '../../data/store';
import { popNewMessage } from '../../logic/tools';
import { deleteGroupMember, getUserInfoByUid } from '../../net/rpc';

// ================================================ 导出

/**
 * 群组成员
 */
export class GroupMember extends Widget {
    public ok:() => void;
    public props:Props;
    public bindCB:any;
    constructor () {
        super();
        this.props = {
            gid: null,
            groupInfo:{},
            groupUserData:[]
        };
    }

    public setProps(props:any) {        
        super.setProps(props); 
        const group = this.props.groupInfo = store.getStore(`groupInfoMap/${this.props.gid}`,{});
        this.props.groupUserData = [];
        getUserInfoByUid(group.memberids).then((res:CommUserInfo[]) => {
            this.props.groupUserData = res;
            this.paint();
        }).catch(err => {
            console.log('获取群成员列表失败：',err);
        });
        const uid = store.getStore('uid');
        if (group.memberids && group.memberids.indexOf(uid) < 0) {
            popNewMessage('您已被移除该群');
            this.goBack();
        } else if (group.state === GROUP_STATE.DISSOLVE) {
            popNewMessage('该群已被解散');
            this.goBack();
        }
        
    }
    public goBack() {
        this.ok && this.ok();
    }
    
    // 移除成员
    public removeMember(e:any) {
        if (!e.value) return;
        const guid = genGuid(this.props.gid,e.value);
        deleteGroupMember(guid).then(res => {
            const index = this.props.groupUserData.findIndex(v => v.user_info.uid === e.value);
            if (index >= 0) {
                this.props.groupUserData.splice(index,1);
                this.paint();
            }
            popNewMessage('移出群成员');

        }).catch(err => {
            console.log(err);
        });
    }

    // 查看用户详情
    public goDetail(e:any) {
        if (!e.value) return;
        popNew('chat-client-app-view-info-userDetail',{ uid:e.value });
    }

}

// ================================================ 本地
interface Props {
    gid: number;
    groupInfo:Json; // 群信息
    groupUserData:CommUserInfo[]; // 群成员信息
}
