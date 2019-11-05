import { sourceIp } from '../../../../../app/public/config';
import { popNewMessage } from '../../../../../app/utils/pureUtils';
import { getKeyBoardHeight, popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { PENALTY } from '../../../../management/utils/logic';
import { getStore, register, setStore } from '../../data/store';
import { openCamera, selectImage } from '../../logic/native';
import { addPost } from '../../net/rpc';
import { arrayBuffer2File, base64ToFile, imgResize, uploadFile } from '../../net/upload';
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface IMAGE {
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
    uploadLoding:any;
    // placeHolderInfo:number;// 发文章提示文字个数
    editorText:string;// 富文本框内容
    // isEditor:boolean;// 是否开启富文本框模式
    showType:boolean[];// 0表情 1相册 2相机
}
// const editorTextNum = 10;
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
        isUploading:false,
        uploadLoding:[],
        // placeHolderInfo:editorTextNum,
        editorText:'',
        // isEditor:true,
        showType:[true,true,true]
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

    public attach() {
        super.attach();
        if (!this.props.isPublic) {
            return;
        }
        // 赋值富文本框内容
        const editer = document.querySelector('#editBox');
        // tslint:disable-next-line:no-inner-html
        editer.innerHTML = this.props.editorText;
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
        this.reaset(1);
        if (this.props.uploadLoding.length >= 9) {
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
                    imgResize(buffer,0.3,1024,(res) => {
                        const url = `<div style="background-image:url(${res.base64});height: 230px;width: 230px;background-size: cover;" class="previewImg"></div>`;
                        this1.props.imgs[len] = url;
                        this1.paint();

                        if (this1.props.isPublic) {
                            this1.addImg(res.base64);
                        } else {
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
                        }
                        
                    });
                }
            });
            this.paint();
        });
        this.paint();
    }

    /**
     * 打开照相机
     */
    public takePhoto(e:any) {
        this.reaset(2);
        if (this.props.uploadLoding.length >= 9) {
            return;
        }
        const camera = openCamera((url) => {
            console.log('拍摄的图片',url);
            if (!url) {

                return;
            }
            // tslint:disable-next-line:no-this-assignment
            const this1 = this;
            const len = this.props.uploadLoding.length;
            this.props.uploadLoding[len] = true;
            camera.getContent({
                quality:10,
                success(buffer:ArrayBuffer) {
                    imgResize(buffer,0.3,1024,(res) => {
                        const url = `<div style="background-image:url(${res.base64});height: 230px;width: 230px;background-size: cover;" class="previewImg"></div>`;
                        this1.props.uploadLoding[len] = false;
                        this1.props.imgs[len] = url;
                        this1.paint();

                        if (this1.props.isPublic) {
                            this1.addImg(res.base64);
                        } else {
                            uploadFile(base64ToFile(res.base64),(imgUrlSuf:string) => {
                                console.log('上传压缩图',imgUrlSuf);
                                const image:any = {};
                                image.compressImg = imgUrlSuf;
    
                                // 原图
                                camera.getContent({
                                    quality:100,
                                    success(buffer1:ArrayBuffer) {
                                        imgResize(buffer1,0.8,1024,(res1) => {
                                            uploadFile(base64ToFile(res1.base64),(imgurl:string) => {
                                                console.log('上传原图',imgurl);
                                                image.originalImg = imgurl;
                                                this1.props.saveImgs[len] = image;
                                                this1.props.uploadLoding[len] = false;
                                                this1.paint();
                                                if (this1.props.isUploading) {
                                                    this1.props.isUploading = false;
                                                }
                                            });
                                        });
                                        
                                    }
                                });
                            });
                        }
                    });
                }
            });
            this.paint();
        });
    }

    // 关闭
    public close() {
        // 有内容时提醒保存草稿
        if (this.props.titleInput || this.props.contentInput || this.props.imgs.length > 0 || this.props.placeHolderInfo === 0) {
            popNew('chat-client-app-widget-modalBox-modalBox',{ content:'保留此次编辑' },() => {
                if (this.props.isPublic) {
                     // 编辑的div
                    const editor = document.querySelector('#editBox');
                    this.props.editorText = editor.innerHTML;
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
        this.props.uploadLoding.splice(ind,1);
        this.paint();
    }

    // 发送
    public async send() {
        if (this.props.isPublic) {
            if (!this.props.titleInput) {
                popNewMessage('标题不能为空');

                return;
            }
            const editer = document.querySelector('#editBox');
            if (!editer.innerHTML) {
                popNewMessage('内容不能为空');

                return;
            }
            addPost(this.props.titleInput,editer.innerHTML,this.props.num).then((r:any) => {
                if (!isNaN(r)) {
                    popNewMessage('发布成功');
                    // 初始化草稿箱
                    setStore('postDraft',null);
                    this.ok && this.ok();
                } else {
                    r.list.forEach(v => {
                        if (v.punish_type === PENALTY.FREEZE) {
                            popNewMessage('该嗨嗨号被冻结');

                            return;
                        }
                    });
                    
                }
            }).catch(r => {
                popNewMessage('发布失败');
            });
        } else {
            // 等待图片上传完成
            if (this.props.imgs.length !== this.props.saveImgs.length) {
                this.props.isUploading = true;
                popNewMessage('正在上传图片');

                return;
            }
            if (!this.props.contentInput && this.props.saveImgs.length === 0) {
                popNewMessage('内容不能为空');

                return;
            }
            const value = {
                msg:this.props.contentInput,
                imgs:this.props.saveImgs
            };
            if (!this.props.isUploading) {  // 图片上传完成
                addPost(this.props.titleInput,JSON.stringify(value),this.props.num).then((r:any) => {
                    if (!isNaN(r)) {
                        popNewMessage('发布成功');
                        // 初始化草稿箱
                        setStore('pubPostDraft',null);
                        this.ok && this.ok();
                    } else {
                        r.list.forEach(v => {
                            if (v.punish_type === PENALTY.FREEZE) {
                                popNewMessage('您已被禁言');

                                return;
                            }
                        });
                        
                    }
                
                }).catch(r => {
                    popNewMessage('发布失败');
                });
            }
        }
        
    }

    // 打开表情包图库
    public openEmoji() {
        this.reaset(0);
        document.getElementById('emojiMap').style.height = `${getKeyBoardHeight() + 90}px`;
        this.props.isOnEmoji = !this.props.isOnEmoji;
        this.paint();
        
    }

    /**
     * 选择表情
     */
    public pickEmoji(emoji:any) {
        if (this.props.isPublic) {
            const src = `http://${sourceIp}/wallet/chat/client/app/res/emoji/${emoji}`;
            this.addImg(src,true);

            return;
        }
        this.props.contentInput += `[${emoji}]`; // 只能在内容中加表情
        this.paint();
    }

    // 非正式输入的添加图片
    public addImg(src:string,state:boolean= false) {
        const editer = document.querySelector('#editBox');
        editer.focus();
        const filePath = src;
        // if (this.props.placeHolderInfo !== 0) {
        document.execCommand('insertHTML', false, `<img src ='${filePath}' ${state ? 'class="emojiMsg"' :'style="width:100%;height:auto;"'} />`);   
        // }
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

register('offLine',(r) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (r && w) {
        const finshLength = w.props.saveImgs.length;// 已经上传的数量
        const unFinshLength = w.props.imgs.length;// 为上传的数量
        if (finshLength !== unFinshLength) {
            // 已经上传和未上传的图片数量不一样时  删除已经上传的
            const arr = [...w.props.uploadLoding];
            arr.forEach((v,i) => {
                if (v) {
                    w.props.uploadLoding.splice(i,1);
                    w.props.imgs.splice(i,1);
                }
            });
        }
        w.paint();
    }
});
