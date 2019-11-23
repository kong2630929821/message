import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore } from '../../data/store';
import { getUserInfoByNum } from '../../net/rpc';

interface Props {
    uid:number;
    num:string;
    activeTab:number;
    followData:any[];  // 关注用户信息
    fansData:any[];   // 粉丝用户信息
    groupList:string[]; // 群组
    blackList:any[];// 黑名单
}

/**
 * 个人主页
 */
export class AddressBook extends Widget {
    public ok:() => void;
    public props:Props = {
        uid:0,
        num:'',
        activeTab:0,
        followData:[],
        fansData:[],
        groupList:[],
        blackList:[]
    };

    public create() {
        super.create();
        const sid = getStore('uid');
        const userinfo = getStore(`userInfoMap/${sid}`, {});
        const numsList = getStore(`followNumList/${sid}`,{ person_list:[],public_list:[]  });
        const fansList = getStore(`fansNumList/${userinfo.comm_num}`,{ list:[] });
        
        // 获取关注列表
        getUserInfoByNum(numsList.person_list).then((r:any[]) => {
            this.props.followData = r.filter(v => v.comm_info.num !== userinfo.comm_num);
            this.paint();
        }).catch(err => {
            // 
        });

        // 获取粉丝列表
        getUserInfoByNum(fansList.list).then((res:string[]) => {
            this.props.fansData = res;  // 粉丝
            this.paint();
        }).catch(err => {
            // 
        });

        const contact = getStore(`contactMap/${sid}`,{ blackList:[],group:[] });
        this.props.groupList = contact.group;
        // 获取黑名单数据
        const blackList = contact.blackList;
        blackList.forEach(v => {
            const user = getStore(`userInfoMap/${v}`, {});
            this.props.blackList.push({
                user_info:{
                    uid:user.uid,
                    avatar:user.avatar,
                    name:user.name,
                    desc:user.note || '没有简介',
                    sex:user.gender   // 性别 0男 1女
                },
                comm_info:{
                    num:'',
                    comm_type:1
                }
            });
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

}