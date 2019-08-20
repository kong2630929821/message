import { popNewMessage } from '../../../../../app/utils/tools';
import { popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { copyToClipboard } from '../../logic/logic';
import { commentLaud } from '../../net/rpc';

interface Props {
    key:any;  // 帖子评论的key
    username:string;   // 评论用户
    avatar:string;
    likeCount:number;
    createtime:string;
    mess:string;   // 评论内容
    img:string;   // 图片
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
        key:{},
        username:'用户名',
        avatar:'../../res/images/user_avatar.png',
        likeCount:15,
        createtime:'3-12 10:24',
        mess:'',
        img:'',
        orgName:'用户1',
        orgMess:'',
        showUtils:false,
        likeActive:false,
        gender:0
    };

    public setProps(props:any) {
        super.setProps(props);
        const val = props.msg ? JSON.parse(props.msg) :{ msg:'',img:'' };
        this.props.mess = val.msg;
        this.props.img = val.img; 
    }

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
        this.props.likeActive = !this.props.likeActive;
        this.props.likeCount += this.props.likeActive ? 1 : -1;
        this.paint();
        commentLaud(this.props.key.num, this.props.key.post_id, this.props.key.id, () => {
            this.props.likeActive = !this.props.likeActive;
            this.props.likeCount += this.props.likeActive ? 1 : -1;
            this.paint();
        });
    }

    /**
     * 回复
     */
    public replay(e:any) {
        this.closeUtils();
        popNew('chat-client-app-view-info-editComment',{ ...this.props,title:'回复',orgId:true },(r) => {
            notify(e.node,'ev-comment-reply',{ ...this.props,key:r.key, value:r.value });
        });
    }

    /**
     * 删除评论
     */
    public delComment() {
        this.closeUtils();
    }

    /**
     * 复制
     */
    public copyComment() {
        copyToClipboard(this.props.mess);
        popNewMessage('复制成功');
    }

    /**
     * 举报
     */
    public complaint() {
        // TODO
    }

    // 关闭操作列表
    public closeUtils() {
        this.props.showUtils = false;
        this.paint();
    }
}