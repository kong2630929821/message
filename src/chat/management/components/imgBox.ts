import { Widget } from '../../../pi/widget/widget';

interface Props {
    src:string;
}

/**
 * 查看大图
 */
export class ImgBox extends Widget {
    public ok:() => void;
    public props:Props = {
        src:''
    };

    public close() {
        this.ok && this.ok();
    }
}