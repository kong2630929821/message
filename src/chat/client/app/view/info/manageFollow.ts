import { Widget } from '../../../../../pi/widget/widget';
interface Props {
    avatar:string;
    username:string;
    desc:string;  // 简介
}
/**
 * 管理关注
 */
export class ManageFollow extends Widget {
    public ok:() => void;
    public props:Props = {
        avatar:'../../res/images/user_avatar.png',
        username:'用户1',
        desc:'这个人的简介很长的话我要藏一点这个人的简介很长的话我要藏一点这个人的简介很长的话我要藏一点'
    };

    public goBack() {
        this.ok && this.ok();
    }
}
