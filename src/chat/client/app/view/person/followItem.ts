import { Widget } from '../../../../../pi/widget/widget';
import { CommType } from '../../../../server/data/rpc/community.s';
import { getStore } from '../../data/store';
import { follow } from '../../net/rpc';

interface Props {
    comm_info: any;
    user_info:any;
    followed:boolean;  // 已关注
    offical:boolean;  // 官方
    isPublic:boolean; // 公众号文章
}

/**
 * 粉丝 关注公众号
 */
export class FoolowItem extends Widget {
    public props:Props = {
        user_info:{
            avatar:'../../res/images/user_avatar.png',
            name:'用户1',
            desc:'这个人的简介很长的话我要藏一点这个人的简介很长的话我要藏一点这个人的简介很长的话我要藏一点',
            sex:1   // 性别 0男 1女
        },
        comm_info:{
            num:'',
            comm_type:1
        },
        followed:true,
        offical:false,
        isPublic:false
       
    };

    public setProps(props:any) {
        super.setProps(props);
        const sid = getStore('uid',0);
        const numsList = getStore(`followNumList/${sid}`,{ person_list:[],public_list:[]  });
        const followList = numsList.person_list.concat(numsList.public_list);
        this.props.followed = followList.indexOf(this.props.comm_info.num) > -1;
        this.props.isPublic = this.props.comm_info.comm_type === CommType.person;
        this.props.offical = this.props.comm_info.comm_type === CommType.official;
    }

    /**
     * 关注用户
     */
    public followUser() {
        follow(this.props.comm_info.num).then(r => {
            this.props.followed = !this.props.followed;
            this.paint();
        });
    }
}