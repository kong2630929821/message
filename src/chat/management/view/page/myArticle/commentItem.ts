import { copyToClipboard, popNew3 } from '../../../../../app/utils/tools';
import { popModalBoxs, popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { buildupImgPath, complaintUser } from '../../../../client/app/logic/logic';
import { parseEmoji } from '../../../../client/app/logic/tools';
import { commentLaud, delComment } from '../../../net/rpc';
import { getStore } from '../../../store/memstore';
import { popNewMessage, timestampFormat } from '../../../utils/logic';

interface Props {
    imgPc: string; // pc上的图片评论地址
    key:any;  // 帖子评论的key
    username:string;   // 评论用户
    avatar:string;
    likeCount:number;
    createtime:string;
    msg:string;   // 评论内容 文字加图片
    mess:string;   // 评论文字
    img:string;   // 图片
    imgIcon:string;// 图片缩略图
    orgName:string;  // 原评论用户
    orgMess:string;  // 原评论
    showUtils:boolean;  // 显示操作
    likeActive:boolean;  // 点赞
    gender: number;  // 性别 0 男 1 女
    owner:number; // 评论者的uid
    isMine:boolean;  // 是否本人
    timeFormat:Function; // 时间处理
    orgImg:string;// 原评论图片
    orgIcon:string;// 原评论图片缩略图
    buildupImgPath:Function; // 解析图片地址
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
        imgIcon:'',
        orgName:'用户1',
        orgMess:'',
        showUtils:false,
        likeActive:false,
        gender:0,
        owner:0,
        isMine:false,
        timeFormat:timestampFormat,
        orgImg:'',
        orgIcon:'',
        buildupImgPath:buildupImgPath,
        imgPc:''
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const val = props.msg ? JSON.parse(props.msg) :{ msg:'',img:'' };
        this.props.mess = parseEmoji(val.msg);
        if (val.img instanceof Array) {
            this.props.img = val.img.length ? buildupImgPath(val.img[0].compressImg) :'';
        } else {
            this.props.img = val.img;
        }
        
        // this.props.img = val.img ? val.img :'';
        // this.props.img = buildupImgPath(val.img);
        console.log(this.props.img);
        this.props.imgIcon = val.img.length ? buildupImgPath(val.img[0].compressImg) :'';
        this.props.isMine = this.props.owner === getStore('uid',0);
        this.props.avatar = buildupImgPath(props.avatar);
        if (props.reply) {  // 回复的原评论
            this.props.orgName = props.reply.username;
            const val = props.reply.msg ? JSON.parse(props.reply.msg) :{ msg:'',img:'' };
            this.props.orgMess = parseEmoji(val.msg);
            this.props.orgImg = val.img.length ? buildupImgPath(val.img[0].originalImg) :'';
            this.props.orgIcon = val.img.length ? buildupImgPath(val.img[0].compressImg) :'';
        }
    }
    public create() {
        super.create();
        this.props.showUtils = false;
    }
    /**
     * 展示操作
     */
    public showTools(e:any) {
        this.props.showUtils = !this.props.showUtils;
        notify(e.node,'ev-tools-expand',{ value:this.props.showUtils });
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
        this.closeUtils(e);
        popNew('chat-management-components-replyCommet',{ ...this.props,title:JSON.parse(this.props.msg).msg,orgId:true,key:this.props.key },(r) => {
            notify(e.node,'ev-comment-reply',{ ...this.props,key:r.key, value:r.value });
        });
    }

    /**
     * 删除评论
     */
    public delComment(e:any) {
        this.closeUtils(e);
        popModalBoxs('chat-management-components-confirmBox', { title:'删除评论',prompt:'删除评论后，评论下所有的回复都会被删除。',invalid: -1 },() => {
            delComment(this.props.key.num,this.props.key.post_id,this.props.key.id).then(r => {
                notify(e.node,'ev-comment-delete',{ key:this.props.key });
            });
        });
        
    }

    /**
     * 复制
     */
    public copyComment(e:any) {
        this.closeUtils(e);
        // 复制未解析的评论文字
        const val = this.props.msg ? JSON.parse(this.props.msg) :{ msg:'',img:'' };  
        copyToClipboard(val.msg);
        popNewMessage('复制成功');
    }

    // 关闭操作列表
    public closeUtils(e:any) {
        this.props.showUtils = false;
        notify(e.node,'ev-close',null);
        this.paint();
    }

    // 查看大图
    public lookBigImg() {
        popNew3('chat-client-app-view-imgSwiper-imgSwiper',{
            list:[this.props.orgImg],
            thumbnail:[this.props.orgIcon]
        });
    }

    public lookInfoImg() {
        popNew3('chat-client-app-view-imgSwiper-imgSwiper',{
            list:[this.props.img],
            thumbnail:[this.props.imgIcon]
        });
    }

    public goUserDetail(e:any) {
        popNew3('chat-client-app-view-info-userDetail', { uid: this.props.owner, num:this.props.key.num });
        notify(e.node,'ev-close',null);
    }
}