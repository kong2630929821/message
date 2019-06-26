import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    username:string;
    avatar:string;
    title:string;     // 标题
    time:string;
    mess:string;
    num:number[];
    active:string;
    commentNum:number;
    likeNum:number;
    likeActive:boolean;  // 点赞
    isPublic:boolean;   // 是否公众号发布的帖子
}
const TAB = {
    comment:'comment',
    like:'like'
};
/**
 * 广场帖子详情
 */
export class PostDetail extends Widget {
    public ok:() => void;
    public props:Props = {
        username:'用户名',
        avatar:'../../res/images/user_avatar.png',
        title:'详情',
        time:'3-12 10:24',
        mess:'Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum. Duis ncidunt urna non pretium porta. Nam vitae ligula vel on pr Nam vitae ligula vel on pr',
        num:[0,0,15],
        active:TAB.comment,
        commentNum:0,
        likeNum:15,
        likeActive:false,
        isPublic:true
    };

    public goBack() {
        this.ok && this.ok();
    }

    public changeTab(tab:string) {
        this.props.active = tab;
        this.paint();
    }
    
    /**
     * 点赞
     */
    public likeBtn() {
        this.props.likeActive = !this.props.likeActive;
        this.props.likeNum += this.props.likeActive ? 1 :-1;
        this.paint();
    }

    /**
     * 评论
     */
    public doComment() {
        popNew('chat-client-app-view-info-editComment');
    }
}