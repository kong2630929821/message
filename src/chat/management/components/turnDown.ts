import { Widget } from '../../../pi/widget/widget';
import { popNewMessage } from '../utils/logic';

interface Props {
    input:string;
    btn1:string;
    btn2:string;
}

/**
 * 填写驳回原因
 */
export class TurnDown extends Widget {
    public ok:(str?:string) => void;
    public cancel:() => void;
    public props:Props = {
        input:'',
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

    public inputChange(e:any) {
        this.props.input = e.value;
        this.paint();
    }
    public btnCancel() {
        this.cancel && this.cancel();
    }

    public btnOk() {
        if (!this.props.input) {
            popNewMessage('请填写原因');
            
            return;
        }

        this.ok && this.ok(this.props.input);
    }
}