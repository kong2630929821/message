import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

/**
 * 待处理详情
 */
export class ToBeProcessedInfo extends Widget {
    public deelContent() {
        popNew('chat-management-components-reportBox');
    }
}