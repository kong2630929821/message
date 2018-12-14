/*
** imgMessage 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../../pi/widget/widget"

interface Props{
    imgPath : string; // 图片路径
    sendTime:string;//发送时间
    isYourSelf?: boolean;//是否本人的消息
    isRead:boolean;//是否已读
}

// ===========================导出
export class ImgMessage extends Widget{
    public props : Props;
    constructor(){
        super();
        this.props = {
                imgPath : "10.png",
                sendTime : "17:56",
                isYourSelf : true,
                isRead:true
        };
    }
    public attach(){
        let image = document.getElementById("imgMessage"); 
        let img = new Image();
        let w = image.offsetHeight;
        let h = image.offsetWidth;
        // img.src = "../app/res/images/" + this.props.imgPath;
        // let naturalW = img.naturalWidth;
        // let naturalH = img.naturalHeight;
        console.log("图片宽高",w,h)
    }
}

