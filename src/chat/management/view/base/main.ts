
/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

import { popNew } from '../../../../pi/ui/root';
import { addWidget } from '../../../../pi/widget/util';

// ============================== 导出
export const run = (cb): void =>  {
    addWidget(document.body, 'pi-ui-root');
    // 打开首页面
    popNew('chat-management-view-base-login');
    // popNew('chat-management-view-base-home');
    // 解决进入时闪一下问题
    setTimeout(() => {
        if (cb) cb();
    }, 100);
};
