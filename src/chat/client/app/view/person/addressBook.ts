import { popNewMessage } from '../../../../../app/utils/pureUtils';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { CommUserInfo } from '../../../../server/data/rpc/community.s';
import { removeFromBlackList } from '../../../../server/data/rpc/user.p';
import { getStore, register } from '../../data/store';
import { clientRpcFunc } from '../../net/init';
import { getUserInfoByNum, getUserInfoByUid } from '../../net/rpc';

export const forelet = new Forelet();

interface Props {
    uid:number;
    num:string;
    activeTab:number;
    followData:any[];  // 关注用户信息
    fansData:any[];    // 粉丝用户信息
    blackList:any[];   // 黑名单
}

/**
 * 个人主页
 */
export class AddressBook extends Widget {
    public ok:() => void;
    public state:number[] = [];  // 群组列表
    public props:Props = {
        uid:0,
        num:'',
        activeTab:0,
        followData:[],
        fansData:[],
        blackList:[]
    };

    public create() {
        super.create();
        const sid = getStore('uid');
        const userinfo = getStore(`userInfoMap/${sid}`, {});
        const numsList = getStore(`followNumList/${sid}`,{ person_list:[] });
        const fansList = getStore(`fansNumList/${userinfo.comm_num}`,{ list:[] });
        const contact = getStore(`contactMap/${sid}`,{ blackList:[],group:[] });
        
        // 群组列表
        this.state = contact.group;
        
        // 获取关注列表
        getUserInfoByNum(numsList.person_list).then((res:CommUserInfo[]) => {
            this.props.followData = res;
            this.paint();
        }).catch(err => {
            console.log('获取关注列表失败：',err);
        });

        // 获取粉丝列表
        getUserInfoByNum(fansList.list).then((res:CommUserInfo[]) => {
            this.props.fansData = res;  // 粉丝
            this.paint();
        }).catch(err => {
            console.log('获取粉丝列表失败：',err);
        });

        // 获取黑名单数据
        getUserInfoByUid(contact.blackList).then((res:CommUserInfo[]) => {
            this.props.blackList = res;  // 粉丝
            this.paint();
        }).catch(err => {
            console.log('获取黑名单列表失败：',err);
        });
    }

    public changeTab(i:number) {
        this.props.activeTab = i;
        this.paint();
    }

    public goBack() {
        this.ok && this.ok();
    }

    public createGroup() {
        popNew('chat-client-app-view-group-setGroupChat');
    }

    // 将用户移出黑名单
    public removeUser(e:any) {
        if (!e.value) return;
        clientRpcFunc(removeFromBlackList, e.value, (res) => {
            console.log('removeUser',res);
            if (res && res.r === 1) {
                const index = this.props.blackList.findIndex(v => v.user_info.uid === e.value);
                if (index >= 0) {
                    this.props.blackList.splice(index,1);
                    this.paint();
                }
                popNewMessage('移出黑名单');
            }
        });
    }
    
}

register('contactMap', r => {
    for (const value of r.values()) {
        forelet.paint(value.group);
    }
});