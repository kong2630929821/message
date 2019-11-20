import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore } from '../../data/store';
import { getFriendsInfo } from '../../logic/logic';
import { getFansList, getUserInfoByNum } from '../../net/rpc';

interface Props {
    uid:number;
    num:string;
    activeTab:number;
    followData:any[];  // 关注用户信息
    fansData:any[];   // 粉丝用户信息
    isMine:boolean;  // 是否本人
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
        isMine:false,
        blackList:[]
    };

    public create() {
        super.create();
        const sid = getStore('uid');
        const userinfo = getStore(`userInfoMap/${sid}`, {});
        const numsList = getStore(`followNumList/${sid}`,{ person_list:[],public_list:[]  });
        getUserInfoByNum(numsList.person_list).then((r:any[]) => {
            this.props.followData = r.filter(v => v.comm_info.num !== userinfo.comm_num);
            this.paint();
        });
        getFansList(userinfo.comm_num).then((r:string[]) => {
            getUserInfoByNum(r).then((res:string[]) => {
                this.props.fansData = res;  // 粉丝
                this.paint();
            });
        });

        // 获取黑名单数据
        const data = getStore('contactMap',[]);
        const blackList = data.size ? data.get(`${sid}`).blackList :[];
        const friends = getFriendsInfo().friends;
        friends.forEach(v => {
            if (blackList.indexOf(v.uid) !== -1) {
                const avatar = v.avatar;
                const note = v.note ? v.note :'没有简介';
                this.props.blackList.push({
                    user_info:{
                        uid:v.uid,
                        avatar:avatar,
                        name:v.name,
                        desc:note,
                        sex:v.gender   // 性别 0男 1女
                    },
                    comm_info:{
                        num:'',
                        comm_type:1
                    }
                });
            }
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