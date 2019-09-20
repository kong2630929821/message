import { popNew } from '../../../../pi/ui/root';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';

/**
 * 待处理详情
 */
export class ToBeProcessedInfo extends Widget {
    public deelContent() {
        // popNew('chat-management-components-reportBox');
        popNew('chat-management-components-confirmBox');
    }

    // 返回
    public exit(e:any) {
        notify(e.node,'ev-exit',null);
    }
}