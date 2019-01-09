/**
 * modalbox
 */

// ================================================ 导入
import { Widget } from '../../../../../pi/widget/widget';

// ================================================ 导出
export class ModalBox extends Widget {
    public props: Props;
    public ok: () => void;

    public closePage() {
        this.ok && this.ok();
    }
}

// ================================================ 本地
interface Props {
    img: string;
}