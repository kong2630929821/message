import { Widget } from '../../../pi/widget/widget';
import { rippleShow } from '../utils/tools';

interface Props {
    title:string;// 标题
    content:string;// 内容
    prompt:string;// 提示
    btn1:string;// 按钮1
    btn2:string;// 按钮2
}

/**
 * 确认框
 */
export class ConfirmBox extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:Props = {
        title:'',
        content:'',
        prompt:'',
        btn1:'取消',
        btn2:'确认'
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
        this.ok && this.ok();
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}