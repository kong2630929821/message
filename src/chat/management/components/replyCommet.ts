import { Widget } from '../../../pi/widget/widget';
import { addComment } from '../net/rpc';
import { popNewMessage } from '../utils/logic';
import { rippleShow } from '../utils/tools';

interface Props {
    contentInput: string;
    saveImgs: any[];
    key:any;
}
/**
 * 确认框
 */
export class ConfirmBox extends Widget {
    public ok:(msg:any) => void;
    public cancel:() => void;
    public props:Props = { 
        contentInput:'',
        saveImgs:[],
        key: {}
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
        // if (this.props.imgs.length !== this.props.saveImgs.length) {
        //     this.props.isUploading = true;
        
        //     return;
        // }
        const value = {
            msg:this.props.contentInput,
            img:this.props.saveImgs
        };
        console.log(this.props.key);
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
}