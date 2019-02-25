/**
 * utilList 组件相关处理
 */

// ================================================ 导入
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { rippleShow } from '../../logic/logic';

interface Util {
    iconPath ?: string; // 图标路径
    utilText : string; // 文本
}
interface Props {
    utilList : Util[];// 操作列表
}

// ===========================导出
export class UtilList extends Widget {
    public props: Props;  
        
    // 处理点击每一项功能列表
    public handleUtilItemTap(event:any,index:number) {
        notify(event.node,'ev-handleFatherTap',{ index:index });
    }
    
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}
