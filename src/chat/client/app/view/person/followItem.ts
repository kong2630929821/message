import { popModalBoxs } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { CommType } from '../../../../server/data/rpc/community.s';
import { getStore } from '../../data/store';
import { buildupImgPath, judgeFollowed } from '../../logic/logic';
import { follow } from '../../net/rpc';

interface Props {
    comm_info: any;  // 社区基础信息
    user_info:any;   // 用户基础信息
    avatar:string;   // 头像
    followed:boolean; // 已关注
    offical:boolean;  // 官方
    isPublic:boolean; // 公众号文章
    isMine:boolean;   // 是否本人
}

/**
 * 粉丝 关注公众号
 */
export class FoolowItem extends Widget {
    public props:Props = {
        user_info:{
            uid:0,
            avatar:'../../res/images/user_avatar.png',
            name:'用户1',
            desc:'这个人的简介很长的话我要藏一点这个人的简介很长的话我要藏一点这个人的简介很长的话我要藏一点',
            sex:1   // 性别 0男 1女
        },
        comm_info:{
            num:'',
            comm_type:1
        },
        avatar:'',
        followed:true,
        offical:false,
        isPublic:false,
        isMine:false
    };

    public setProps(props:any) {
        super.setProps(props);
        const sid = getStore('uid',0);
        this.props.avatar = buildupImgPath(this.props.user_info.avatar) || '../../res/images/user_avatar.png';
        this.props.followed = judgeFollowed(this.props.comm_info.num);
        this.props.isPublic = this.props.comm_info.comm_type === CommType.publicAcc;
        this.props.offical = this.props.comm_info.comm_type === CommType.official;
        this.props.isMine = this.props.user_info.uid === sid;
    }

    /**
     * 关注用户
     */
    public followUser() {
        if (this.props.followed) {
            popModalBoxs('chat-client-app-widget-modalBox-modalBox', { title:'取消关注',content:'确定取消关注？' },() => {
                follow(this.props.comm_info.num).then(r => {
                    this.props.followed = !this.props.followed;
                    this.paint();
                });
            });
        } else {
            follow(this.props.comm_info.num).then(r => {
                this.props.followed = !this.props.followed;
                this.paint();
            });
        }
        
    }
}