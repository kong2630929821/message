/**
 * 聊天首页头部导航栏
 */
// ================================ 导入
import { popNew3 } from '../../../../../app/utils/tools';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { rippleShow } from '../../logic/logic';
import { TAB } from './contact';
import { TagList } from './square';

interface Props {
    avatar:string;  // 用户头像
    showSpot:boolean;  // 显示小红点
    activeTab:string;  // 当前活跃的tab
    showTag:boolean;  // 展示广场下拉
    showAcTag:string;  // 标签
    acTag:string;   // 标签
    showUtils:boolean;  // 显示操作栏
}

// ================================ 导出
export class ContactTop extends Widget {
    public props:Props;

    public setProps(props:any) {
        super.setProps(props);
        this.props.showAcTag = TagList[props.acTag];
    }

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
        popNew3('app-view-mine-home-home');
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    // 切换标签
    public changeTab(e:any,tab:string) {
        // 已经在广场
        if (this.props.activeTab === TAB.square) {
            this.props.showTag = !this.props.showTag;
        }
        this.props.activeTab = tab;
        notify(e.node,'ev-contactTop-tab',{ activeTab:tab, showTag:this.props.showTag });
        this.paint();
    }
    
    // 发布帖子  fg=true 发布公众号帖子
    public editPost(e:any,fg:boolean) {
        popNew3('chat-client-app-view-info-editPost',{ isPublic:fg });
        notify(e.node,'ev-next-click',{});
    }
}