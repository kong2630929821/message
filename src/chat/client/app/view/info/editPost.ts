import { popNewLoading, popNewMessage } from '../../../../../app/utils/tools';
import { getKeyBoardHeight, popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore, setStore } from '../../data/store';
import { openCamera, selectImage } from '../../logic/native';
import { addPost } from '../../net/rpc';
import { base64ToFile, imgResize, uploadFile, arrayBuffer2File } from '../../net/upload';

interface IMAGE{
    compressImg:string;
    originalImg:any;  
}
interface Props {
    title:string;
    saveImgs:IMAGE[];   // 上传后的图片
    imgs:string[];   // 预览图片
    titleInput:string;  // 输入的标题
    contentInput:string; // 输入的内容
    isPublic:boolean;  // 发布公众号帖子
    isOnEmoji:boolean;  // 展开表情选择
    num:string; // 社区ID
    isUploading:boolean;// 正在上传图片
}

/**
 * 发布帖子
 */
export class EditPost extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:Props = {
        title:'发布动态',
        saveImgs:[],
        imgs:[],
        titleInput:'',
        contentInput:'',
        isPublic:false,
        isOnEmoji:false,
        num:'',
        isUploading:false
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
    
            // tslint:disable-next-line:no-this-assignment
            const this1 = this;
            const len = this.props.imgs.length;
            imagePicker.getContent({
                quality:10,
                success(buffer:ArrayBuffer) {
                    imgResize(buffer,(res) => {
                        const url =`<div style="background-image:url(${res.base64});height: 230px;width: 230px;" class="previewImg"></div>`;
                        this1.props.imgs[len] = url;
                        this1.paint();

                        uploadFile(base64ToFile(res.base64),(imgUrlSuf:string) => {
                            console.log('上传压缩图',imgUrlSuf);
                            const image:any = {}
                            image.compressImg = imgUrlSuf;

                            // 原图
                            imagePicker.getContent({
                                quality:100,
                                success(buffer1:ArrayBuffer) {
                                    
                                    uploadFile(arrayBuffer2File(buffer1),(imgurl:string) => {
                                        console.log('上传原图',imgurl);
                                        image.originalImg = imgurl;
                                        this1.props.saveImgs[len] = image;

                                        if(this.props.isUploading){
                                            this.props.isUploading = false;
                                            this.send();
                                        }
                                    })
                                }
                            });
                        });
                        
                    });
                }
            });
        });
    }

    /**
     * 打开照相机
     */
    public takePhoto(e:any) {
        const camera = openCamera((url) => {
            console.log('拍摄的图片',url);
    
            // tslint:disable-next-line:no-this-assignment
            const this1 = this;
            const len = this.props.imgs.length;
            camera.getContent({
                quality:10,
                success(buffer:ArrayBuffer) {
                    imgResize(buffer,(res) => {
                        const url = `<div style="background-image:url(${res.base64});height: 230px;width: 230px;" class="previewImg"></div>`;
                       
                        this1.props.imgs[len] = url;
                        this1.paint();

                        uploadFile(base64ToFile(res.base64),(imgUrlSuf:string) => {
                            console.log('上传压缩图',imgUrlSuf);
                            const image:any = {}
                            image.compressImg = imgUrlSuf;

                            // 原图
                            camera.getContent({
                                quality:100,
                                success(buffer1:ArrayBuffer) {
                                    
                                    uploadFile(arrayBuffer2File(buffer1),(imgurl:string) => {
                                        console.log('上传原图',imgurl);
                                        image.originalImg = imgurl;
                                        this1.props.saveImgs[len] = image;
                                        
                                        if(this.props.isUploading){
                                            this.props.isUploading = false;
                                            this.send();
                                        }
                                    })
                                }
                            });
                        });
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
    
    // 删除图片
    public delImage(ind:number) {
        this.props.imgs.splice(ind,1);
        this.props.saveImgs.splice(ind,1);
        this.paint();
    }

    // 发送
    public async send() {
        // 等待图片上传完成
        if (this.props.imgs.length !== this.props.saveImgs.length) {
            this.props.isUploading = true;

            return;
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
            imgs:this.props.saveImgs
        };

        if (!this.props.isUploading) {  // 图片上传完成
            addPost(this.props.titleInput,JSON.stringify(value),this.props.num).then(r => {
                popNewMessage('发布成功');
                this.ok && this.ok();
            }).catch(r => {
                popNewMessage('发布失败');
            });
        }
        
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