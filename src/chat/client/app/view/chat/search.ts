import { Widget } from '../../../../../pi/widget/widget';

/**
 * 搜索
 */
export class Search extends Widget {
    public ok:() => void;

    public goBack() {
        this.ok && this.ok();
    }
}