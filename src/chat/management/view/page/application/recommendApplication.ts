import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

/**
 * 推荐应用
 */
export class RecommendApplication extends Widget {

    /**
     * 添加一个推荐
     */
    public addApp() {
        popNew('chat-management-components-addApplicationModule');
    }
}