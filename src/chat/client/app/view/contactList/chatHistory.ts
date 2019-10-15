import { uploadFileUrlPrefix } from '../../../../../app/public/config';
import { popNew3 } from '../../../../../app/utils/tools';
import { Widget } from '../../../../../pi/widget/widget';
import { rippleShow } from '../../logic/logic';

interface Props {
    name:string;// 标题
    blackList:any;// 黑名单
    urlPath:string;// 图片路径
    addType?:string;
    showDataList:any;// 显示的记录
    chatHistory:any;// 聊天记录列表
    minTitle:string;// 搜索的值
}

/**
 * 黑名单管理
 */
export class BlackList extends Widget {
    public props:Props = {
        name:'',
        blackList:[],
        urlPath:uploadFileUrlPrefix,
        addType:'',
        showDataList:[],
        chatHistory:[],
        minTitle:''
    };

    public ok:() => void;

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props); 
    }

    // 返回
    public goBack() {
        this.ok && this.ok();
    }

    // 点击某个
    public click(index:number) {
        const data  = this.props.chatHistory[index];
        const str = `“${data[0].text}”的聊天记录`;
        popNew3('chat-client-app-view-contactList-blacklist',{ name:this.props.minTitle,minTitle:str,time:data.time,chatHistory:data });
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

}