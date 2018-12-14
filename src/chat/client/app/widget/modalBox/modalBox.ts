/**
 * modalbox
 */

// ================================================ 导入
import { Widget } from '../../../../../pi/widget/widget';

// ================================================ 导出
export class ModalBox extends Widget {
    public props: Props = {
        title: '',
        content: '',
        sureText: '确定',
        cancelText: '取消',
        style: ''
    };
    public ok: () => void;
    public cancel: () => void;
    public setProps(props:any) {
        super.setProps(props);
        this.props = props;
    }
    public cancelBtnClick(e: any) {
        this.cancel && this.cancel();
    }
    public okBtnClick(e: any) {
        this.ok && this.ok();
    }
}

// ================================================ 本地
interface Props {
    title: string;
    content: string;
    sureText: string;
    cancelText: string;
    style?: string; // 修改content的样式
}