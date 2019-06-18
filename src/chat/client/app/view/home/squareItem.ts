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
        likeActive:false
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
        popNew3('chat-client-app-view-info-editComment');
    }

}