import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    username:string;   // 评论用户
    avatar:string;
    likeNum:number;
    time:string;
    mess:string;   // 评论内容
    orgName:string;  // 原评论用户
    orgMess:string;  // 原评论
    showUtils:boolean;  // 显示操作
    likeActive:boolean;  // 点赞
}

/**
 * 评论
 */
export class CommentItem extends Widget {
    public props:Props = {
        username:'用户名',
        avatar:'../../res/images/user_avatar.png',
        likeNum:15,
        time:'3-12 10:24',
        mess:'Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum. Duis ncidunt urna non pretium porta. Nam vitae ligula vel on pr Nam vitae ligula vel on pr',
        orgName:'用户1',
        orgMess:'Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum. Duis ncidunt urna non pretium porta. Nam vitae ligula vel on pr Nam vitae ligula vel on pr',
        showUtils:false,
        likeActive:false
    };

    /**
     * 展示操作
     */
    public showTools() {
        this.props.showUtils = !this.props.showUtils;
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
     * 回复
     */
    public replay() {
        this.closeUtils();
        popNew('chat-client-app-view-info-editComment',{ title:'回复',showOrg:true });
    }

    // 关闭操作列表
    public closeUtils() {
        this.props.showUtils = false;
        this.paint();
    }
}