/**
 * 特殊widget，保留props的值
 */
import { Widget } from '../../../../pi/widget/widget';

export class SpecialWidget extends Widget {
    public props:any;

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }
}