import { notify } from '../../../../../pi/widget/event';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { buildupImgPath } from '../../../../client/app/logic/logic';
import { uploadFile } from '../../../../client/app/net/upload';
import { AddAppArg } from '../../../../server/data/rpc/manager.s';
import { maxSize } from '../../../config';
import { addApplication } from '../../../net/rpc';
import { encodeUnicode, popNewMessage } from '../../../utils/logic';
import { rippleShow } from '../../../utils/tools';

export interface Application {
    name:string;// 应用昵称
    subtitle:string;// 副标题
    desc:string;// 描述
    imgs:Imgs;// 图片
    appSrc:string;// 应用链接
    customer:string;// 客服
    webViewName:string;//
    appId:string;//
    upLoadIng:boolean[];// 正在上传
    buildupImgPath:any;  // 组装图片路径
    status:boolean;// true 修改应用 false 添加应用
    checkBubble:boolean;// 气泡
    checkScreen:boolean;// 游戏屏幕
    data:any;
    isChange:boolean;// 是否可修改
}

export interface Imgs {
    icon:string;// 图标
    rowImg:string;// 横版图
    colImg:string;// 竖版图
    downLoadImg:string;// 下载页面图
}
/**
 * 添加应用
 */
export class AddApplication extends Widget {

    public props:Application = {
        name:'',
        subtitle:'',
        desc:'',
        appSrc:'',
        imgs:{
            icon:'',
            rowImg:'',
            colImg:'',
            downLoadImg:''
        },
        customer:'',
        webViewName:'',
        appId:'',
        upLoadIng:[false,false,false,false],
        buildupImgPath:buildupImgPath,
        status:false,
        checkBubble:true,
        checkScreen:true,
        data:{},
        isChange:true
    };

    /**
     * 重置数据
     */
    public init(data?:any) {
        this.props = {
            name:data ? data.title :'',
            subtitle:data ? data.subtitle :'',
            desc:data ? data.desc :'',
            appSrc:data ? data.url :'',
            imgs:{
                icon:data ? data.img[0] :'',
                rowImg:data ? data.img[1] :'',
                colImg:data ? data.img[2] :'',
                downLoadImg:data ? data.img[3] :''
            },
            customer:data ? data.accId :'',
            webViewName:data ? data.webviewName :'',
            appId:data ? data.accId :'',
            upLoadIng:[false,false,false,false],
            buildupImgPath:buildupImgPath,
            status:data ? true :false,
            checkBubble:data ? (data.buttonMod === 1 ? true :false) :true,
            checkScreen:data ? (data.screenMode === 'landscape' ? true :false) :true,
            isChange:data ? false :true,
            data:{}
        };
        this.paint();
    }

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const currentData = this.props.data;
        this.init(currentData);
    }
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
    
    /**
     * 游戏链接
     */
    public changeGameSrc(e:any) {
        this.props.appSrc = e.value;
    }

    public changeWebViewName(e:any) {
        this.props.webViewName = e.value;
    }

    public changeAppId(e:any) {
        this.props.appId = e.value;
    }

    // 气泡选择
    public checkBubbleType(fg:boolean) {
        if (!this.props.isChange)return;
        this.props.checkBubble = fg;
        this.paint();
    }

    // 游戏屏幕选择
    public checkScreenType(fg:boolean) {
        if (!this.props.isChange)return;
        this.props.checkScreen = fg;
        this.paint();
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
                this.props.imgs.icon = '';
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
                    this.props.imgs.icon = src;
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
    // tslint:disable-next-line:max-func-body-length
    public addApp(e:any) {
        if (!this.props.name) {
            popNewMessage('请填入应用名');

            return;
        }

        if (!this.props.subtitle) {
            popNewMessage('请填入副标题');

            return;
        }

        if (!this.props.desc) {
            popNewMessage('请填入应用简介');

            return;
        }

        if (!this.props.imgs.icon) {
            popNewMessage('请上传应用图标');

            return;
        }

        if (!this.props.appSrc) {
            popNewMessage('请填入游戏链接');

            return;
        }

        if (!this.props.imgs.rowImg) {
            popNewMessage('请上传横版宣传图');

            return;
        }

        if (!this.props.imgs.colImg) {
            popNewMessage('请上传主推宣传图');

            return;
        }

        if (!this.props.imgs.downLoadImg) {
            popNewMessage('请上传下载背景图');

            return;
        }

        if (!this.props.customer) {
            popNewMessage('请填入官方客服');
            
            return;
        }

        if (!this.props.webViewName) {
            popNewMessage('请填入应用唯一标识');

            return;
        }

        if (!this.props.appId) {
            popNewMessage('请填入appId');

            return;
        }

        if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(this.props.webViewName)) {
            popNewMessage('请填入正确的应用标识');

            return;
        }
        const desc = {
            subtitle:encodeUnicode(this.props.subtitle),// 副标题
            webviewName:this.props.webViewName,
            buttonMod:this.props.checkBubble ? 1 :2,// 气泡样式
            accId:this.props.customer,
            groupId:'',
            appid:this.props.appId,
            screenMode:this.props.checkScreen ? 'landscape' :'portrait',
            desc:encodeUnicode(this.props.desc),
            time:JSON.stringify(new Date())
        };
        const arg = new AddAppArg();
        arg.appid = this.props.appId;
        arg.name = encodeUnicode(this.props.name);
        arg.imgs = JSON.stringify(this.props.imgs);
        arg.desc = JSON.stringify(desc);
        arg.url = this.props.appSrc;
        arg.pk = '';
        arg.mch_id = '';
        arg.notify_url = '';

        // 调接口
        addApplication(arg).then(r => {
            if (r === 1) {
                if (this.props.status) {
                    popNewMessage('修改成功');
                    this.goBack(true,e);
                } else {
                    popNewMessage('添加成功');
                    this.init();
                }
            }
        });
    }

    /**
     * 返回上一页
     */
    public goBack(fg:boolean,e:any) {
        notify(e.node,'ev-goBack',{ fg });
    }

    /**
     * 修改应用
     */
    public changeApp() {
        this.props.isChange = true;
        this.paint();
    }

    /**
     * 取消修改
     */
    public cancleChange() {
        this.props.isChange = false;
        this.paint();
    }
    
}