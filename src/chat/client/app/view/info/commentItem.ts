import { popNewMessage } from '../../../../../app/utils/tools';
import { popModalBoxs, popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore } from '../../data/store';
import { buildupImgPath, complaintUser, copyToClipboard, timestampFormat } from '../../logic/logic';
import { commentLaud, delComment } from '../../net/rpc';
import { parseEmoji } from '../home/square';

interface Props {
    key:any;  // 帖子评论的key
    username:string;   // 评论用户
    avatar:string;
    likeCount:number;
    createtime:string;
    msg:string;   // 评论内容 文字加图片
    mess:string;   // 评论文字
    img:string;   // 图片
    orgName:string;  // 原评论用户
    orgMess:string;  // 原评论
    showUtils:boolean;  // 显示操作
    likeActive:boolean;  // 点赞
    gender: number;  // 性别 0 男 1 女
    owner:number; // 评论者的uid
    isMine:boolean;  // 是否本人
    timeFormat:any; // 时间处理
}

/**
 * 评论
 */
export class CommentItem extends Widget {
    public props:Props = {
        key:{
            num:'',
            post_id:0,
            id:0
        },
        username:'用户名',
        avatar:'../../res/images/user_avatar.png',
        likeCount:15,
        createtime:'3-12 10:24',
        msg:'',
        mess:'',
        img:'',
        orgName:'用户1',
        orgMess:'',
        showUtils:false,
        likeActive:false,
        gender:0,
        owner:0,
        isMine:false,
        timeFormat:timestampFormat
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const val = props.msg ? JSON.parse(props.msg) :{ msg:'',img:'' };
        this.props.mess = parseEmoji(val.msg);
        this.props.img = val.img; 
        this.props.isMine = this.props.owner === getStore('uid',0);
        this.props.avatar = buildupImgPath(props.avatar);

        if (props.reply) {  // 回复的原评论
            this.props.orgName = props.reply.username;
            const val = props.reply.msg ? JSON.parse(props.reply.msg) :{ msg:'',img:'' };
            this.props.orgMess = parseEmoji(val.msg);
        }
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
    public replyComment(e:any) {
        this.closeUtils();
        popNew('chat-client-app-view-info-editComment',{ ...this.props,title:'回复',orgId:true },(r) => {
            notify(e.node,'ev-comment-reply',{ ...this.props,key:r.key, value:r.value });
        });
    }

    /**
     * 删除评论
     */
    public delComment(e:any) {
        this.closeUtils();
        popModalBoxs('chat-client-app-widget-modalBox-modalBox', { title:'删除评论',content:'删除评论后，评论下所有的回复都会被删除。' },() => {
            delComment(this.props.key.num,this.props.key.post_id,this.props.key.id).then(r => {
                notify(e.node,'ev-comment-delete',{ key:this.props.key });
            });
        });
        
    }

    /**
     * 复制
     */
    public copyComment() {
        this.closeUtils();
        // 复制未解析的评论文字
        const val = this.props.msg ? JSON.parse(this.props.msg) :{ msg:'',img:'' };  
        copyToClipboard(val);
        popNewMessage('复制成功');
    }

    /**
     * 举报
     */
    public complaint() {
        this.closeUtils();
        complaintUser(`${this.props.username} 的内容`,this.props.gender,this.props.avatar,this.props.msg);
    }

    // 关闭操作列表
    public closeUtils() {
        this.props.showUtils = false;
        this.paint();
    }
}