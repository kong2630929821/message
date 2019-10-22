/**
 * 项目入口
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { addWidget } from '../../../../pi/widget/util';

// ============================== 导出
export const run = (cb) => {
    addWidget(document.body, 'pi-ui-root');
    popNew('chat-client-app-view-home-contact');
    setTimeout(() => {
        if (cb) cb();
    }, 20);
};
