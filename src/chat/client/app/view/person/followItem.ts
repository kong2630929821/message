import { Widget } from '../../../../../pi/widget/widget';
import { CommType } from '../../../../server/data/rpc/community.s';
import { getStore } from '../../data/store';

interface Props {
    avatar:string;
    name:string;
    desc:string;  // 简介
    followed:boolean;  // 已关注
    num:string; // 社区ID
    offical:boolean;  // 官方
    isPublic:boolean; // 公众号文章
    gender:number;  // 性别 0 男 1 女
    comm_type:number;  // 社区类型
}

/**
 * 粉丝 关注公众号
 */
export class FoolowItem extends Widget {
    public props:Props = {
        avatar:'../../res/images/user_avatar.png',
        name:'用户1',
        desc:'这个人的简介很长的话我要藏一点这个人的简介很长的话我要藏一点这个人的简介很长的话我要藏一点',
        followed:true,
        num:'',
        offical:false,
        isPublic:false,
        gender:1,   // 性别 0男 1女
        comm_type:1
    };

    public setProps(props:any) {
        super.setProps(props);
        const sid = getStore('uid',0);
        const numsList = getStore(`followNumList/${sid}`,{ person_list:[],public_list:[]  });
        const followList = numsList.person_list.concat(numsList.public_list);
        this.props.followed = followList.indexOf(this.props.num) > -1;
        this.props.isPublic = this.props.comm_type === CommType.person;
        this.props.offical = this.props.comm_type === CommType.official;
    }

}