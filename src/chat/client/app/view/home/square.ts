import { popNew3 } from '../../../../../app/utils/tools';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    showTag:boolean;  // 显示标签列表
    tagList:string[];  // 标签列表
    active:number;  // 当前显示的标签
}
export const TagList = ['广场','关注','热门','公众号'];
/**
 * 广场
 */
export class Square extends Widget {
    public props:Props = {
        showTag:false,
        tagList:TagList,
        active:0
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    public changeTag(e:any,ind:number) {
        this.props.showTag = false;
        this.props.active = ind;
        this.paint();
        notify(e.node,'ev-square-change',{ value:ind });
    }

    public goManage() {
        popNew3('chat-client-app-view-info-manageFollow');
    }
}
