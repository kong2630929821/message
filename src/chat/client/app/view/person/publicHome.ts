import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    isMine:boolean;  // 是否自己的公众号
    showTool:boolean;
}

/**
 * 公众号主页
 */
export class PublicHome extends Widget {
    public ok:() => void;
    public props:Props = {
        isMine:false,
        showTool:false
    };

    public goBack() {
        this.ok && this.ok();
    }

    public showUtils() {
        this.props.showTool = !this.props.showTool;
        this.paint();
    }
}