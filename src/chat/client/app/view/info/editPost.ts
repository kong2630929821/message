import { getKeyBoardHeight, popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    title:string;
    contentInput:string;
    imgs:string[];
    titleInput:string;  // 输入的标题
    isPublic:boolean;  // 发布公众号帖子
    isOnEmoji:boolean;  // 展开表情选择
}

/**
 * 发布帖子
 */
export class EditPost extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:Props = {
        title:'发布动态',
        contentInput:'',
        imgs:['../../res/images/home_bg.png'],
        titleInput:'',
        isPublic:false,
        isOnEmoji:false
    };
    
    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        if (props.isPublic) {
            this.props.title = '发布公众号消息';
        }
    }

    public close() {
        popNew('chat-client-app-widget-modalBox-modalBox',{ content:'保留此次编辑' },() => {
            this.cancel && this.cancel();
        },() => {
            this.cancel && this.cancel();
        });
    }

    public send() {
        this.ok && this.ok();
    }

    // 打开表情包图库
    public openEmoji() {
        document.getElementById('emojiMap').style.height = `${getKeyBoardHeight() + 90}px`;
        this.props.isOnEmoji = !this.props.isOnEmoji;
        this.paint();
    }
}