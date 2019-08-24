import { popNewLoading, popNewMessage } from '../../../../../app/utils/tools';
import { getKeyBoardHeight, popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore, setStore } from '../../data/store';
import { selectImage } from '../../logic/native';
import { addPost } from '../../net/rpc';
import { base64ToFile, imgResize, uploadFile } from '../../net/upload';

interface Props {
    title:string;
    imgs:string[];
    titleInput:string;  // 输入的标题
    contentInput:string; // 输入的内容
    isPublic:boolean;  // 发布公众号帖子
    isOnEmoji:boolean;  // 展开表情选择
    num:string; // 社区ID
}

/**
 * 发布帖子
 */
export class EditPost extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:Props = {
        title:'发布动态',
        imgs:[],
        titleInput:'',
        contentInput:'',
        isPublic:false,
        isOnEmoji:false,
        num:''
    };
    
    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        let data = null;
        if (props.isPublic) {
            data = getStore('postDraft', null);
            this.props.title = '发布公众号消息';
        } else {
            data = getStore('pubPostDraft', null);
        }
        // 有草稿则赋值
        if (data) this.props = data;
        this.props.isOnEmoji = false;

        const uid = getStore('uid',0);
        if (props.isPublic) {
            this.props.num = getStore('pubNum',0);
        } else {
            this.props.num = props.num || getStore(`userInfoMap/${uid}`,{}).comm_num ;
        }
    }

    // 标题
    public titleChange(e:any) {
        this.props.titleInput = e.value;
    }

    // 内容
    public contentChange(e:any) {
        this.props.contentInput = e.value;
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
                        this.props.imgs.push(res.base64);
                    });
                        
                }
            });
        });
    }

    // 关闭
    public close() {
        // 有内容时提醒保存草稿
        if (this.props.titleInput || this.props.contentInput || this.props.imgs.length > 0) {
            popNew('chat-client-app-widget-modalBox-modalBox',{ content:'保留此次编辑' },() => {
                if (this.props.isPublic) {
                    setStore('postDraft',this.props);
                } else {
                    setStore('pubPostDraft',this.props);
                }
                this.cancel && this.cancel();

            },() => {
                if (this.props.isPublic) {
                    setStore('postDraft',null);
                } else {
                    setStore('pubPostDraft',null);
                }
                this.cancel && this.cancel();
            });

        } else {
            if (this.props.isPublic) {
                setStore('postDraft',null);
            } else {
                setStore('pubPostDraft',null);
            }
            this.cancel && this.cancel();
        }
    }
    
    // 上传图片
    public async sendImage(i:number) {
        if (i < this.props.imgs.length) {
            await uploadFile(base64ToFile(this.props.imgs[i]),(imgUrlSuf:string) => {
                this.props.imgs[i] = imgUrlSuf;
                this.sendImage(i++);
                console.log('上传图片',i,imgUrlSuf);
            });
        } 
    }

    // 发送
    public async send() {
        if (this.props.imgs.length) {
            const loadding = popNewLoading('图片上传中');
            try {
                await this.sendImage(0);
            } catch (err) {
                popNewMessage('上传图片失败了');
            }
            loadding.callback(loadding.widget);
        }
        
        if (this.props.isPublic && !this.props.titleInput) {
            popNewMessage('标题不能为空');

            return;
        }
        if (!this.props.contentInput) {
            popNewMessage('内容不能为空');

            return;
        }
        const value = {
            msg:this.props.contentInput,
            imgs:this.props.imgs
        };
        addPost(this.props.titleInput,JSON.stringify(value),this.props.num).then(r => {
            popNewMessage('发布成功');
            this.ok && this.ok();
        }).catch(r => {
            popNewMessage('发布失败');
        });
        
    }

    // 打开表情包图库
    public openEmoji() {
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
}