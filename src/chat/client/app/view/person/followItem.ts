import { popModalBoxs, popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { CommType } from '../../../../server/data/rpc/community.s';
import { getStore } from '../../data/store';
import { buildupImgPath, judgeFollowed } from '../../logic/logic';
import { follow } from '../../net/rpc';

interface Props {
    avatar:string;   // 头像
    followed:boolean; // 已关注
    offical:boolean;  // 官方
    isPublic:boolean; // 公众号文章
    isMine:boolean;   // 是否本人
    status:number; // 0 我的关注 1我的粉丝 2群成员 3黑名单 4创建群组选择用户
    data:object;  // 用户信息
    checked:boolean;// 是否选中
}

/**
 * 粉丝 关注公众号
 */
export class FoolowItem extends Widget {
    public props:Props = {
        data:{
            user_info:{
                uid:0,
                avatar:'../../res/images/user_avatar.png',
                name:'用户1',
                desc:'这个人的简介很长的话我要藏一点这个人的简介很长的话我要藏一点这个人的简介很长的话我要藏一点',
                sex:1   // 性别 0男 1女
            },
            comm_info:{
                num:'',
                comm_type:0
            }
        },
        avatar:'',
        followed:true,
        offical:false,
        isPublic:false,
        isMine:false,
        status:-1,
        checked:false
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const sid = getStore('uid',0);
        this.props.avatar = buildupImgPath(this.props.data.user_info.avatar) || '../../res/images/user_avatar.png';
        this.props.followed = judgeFollowed(this.props.data.comm_info.num);
        this.props.isPublic = this.props.data.comm_info.comm_type === CommType.publicAcc;
        this.props.offical = this.props.data.comm_info.comm_type === CommType.official;
        this.props.isMine = this.props.data.user_info.uid === sid;
        this.props.checked = this.props.isMine ? true :false;
    }

    /**
     * 关注用户
     */
    public followUser() {
        if (this.props.followed) {
            popModalBoxs('chat-client-app-widget-modalBox-modalBox', { title:'取消关注',content:'确定取消关注？' },() => {
                follow(this.props.data.comm_info.num).then(r => {
                    this.props.followed = !this.props.followed;
                    this.paint();
                }).catch(err => {
                    console.log(err);
                });
            });
        } else {
            follow(this.props.data.comm_info.num).then(r => {
                this.props.followed = !this.props.followed;
                this.paint();
            }).catch(err => {
                console.log(err);
            });
        }
        
    }

    // 选择或取消
    public checkOne(e:any) {
        this.props.checked = !this.props.checked; 
        this.paint();
        notify(e.node,'ev-checked',{ fg:this.props.checked }); 
    }

    // 去聊天
    public goChat() {
        popNew('chat-client-app-view-chat-chat', { id: this.props.data.user_info.uid, chatType: GENERATOR_TYPE.USER });
    }

    // 移出用户
    public removeUser(e:any) {
        notify(e.node,'ev-remove-user',{ value: this.props.data.user_info.uid }); 
    }

    // 查看详情
    public goDetail(e:any) {
        notify(e.node,'ev-goDetail-user',{ value: this.props.data.user_info.uid }); 
    }
}