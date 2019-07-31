/**
 * modalbox
 */
import { Widget } from '../../../../../pi/widget/widget';

export class ModalBox extends Widget {
    public props: any;
    public ok: (selected:any) => void;
    public cancel: () => void;

    public setProps(props:any) {
        super.setProps(props);
        this.props.selected = [];
    }
    public doClick(i:number) {
        const index = this.props.selected.indexOf(i);
        if (index > -1) {
            this.props.selected.splice(index,1);
        } else {
            this.props.selected.push(i);
        }
        this.paint();
    }
    public cancelBtnClick(e: any) {
        this.cancel && this.cancel();
    }
    public okBtnClick(e: any) {
        this.ok && this.ok(this.props.selected);
    }
}