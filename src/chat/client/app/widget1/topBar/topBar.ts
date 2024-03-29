/**
 * topbar头部标题栏
 * {"title":"领红包","background":"orange","centerTitle":true,nextImg:""}
 * title: 标题
 * centerTitle：标题是否居中，默认否
 * background：背景色，传递色值，或者渐变色，默认白色
 * nextImg:右侧图标路径
 */
// ================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { rippleShow } from '../../logic/logic';

interface Props {
    title:string;
    nextImg:string;
    centerTitle:boolean;
    background:string;
    text:string;
    textCenter:string;
    borderStyle:boolean;
}

// ================================ 导出
export class TopBar extends Widget {
    public props:Props;
    
    public setProps(props:Json) {
        super.setProps(props);
        this.state = {
            refresh:false
        };
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