import { popNew3 } from '../../../../../app/utils/tools';
import { notify } from '../../../../../pi/widget/event';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { follow } from '../../net/rpc';

interface Props {
    key:any;   // 帖子ID及社区编号
    username:string;
    avatar:string;
    commentCount:number;  // 评论数量
    likeCount:number;   // 点赞数量
    createtime:string;      // 创建时间
    content:string;     // 内容
    showAll:boolean;  // 详情页面
    showUtils:boolean;  // 显示操作
    likeActive:boolean;  // 点赞
    followed:boolean;  // 已关注
    imgs:string[];  // 图片列表
    offical:boolean;  // 官方
    gender:number;  // 性别 0 男 1 女
    comm_type:number; // 社区类型
}
/**
 * 广场帖子
 */
export class SquareItem extends Widget {
    public props:Props = {
        key:{
            id:0,
            num:''
        },
        username:'用户名',
        avatar:'',
        commentCount:0,
        likeCount:15,
        createtime:'',
        content:'',
        showAll:false,
        showUtils:false,
        likeActive:false,
        followed:false,
        imgs:[],
        offical:false,
        gender:1,   // 性别 0男 1女
        comm_type:0
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.props.avatar = props.avatar || '../../res/images/user_avatar.png';
    }

    public attach() {
        super.attach();
        const content = getRealNode(this.tree).querySelector('div.content');
        if (content && content.clientHeight > 120) {
            (<any>content).style.display = '-webkit-box';
            content.querySelector('span').style.display = 'block';
        }
    }

    /**
     * 查看详情
     */
    public goDetail() {
        this.props.showUtils = false;
        this.paint();
        popNew3('chat-client-app-view-info-postDetail',{ ...this.props,showAll:true });
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
        notify(e.node,'ev-likeBtn',{ value:this.props.key });
    }

    /**
     * 评论
     */
    public doComment() {
        this.closeUtils();
        popNew3('chat-client-app-view-info-editComment');
    }

    // 关闭操作列表
    public closeUtils() {
        this.props.showUtils = false;
        this.paint();
    }

    /**
     * 查看用户详情
     */
    public goUserDetail() {
        popNew3('chat-client-app-view-info-userDetail');
    }

    /**
     * 关注用户
     */
    public followUser() {
        follow(this.props.key.num).then(r => {
            this.props.followed = true;
            this.paint();
        });
    }
}
