import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { buildupImgPath } from '../../../../client/app/logic/logic';
import { uploadFile } from '../../../../client/app/net/upload';
import { popNewMessage } from '../../../utils/logic';
import { rippleShow } from '../../../utils/tools';
import { maxSize } from '../../../config';

interface Props {
    name:string;// 应用昵称
    subtitle:string;// 副标题
    desc:string;// 描述
    icon:string;// 图标
    imgs:Imgs;// 图片
    customer:string;// 客服
    upLoadIng:boolean[];// 正在上传
    buildupImgPath:any;  // 组装图片路径
    status:boolean;// true 修改应用 false 添加应用
}

interface Imgs {
    rowImg:string;// 横版图
    colImg:string;// 竖版图
    downLoadImg:string;// 下载页面图
}

/**
 * 添加应用
 */
export class AddApplication extends Widget {

    public props:Props = {
        name:'',
        subtitle:'',
        desc:'',
        icon:'',
        imgs:{
            rowImg:'',
            colImg:'',
            downLoadImg:''
        },
        customer:'',
        upLoadIng:[false,false,false,false],
        buildupImgPath:buildupImgPath,
        status:true
    };

    /**
     * 应用名
     */
    public inputChangeName(e:any) {
        this.props.name = e.value;
    }

    /**
     * 副标题
     */
    public inputChangeSubTitle(e:any) {
        this.props.subtitle = e.value;
    }

    /**
     * 描述
     */
    public userChangeDesc(e:any) {
        this.props.desc = e.value;
    }

    /**
     * 客服
     */
    public inputChangeCustomer(e:any) {
        this.props.customer = e.value;
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    /**
     * 清除图片
     * @param index 0 图标 1横版图 2竖版图 3下载背景图
     */
    public clearImg(index:number) {
        switch (index) {
            case 0:
                this.props.icon = '';
                break;
            case 1:
                this.props.imgs.rowImg = '';
                break;
            case 2:
                this.props.imgs.colImg = '';
                break;
            case 3:
                this.props.imgs.downLoadImg = '';
                break;
            default:
        }
        this.paint();
    }

    /**
     * 
     * @param index 上传图片的类型
     * @param e 图片
     */
    public uploadImg(index:number,e:any) {
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
        this.props.upLoadIng[index] = true;

        uploadFile(file,(imgurl:string) => {
            console.log('上传图片成功',imgurl);
            const src = imgurl;
            switch (index) {
                case 0:
                    this.props.icon = src;
                    break;
                case 1:
                    this.props.imgs.rowImg = src;
                    break;
                case 2:
                    this.props.imgs.colImg = src;
                    break;
                case 3:
                    this.props.imgs.downLoadImg = src;
                    break;
                default:
            }
            this.props.upLoadIng[index] = false;
            this.paint();
            
        }).catch(err => {
            console.log('上传图片失败',err);
            this.props.upLoadIng[index] = false;
            popNewMessage('上传图片失败');
            this.paint();
        });
        this.paint();
    }

    /**
     * 添加一个应用
     */
    public addApp() {
        
    }
    
}