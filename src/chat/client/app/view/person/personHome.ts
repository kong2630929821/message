import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    activeTab:number;
}

/**
 * 个人主页
 */
export class PersonHome extends Widget {
    public ok:() => void;
    public props:Props = {
        activeTab:0
    };

    public changeTab(i:number) {
        this.props.activeTab = i;
        this.paint();
    }

    public goBack() {
        this.ok && this.ok();
    }
}