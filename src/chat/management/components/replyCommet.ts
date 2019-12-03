import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';
import { uploadFile } from '../../client/app/net/upload';
import { maxSize } from '../config';
import { addComment } from '../net/rpc';
import { popNewMessage } from '../utils/logic';
import { rippleShow } from '../utils/tools';

interface Props {
    contentInput: string;
    saveImgs: string;
    key:any;
    upLoadIng:boolean;// 正在上传
}
/**
 * 确认框
 */
export class ConfirmBox extends Widget {
    public ok:(msg:any) => void;
    public cancel:() => void;
    public props:Props = { 
        contentInput:'',
        saveImgs:'',
        key: {},
        upLoadIng:false
    };
    
    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    // 取消
    public btnCancel() {
        this.cancel && this.cancel();
    }

    // 确认
    public btnOk() {
        console.log('确认回复');
        // this.ok && this.ok();
        // 等待图片上传完成
        if (this.props.upLoadIng === true) {
            
            return;
        }
        const value = {
            msg:this.props.contentInput,
            img:this.props.saveImgs
        };
        console.log(value);
        const postId = this.props.key.post_id || this.props.key.id;   // 评论帖子时id表示帖子ID
        const reply = this.props.key.post_id ? this.props.key.id :0;  // 回复评论时post_id表示帖子ID
        addComment(this.props.key.num, postId, JSON.stringify(value), reply, 0).then(r => {
            this.ok && this.ok({ key:r, value:JSON.stringify(value) });
        }).catch(r => {
            popNewMessage('评论失败了');
        });
        
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
    public userChange(e: any) {
        this.props.contentInput = e.value;
    }
    /**
     * 上传图片
     */
    public uploadImg(e:any) {
        if (!(<any>getRealNode(e.node)).files) {
            return; 
        }
        // 获取图片
        const file = (<any>getRealNode(e.node)).files[0];
        if (file.size > maxSize) {
            popNewMessage('请上传2M以内的图片');

            return;
        }

        // 正在上传动画
        this.props.upLoadIng = true;

        uploadFile(file,(imgurl:string) => {
            console.log('上传图片成功',imgurl);
            this.props.saveImgs = imgurl;
            this.props.upLoadIng = false;
            this.paint();
        }).catch(err => {
            console.log('上传图片失败',err);
            this.props.upLoadIng = false;
            popNewMessage('上传图片失败');
            this.paint();
        });
        this.paint();        
    }

    /**
     * 清除图片
     */
    public clearImg() {
        this.props.saveImgs = '';
        this.paint();
    }

}