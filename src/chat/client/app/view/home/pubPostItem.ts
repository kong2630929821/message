import { popNew3 } from '../../../../../app/utils/tools';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    username:string;
    avatar:string;
    commentNum:number;
    likeNum:number;
    time:string;
    mess:string;
    showAll:boolean;  // 详情页面
    showUtils:boolean;  // 显示操作
    likeActive:boolean;  // 点赞
    followed:boolean;  // 已关注
    imgList:string[];  // 图片列表
    offical:boolean;  // 官方
    gender:number;  // 性别 0 男 1 女
}
/**
 * 广场帖子
 */
export class SquareItem extends Widget {
    public props:Props = {
        username:'用户名',
        avatar:'../../res/images/user_avatar.png',
        commentNum:0,
        likeNum:15,
        time:'3-12 10:24',
        mess:'哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
        showAll:false,
        showUtils:false,
        likeActive:false,
        followed:false,
        imgList:['','','',''],
        offical:false,
        gender:1   // 性别 0男 1女
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
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
        popNew3('chat-client-app-view-info-postDetail');
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
    public likeBtn() {
        this.props.likeActive = !this.props.likeActive;
        this.props.likeNum += this.props.likeActive ? 1 :-1;
        this.paint();
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
        popNew3('chat-client-app-view-person-publicHome');
    }
}