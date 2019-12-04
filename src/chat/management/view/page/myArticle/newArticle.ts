import { notify } from '../../../../../pi/widget/event';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { buildupImgPath } from '../../../../client/app/logic/logic';
import { uploadFile } from '../../../../client/app/net/upload';
import { maxSize } from '../../../config';
import { sendActicle } from '../../../net/rpc';
import { getStore, setStore } from '../../../store/memstore';
import { popNewMessage } from '../../../utils/logic';
interface Props {
    data: DataType; // 保存父组件传递的数据
    title:string;// 文章标题
    bannerImg:string;// 文章banner
    upLoadIng:boolean;// 正在上传图片
    buildupImgPath:Function;// 图片路径
    draftArry:any[];// 草稿文章数组 
}
interface DataType {
    bannerImg: string;
    msg: string;
    time: number;
    title: string;
    body?: string;
}

/**
 * 新文章
 */
export class NewArticle extends Widget {

    public props:Props = {
        title:'',
        bannerImg:'',
        upLoadIng:false,
        buildupImgPath:buildupImgPath,
        draftArry:[],
        data:{
            bannerImg: '',
            msg: '',
            time: 0,
            title: '',
            body:''
        }
    };
    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const currentData = this.props.data;
        console.log(currentData);
        this.init(currentData);
        
    }
    // 初始化数据
    public init (data?:any) {
        this.props = {
            title:data ? data.title : '',
            bannerImg: data ? data.bannerImg : '',
            upLoadIng:false,
            buildupImgPath:buildupImgPath,
            draftArry:[],
            data:data
        };
        this.paint();
        
    }
    public attach() {
        const editer = document.querySelector('#editBox');
        console.log(this.props.data);
        // tslint:disable-next-line:no-inner-html
        // tslint:disable-next-line:triple-equals
        if (this.props.data.msg != null) {
            // tslint:disable-next-line:no-inner-html
            editer.innerHTML = this.props.data ? this.props.data.msg :'';
            
        }
        // tslint:disable-next-line:triple-equals
        if (this.props.data.body != null) {
            // tslint:disable-next-line:no-inner-html
            editer.innerHTML = this.props.data ? JSON.parse(this.props.data.body).msg :'';
        }
        
    }
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
        }
        
        // 开始上传图片
        uploadFile(file,(imgurl:string) => {
            console.log('上传图片成功',imgurl);
            if (index === 0) {
                // banner图上传
                this.props.bannerImg = imgurl;
                this.props.upLoadIng = false;
            } else {
                // 文章正文图片上传
                this.addImg(buildupImgPath(imgurl));
            }
            this.paint();
        }).catch(err => {
            console.log('上传图片失败',err);
            if (index === 0) {
                this.props.upLoadIng = false;
            }
            popNewMessage('上传图片失败');
            this.paint();
        });
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
        document.execCommand('insertHTML', false, `<img style="display: block;max-width: 100%;max-height: 100%;" src ='${filePath}' />`);
        // 图片插入成功后置空input使其下次能触发onChange
        document.querySelector('#bodyImg').value = '';
        // 滚到底部
        setTimeout(() => {
            const editer = document.querySelector('#editBox');
            editer.scrollTop = editer.scrollHeight;
        },100);
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
        const value = {
            msg,
            imgs: this.props.bannerImg,
            date: new Date().getTime()
        };
        const num = getStore('flags',{}).num;
        sendActicle(num, this.props.title,JSON.stringify(value)).then((res:any) => {
            if (res.num === num) {
                popNewMessage('提交成功');
                this.props.title = '';
                this.props.bannerImg = '';
                editer.innerHTML = '';
                this.paint();
            } else {
                popNewMessage('提交失败');
            }
        });
        
    }
    /**
     * 保存草稿
     */
    public saveAsDraft() {

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
        const draft = {
            title : this.props.title,
            msg: msg,
            bannerImg : this.props.bannerImg,
            time: new Date().getTime()
        };
        // 获取当前indexdb中的草稿内容
        const tempDraftArray = this.props.draftArry;
        // 控制数组长度为六
        while (tempDraftArray.length > 5) {
            tempDraftArray.pop;
        }
        // 放入当前草稿内容
        tempDraftArray.push(draft);
        setStore('draft',tempDraftArray);
        this.props.title = '';
        this.props.bannerImg = '';
        editer.innerHTML = '';
        this.paint();
    }
    // 返回
    public goBack(fg:boolean,e:any) {
        notify(e.node,'ev-goBack',{ fg });
    }
}