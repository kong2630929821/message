/**
 * featureBar 组件相关处理
 */

// ===========================导入
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    iconPath : string;// 头像
    text : string;// 文本
}

// ===========================导出
export class FeatureBar extends Widget {
    public props:Props = {
        iconPath : 'emoji.png',
        text : 'Evan Wood'
    };
    // 点击更多
    public more(e:any) {
        notify(e.node,'ev-getMore',{});
    }
}
