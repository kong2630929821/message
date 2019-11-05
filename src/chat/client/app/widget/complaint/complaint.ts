/**
 * modalbox
 */
import { popNewMessage } from '../../../../../app/utils/pureUtils';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { selectImage } from '../../logic/native';
import { complaintType } from '../../net/rpc';
import { arrayBuffer2File,base64ToFile,imgResize, uploadFile } from '../../net/upload';

interface Props {
    title:string;// 标题
    avatar:string;// 头像
    userName:string;// 用户名
    msg:string;// 举报内容
    selected:any;// 选择举报的类型
    sex:number;// 性别
    selectStaus:any;// 选中的状态
    content:any;// 举报的类型名字
    imgs:string[];   // 预览图片
    saveImgs:IMAGE[];   // 上传后的图片
    isUploading:boolean;// 正在上传图片
    placeholder:string;
    contentInput:string;
    status:number;// 举报类型  0其他 1表示用户
    reportKey:string;// 举报的key值
    uploadLoding:any;
}
interface IMAGE {
    compressImg:string;
    originalImg:any;  
}
const report = ['色情暴力','骚扰谩骂','广告欺诈','病毒木马','反动政治','其它'];
/**
 * 举报
 */
export class ModalBox extends Widget {
    public props: Props = {
        title:'',
        avatar:'',
        userName:'',
        msg:'',
        selected:[],
        sex:2,
        selectStaus:[],
        content:[],
        imgs:[],
        saveImgs:[],
        isUploading:false,
        placeholder:'请详细填写，已确保投诉能够受理',
        contentInput:'',
        status:0,
        reportKey:'',
        uploadLoding:[]
    };
    public ok: (selected:any) => void;
    public cancel: () => void;

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.init();
    }

    // 初始化
    public init() {
        this.props.content.forEach(v => {
            this.props.selectStaus.push(false);
        });
    }
    // 选择某个
    public doClick(i:number) {
        const index = this.props.selected.indexOf(i);
        if (index > -1) {
            this.props.selected.splice(index,1);
            this.props.selectStaus[i] = false;
        } else {
            this.props.selected.push(i);
            this.props.selectStaus[i] = true;
        }
        this.paint();
    }
    public cancelBtnClick(e: any) {
        this.cancel && this.cancel();
    }
    public okBtnClick(e: any) {
        if ((this.props.status === 1 || this.props.status === 2) && this.props.imgs.length) {
            // 等待图片上传完成
            if (this.props.imgs.length !== this.props.saveImgs.length) {
                this.props.isUploading = true;

                return;
            }
        }
        
        if (!this.props.selected.length) {
            popNewMessage('您未选择举报类型');
            
            return ;
        }
        const reportList = [];
        this.props.selected.forEach(v => {
            reportList.push(report[v]);
        });
        const imgs = [];
        this.props.saveImgs.forEach(v => {
            imgs.push(v.originalImg);
        });
        const evidence = {
            msg:this.props.contentInput,
            img:JSON.stringify(imgs),
            type:JSON.stringify(reportList)
        };
        complaintType(this.props.reportKey,this.props.status,JSON.stringify(evidence)).then(r => {
            if (r > 0) {
                popNewMessage('举报成功');
                this.ok && this.ok(this.props.selected);
            }
        });
    }

        // 删除图片
    public delImage(ind:number) {
        this.props.imgs.splice(ind,1);
        this.props.saveImgs.splice(ind,1);
        this.paint();
    }

    /**
     * 选择图片
     */
    public chooseImage(e:any) {
        if (this.props.uploadLoding.length >= 3) {
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
                    imgResize(buffer,0.8,1024,(res) => {
                        const url = `<div style="background-image:url(${res.base64});height: 220px;width: 220px;" class="previewImg"></div>`;
                        this1.props.imgs[len] = url;
                        this1.paint();

                        uploadFile(base64ToFile(res.base64),(imgUrlSuf:string) => {
                            console.log('上传压缩图',imgUrlSuf);
                            const image:any = {};
                            image.compressImg = imgUrlSuf;

                            // 原图
                            imagePicker.getContent({
                                quality:100,
                                success(buffer1:ArrayBuffer) {
                                    
                                    uploadFile(arrayBuffer2File(buffer1),(imgurl:string) => {
                                        console.log('上传原图',imgurl);
                                        image.originalImg = imgurl;
                                        this1.props.saveImgs[len] = image;
                                        this1.props.uploadLoding[len] = false;
                                        this1.paint();
                                        if (this1.props.isUploading) {
                                            this1.props.isUploading = false;
                                            this1.okBtnClick(e);
                                        }
                                    });
                                }
                            });
                        });
                        
                    });
                }
            });
            this.paint();
        });
    }

    // 文字描述
    public contentChange(e:any) {
        this.props.contentInput = e.value;
    }

    public onClick() {
        this.latestMsg();
    }
    /**
     * 定位最新消息
     */
    public latestMsg() {
        setTimeout(() => {
            const $scrollElem = this.getScrollElem();
            // console.log($scrollElem.scrollHeight);
            $scrollElem.scrollTop = $scrollElem.scrollHeight + $scrollElem.scrollHeight;
            this.paint();
        }, 100);
        
    }

    /**
     * 获取滚动区元素
     */
    public getScrollElem() {
        return getRealNode((<any>this.tree).children[1]);
    }
}