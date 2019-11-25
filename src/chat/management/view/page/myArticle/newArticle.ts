import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { buildupImgPath } from '../../../../client/app/logic/logic';
import { uploadFile } from '../../../../client/app/net/upload';
import { maxSize } from '../../../config';
import { popNewMessage } from '../../../utils/logic';

interface Props {
    title:string;// 文章标题
    bannerImg:string;// 文章banner
    upLoadIng:boolean;// 正在上传图片
    buildupImgPath:any;// 图片路径
}

/**
 * 新文章
 */
export class NewArticle extends Widget {

    public props:Props = {
        title:'',
        bannerImg:'',
        upLoadIng:false,
        buildupImgPath:buildupImgPath
    };

    /**
     * 文章标题
     */
    public inputChangeName(e:any) {
        this.props.title = e.value;
    }

    /**
     * 上传图片
     */
    public uploadImg(index:number,e:any) {
        if (!(<any>getRealNode(e.node)).files) {
            return; 
        }
        // 获取图片
        const file = (<any>getRealNode(e.node)).files[0];

        if (index === 0) {
            if (file.size > maxSize) {
                popNewMessage('请上传2M以内的图片');
    
                return;
            }
    
            // 正在上传动画
            this.props.upLoadIng = true;
    
            uploadFile(file,(imgurl:string) => {
                console.log('上传图片成功',imgurl);
                this.props.bannerImg = imgurl;
                this.props.upLoadIng = false;
                this.paint();
            }).catch(err => {
                console.log('上传图片失败',err);
                this.props.upLoadIng = false;
                popNewMessage('上传图片失败');
                this.paint();
            });
            this.paint();
        } else {
            // 插入图片
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onloadend = (ev:any) => {

                this.addImg(ev.target.result);

            };
        }
        
    }

    /**
     * 清除图片
     */
    public clearImg() {
        this.props.bannerImg = '';
        this.paint();
    }

    /**
     * 插入图片
     */
    public addImg(src:string) {
        const editer = document.querySelector('#editBox');
        editer.focus();
        const filePath = src;
        document.execCommand('insertHTML', false, `<img src ='${filePath}' />`);   
    }

    /**
     * 提交审核
     */
    public send() {
        const editer = document.querySelector('#editBox');
        const msg = editer.innerHTML;
        if (!this.props.title) {
            popNewMessage('标题不能为空');

            return;
        }

        if (!this.props.bannerImg) {
            popNewMessage('请上传banner图');

            return;
        }
        
        if (!msg) {
            popNewMessage('内容不能为空');

            return;
        }
    }
}