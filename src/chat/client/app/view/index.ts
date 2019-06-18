/**
 * 项目入口
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { addWidget } from '../../../../pi/widget/util';

// ============================== 导出
export const run = () => {
    const currentTime = (new Date()).getTime();
    addWidget(document.body, 'pi-ui-root');
    document.oncontextmenu = (e) => {
        // 或者return false;
        e.preventDefault();
    };
    popNew('chat-client-app-view-register-login');
};
