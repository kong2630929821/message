/**
 * 项目入口
 */
// ============================== 导入
import { getWebviewName } from '../../../../app/api/walletApi';
import { WebViewManager } from '../../../../pi/browser/webview';
import { popNew } from '../../../../pi/ui/root';
import { addWidget } from '../../../../pi/widget/util';
import { GENERATOR_TYPE } from '../../../server/data/db/user.s';
import { getStore } from '../data/store';

// ============================== 导出
export const run = async (cb) => {
    addWidget(document.body, 'pi-ui-root');
    const webviewName = await getWebviewName();
    console.log('webviewName ',webviewName);
    if (webviewName) {
        const item:any = getGameItem(webviewName);
        popNew('chat-client-app-view-chat-chat',{ accId:item.accId,chatType: GENERATOR_TYPE.USER,name:`${item.title}官方客服`,okCB:() => {
            WebViewManager.open(webviewName, `${item.url}?${Math.random()}`, webviewName,'', item.screenMode);
            if (getStore('flags',{}).firstStageLoaded) {
                popNew('app-view-base-app');
            }
        } });
    }
    setTimeout(() => {
        cb && cb();
    }, 100);
};

/**
 * 获取指定webviewName的所有值
 */
export const getGameItem = (webviewName:string) => {
    const gameList = getStore('gameList');
    const index = gameList.findIndex((item) => {
        return item.webviewName === webviewName;
    });
    
    const gameItem = localStorage.getItem('officialService') ? JSON.parse(localStorage.getItem('officialService')).gameList[index] :{}; 
    console.log('获取游戏配置信息', gameList[index], gameItem);

    return {
        ...gameList[index],
        ...gameItem
    };
};