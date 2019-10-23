/**
 * 项目入口
 */
// ============================== 导入
import { getWebviewName } from '../../../../app/api/thirdApi';
import { getGameItem } from '../../../../app/view/play/home/gameConfig';
import { screenMode, WebViewManager } from '../../../../pi/browser/webview';
import { popNew } from '../../../../pi/ui/root';
import { addWidget } from '../../../../pi/widget/util';
import { GENERATOR_TYPE } from '../../../server/data/db/user.s';

// ============================== 导出
export const run = (cb) => {
    addWidget(document.body, 'pi-ui-root');
    const webviewName = getWebviewName();
    if (webviewName) {
        const item:any = getGameItem(webviewName);
        popNew('chat-client-app-view-chat-chat',{ uid:'10046',chatType: GENERATOR_TYPE.USER,name:`${item.title.zh_Hans}官方客服`,okCB:() => {
            WebViewManager.open(webviewName, `${item.url}?${Math.random()}`, webviewName,'', screenMode.landscape);
        } });
    } else {
        popNew('chat-client-app-view-home-contact');
    }
    
    setTimeout(() => {
        cb && cb();
    }, 100);
};
