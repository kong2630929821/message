import { popNewMessage } from '../../../../../app/utils/tools';
import { getKeyBoardHeight } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { selectImage } from '../../logic/native';
import { addComment } from '../../net/rpc';
import { base64ToFile, imgResize, uploadFile } from '../../net/upload';

interface Props {
    key:any;
    title:string;
    placeholder:string;
    contentInput:string;
    avatar:string;
    username:string;
    mess:string;  // 回复的评论内容
    isOnEmoji:boolean; // 是否展开表情库
    img:string;  // 可选择一张图片
}

/**
 * 评论或回复
 */
export class EditComment extends Widget {
    public ok:(msg:any) => void;
    public cancel:() => void;
    public props:Props = {
        key:{},
        title:'评论',
        placeholder:'说说心得',
        contentInput:'',
        avatar:'../../res/images/user_avatar.png',
        username:'用户2',
        mess:'',
        isOnEmoji:false,
        img:''
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    public close() {
        this.cancel && this.cancel();
    }

    /**
     * 输入评论
     */
    public contentChange(e:any) {
        this.props.contentInput = e.value;
        this.paint();
    }

    public send() {
        const value = {
            msg:this.props.contentInput,
            img:this.props.img
        };
        const postId = this.props.key.post_id || this.props.key.id;   // 评论帖子时id表示帖子ID
        const reply = this.props.key.post_id ? this.props.key.id :0;  // 回复评论时post_id表示帖子ID
        addComment(this.props.key.num, postId, JSON.stringify(value), reply, 0).then(r => {
            this.ok && this.ok({ key:r, value:JSON.stringify(value) });
        }).catch(r => {
            popNewMessage('评论失败了');
        });
    }

    // 打开表情包图库
    public openEmoji(e:any) {
        document.getElementById('emojiMap').style.height = `${getKeyBoardHeight() + 90}px`;
        this.props.isOnEmoji = !this.props.isOnEmoji;
        this.paint();
    }
    
    /**
     * 选择表情
     */
    public pickEmoji(emoji:any) {
        this.props.contentInput += `[${emoji}]`; // 只能在内容中加表情
        this.paint();
    }

    /**
     * 选择图片
     */
    public chooseImage(e:any) {
        const imagePicker = selectImage((width, height, url) => {
            console.log('选择的图片',width,height,url);
    
            imagePicker.getContent({
                quality:30,
                success(buffer:ArrayBuffer) {
                    imgResize(buffer,(res) => {
                        this.props.img = res.base64;
                        this.paint();

                        uploadFile(base64ToFile(this.props.img),(imgUrlSuf:string) => {
                            this.props.img = imgUrlSuf;
                            this.paint();
                            console.log('上传图片',imgUrlSuf);
                        });
                    });
                }
            });
        });
    }

}