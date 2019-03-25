/**
 * 聊天首页头部导航栏
 */
// ================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { rippleShow } from '../../logic/logic';

interface Props {
    avatar:string;  // 用户头像
    showSpot:boolean;  // 显示小红点
    activeTab:string;  // 当前活跃的tab
}

// ================================ 导出
export class ContactTop extends Widget {
    public props:Props;

    /**
     * 跳转到下一页
     */
    public goNext(event:any) {
        notify(event.node,'ev-next-click',{});
    }
    
    /**
     * 打开我的设置
     */
    public showMine() {
        popNew('app-view-mine-home-home');
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    // 切换标签
    public changeTab(e:any,tab:string) {
        this.props.activeTab = tab;
        notify(e.node,'ev-contactTop-tab',{ activeTab:tab });
        this.paint();
    }
    
}