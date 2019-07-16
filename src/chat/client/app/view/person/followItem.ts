import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    avatar:string;
    username:string;
    desc:string;  // 简介
    followed:boolean;  // 已关注
}

/**
 * 粉丝 关注公众号
 */
export class FoolowItem extends Widget {
    public props:Props = {
        avatar:'../../res/images/user_avatar.png',
        username:'用户1',
        desc:'这个人的简介很长的话我要藏一点这个人的简介很长的话我要藏一点这个人的简介很长的话我要藏一点',
        followed:true
    };

}