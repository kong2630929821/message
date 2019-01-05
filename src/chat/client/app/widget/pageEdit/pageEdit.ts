/**
 * 编辑页面
 */

// ================================================ 导入
import { Widget } from '../../../../../pi/widget/widget';

// ================================================ 导出

export class PageEdit extends Widget {
    public ok:(res:any) => void;
    public cancel:() => void;
    public props:Props = {
        title:'',
        needTitle:false,
        titleInput:'',
        contentInput:'',
        count:0,
        placeholder:''
    };

    public setProps(props:any) {
        super.setProps(props);
        this.props.count = 0;
        this.props.placeholder = props.contentInput || '内容（必填）15-500字';
    }

    public goBack() {
        this.cancel();
    }
    // 标题变化
    public inputChange(e:any) {
        this.props.titleInput = e.value;
    }
    // 内容变化
    public textAreaChange(e:any) {
        this.props.contentInput = e.value;
        this.props.count = e.value.length;
    }
    // 完成编辑
    public completeEdit() {
        this.ok({ title:this.props.titleInput,content:this.props.contentInput });
    }
}

// ================================================ 本地
interface Props {
    title:string; // topbar 标题
    needTitle:boolean; // 是否需要输入标题
    titleInput:string; // 标题
    contentInput:string; // 内容
    count:number; // 内容字数
    placeholder:string; // 内容的提示语
}
