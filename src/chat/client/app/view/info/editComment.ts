import { getKeyBoardHeight } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { selectImage } from '../../logic/native';
import { popNewMessage } from '../../logic/tools';
import { addComment } from '../../net/rpc';
import { arrayBuffer2File, base64ToFile, imgResize, uploadFile } from '../../net/upload';

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
    uploadLoding:any;
    imgs:any;
    isUploading:boolean;
    saveImgs:any;
    showType:boolean[];// 0表情 1相册 2相机
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
        img:'',
        imgs:[],
        isUploading:false,
        uploadLoding:[],
        saveImgs:[],
        showType:[true,true,true]
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
        // 等待图片上传完成
        if (this.props.imgs.length !== this.props.saveImgs.length) {
            this.props.isUploading = true;
        
            return;
        }
        const value = {
            msg:this.props.contentInput,
            img:this.props.saveImgs
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
        this.reaset(0);
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
    // 删除图片
    public delImage(ind:number) {
        this.props.imgs.splice(ind,1);
        this.props.saveImgs.splice(ind,1);
        this.props.uploadLoding.splice(ind,1);
        this.paint();
    }
    /**
     * 选择图片
     */
    public chooseImage(e:any) {
        this.reaset(1);
        if (this.props.uploadLoding.length >= 1) {
            return;
        }
        const imagePicker = selectImage((width, height, url) => {
            console.log('选择的图片',width,height,url);
            if (!url) {

                return;
            }
            // tslint:disable-next-line:no-this-assignment
            const this1 = this;
            const len = this.props.uploadLoding.length;
            this.props.uploadLoding[len] = true;
            imagePicker.getContent({
                quality:10,
                success(buffer:ArrayBuffer) {
                    imgResize(buffer,0.3,200,(res) => {
                        const url = `<div style="background-image:url(${res.base64});height: 230px;width: 230px;background-size: cover;" class="previewImg"></div>`;
                        this1.props.uploadLoding[len] = false;
                        this1.props.imgs[len] = url;
                        this1.paint();

                        uploadFile(base64ToFile(res.base64),(imgUrlSuf:string) => {
                            console.log('上传压缩图',imgUrlSuf);
                            const image:any = {};
                            image.compressImg = imgUrlSuf;

                            // 原图
                            imagePicker.getContent({
                                quality:100,
                                success(buffer1:ArrayBuffer) {
                                    imgResize(buffer1,0.8,1024,(res1) => {
                                        uploadFile(base64ToFile(res1.base64),(imgurl:string) => {
                                            console.log('上传原图',imgurl);
                                            image.originalImg = imgurl;
                                            this1.props.uploadLoding[len] = false;
                                            this1.paint();
                                            this1.props.saveImgs[len] = image;
                                            if (this1.props.isUploading) {
                                                this1.props.isUploading = false;
                                            }
                                        });
                                    });
                                }
                            });
                        });
                        
                    });
                }
            });
            this.paint();
        });
    }

    // 删除
    public remove() {
        this.props.img = '';
        this.paint();
    }

    /**
     * 
     * @param index 状态管理  showType的下标
     */
    public reaset(index:number) {
        this.props.showType = [true,true,true];
        if (index === 0) {
            this.props.showType[index] = this.props.isOnEmoji;
        } else {
            this.props.showType[index] = false;
        }
        this.paint();
    }

}