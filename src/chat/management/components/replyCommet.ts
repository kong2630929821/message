import { Widget } from '../../../pi/widget/widget';
import { rippleShow } from '../utils/tools';

/**
 * 确认框
 */
export class ConfirmBox extends Widget {
    public ok:() => void;
    public cancel:() => void;
    
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