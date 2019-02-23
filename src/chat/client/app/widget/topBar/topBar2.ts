/**
 * 可滑动页面头部导航栏
 */
// ================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { rippleShow } from '../../logic/logic';

interface Props {
    scroll?:boolean;
    scrollHeight?:number;
    refresh?:boolean;
    text?:string;
    nextImg?:string;
}

// ================================ 导出
export class TopBar2 extends Widget {
    public props:Props;
    
    public setProps(oldProps:Json,props:Json) {
        super.setProps(oldProps,props);
        this.props.refresh = false;
    }

    /**
     * 返回上一页
     */
    public backPrePage(event:any) {
        notify(event.node,'ev-back-click',{});
    }

    /**
     * 跳转到下一页
     */
    public goNext(event:any) {
        notify(event.node,'ev-next-click',{});
    }
    
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}
