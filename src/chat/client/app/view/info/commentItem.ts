import { popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    username:string;   // 评论用户
    avatar:string;
    likeCount:number;
    createtime:string;
    msg:string;   // 评论内容
    orgName:string;  // 原评论用户
    orgMess:string;  // 原评论
    showUtils:boolean;  // 显示操作
    likeActive:boolean;  // 点赞
    gender: number;  // 性别 0 男 1 女
}

/**
 * 评论
 */
export class CommentItem extends Widget {
    public props:Props = {
        username:'用户名',
        avatar:'../../res/images/user_avatar.png',
        likeCount:15,
        createtime:'3-12 10:24',
        msg:'',
        orgName:'用户1',
        orgMess:'',
        showUtils:false,
        likeActive:false,
        gender:0
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
    public likeBtn(e:any) {
        notify(e.node,'ev-comment-likeBtn',null);
       
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