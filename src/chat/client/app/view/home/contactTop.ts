/**
 * 聊天首页头部导航栏
 */

// ================================ 导入
import { popNewMessage } from '../../../../../app/utils/pureUtils';
import { popNew3 } from '../../../../../app/utils/tools';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore } from '../../data/store';
import { rippleShow } from '../../logic/logic';
import { TAB } from './contact';

interface Props {
    avatar:string;  // 用户头像
    showSpot:boolean;  // 显示小红点
    activeTab:string;  // 当前活跃的tab
    showTag:boolean;  // 展示广场下拉
    showAcTag:string;  // 标签
    acTag:number;  // 当前活跃的广场标签下标
    showUtils:boolean;  // 显示操作栏
    utilList:any[]; // 操作列表
    
}

// ================================ 导出

export class ContactTop extends Widget {
    public props:Props;

    public setProps(props:any) {
        super.setProps(props);
        this.props.showAcTag = getStore('tagList',[])[this.props.acTag];
        this.props.utilList = [
            { iconPath: 'search.png', utilText: '搜索' },
            { iconPath: 'add-blue.png', utilText: '添加好友' },
            { iconPath: 'add-friend.png', utilText: '加群聊' },
            { iconPath: 'group-chat.png', utilText: '创建群聊' }
        ];
    }

    /**
     * 跳转到下一页
     */
    public goNext(event:any) {
        notify(event.node,'ev-next-click',{ fg:true });
    }
    
    /**
     * 打开我的设置
     */
    public showMine(e:any) {
        notify(e.node,'ev-myHome',null);
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    // 切换标签
    public changeTab(e:any,tab:string) {
        // 已经在广场
        if (this.props.activeTab === TAB.square && tab === TAB.square) {
            this.props.showTag = !this.props.showTag;
        }
        this.props.activeTab = tab;
        notify(e.node,'ev-contactTop-tab',{ activeTab:tab, showTag:this.props.showTag });
        this.paint();
    }
    
    // 发布帖子  fg=true 发布公众号帖子
    public editPost(e:any,fg:boolean) {
        if (fg && !getStore('pubNum',0)) {
            popNewMessage('没有公众号，不能发文章');
        } else {
            // popNew3('chat-client-app-view-info-editPost',{ isPublic:fg },() => {
            //     showPost(this.props.acTag + 1);
            // });
        }
        notify(e.node,'ev-next-click',{ fg:false });
    }

    public utilClick(e:any,ind:number) {
        switch (ind) {
            case 0:// 搜索
                popNew3('chat-client-app-view-chat-search');
                break;
            case 1:// 点击添加好友
                popNew3('chat-client-app-view-chat-addUser');
                break;
            case 2:// 加群聊
                popNew3('chat-client-app-view-group-groupList');
                break;
            case 3:// 创建群聊 setGroupChat
                popNew3('chat-client-app-view-group-setGroupChat');
                break;

            default:
        }
        notify(e.node,'ev-util-click',{});
    }

}