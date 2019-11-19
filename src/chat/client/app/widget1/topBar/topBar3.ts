import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    title:string;
    leftImg:string;
    leftText:string;
    rightImg:string;
    rightText:string;
    style:string;
}

/**
 * 顶部居中样式
 */
export class TopBar3 extends Widget {
    public props:Props = {
        title:'',
        leftImg:'',
        leftText:'',
        rightImg:'',
        rightText:'',
        style:''
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    public goBack(e:any) {
        notify(e.node,'ev-back-click',null);
    }

    public next(e:any) {
        notify(e.node,'ev-next-click',null);
    }
}