/**
 * modalDelete
 */
import { Widget } from '../../../../pi/widget/widget';


interface Props {
    
}
export class ModalDelete extends Widget {
    public props: Props;
    public ok: () => void;
    public cancel: () => void;

    public create() {
        super.create();
    }
    public cancelBtnClick(e: any) {
        this.cancel && this.cancel();
    }
    public okBtnClick(e: any) {
        this.ok && this.ok();
    }
}
