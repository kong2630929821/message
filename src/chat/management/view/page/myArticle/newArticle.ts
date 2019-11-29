import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { getFile, initFileStore, writeFile } from '../../../../client/app/data/lcstore';
import { buildupImgPath } from '../../../../client/app/logic/logic';
import { uploadFile } from '../../../../client/app/net/upload';
import { maxSize } from '../../../config';
import { sendActicle } from '../../../net/rpc';
import { getStore, setStore } from '../../../store/memstore';
import { popNewMessage } from '../../../utils/logic';
interface Props {
    data: any;
    title:string;// 文章标题
    bannerImg:string;// 文章banner
    upLoadIng:boolean;// 正在上传图片
    buildupImgPath:any;// 图片路径
    draftArry:any[];// 草稿文章数组 
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
        data:{}
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
        document.execCommand('insertHTML', false, `<div></div></div><img src ='${filePath}' />`);

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
            date: this.getDate()
        };
        const num = getStore('flags',{}).num;
        sendActicle(num, 0, this.props.title,JSON.stringify(value)).then((res:any) => {
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
            time: this.getDate()
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
    public const getDate = () => {
        const date = new Date();
        
        // 获取当前月份
        const nowMonth = date.getMonth() + 1;

        // 获取当前是几号
        const strDate = date.getDate();

        // 添加分隔符“-”
        const seperator = '-';

        // 对月份进行处理，1-9月在前面添加一个“0”
        if (nowMonth >= 1 && nowMonth <= 9) {
            nowMonth = '0' + nowMonth;
        }

        // 对月份进行处理，1-9号在前面添加一个“0”
        if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate;
        }

        // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期

        return  date.getFullYear() + seperator + nowMonth + seperator + strDate;
    }
}