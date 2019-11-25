import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { setAppHot } from '../../../net/rpc';
import { popNewMessage } from '../../../utils/logic';

/**
 * 推荐应用
 */
export class RecommendApplication extends Widget {

    /**
     * 添加一个推荐
     */
    public addApp(setType:number) {
        popNew('chat-management-components-addApplicationModule',{},(appId:string) => {
            const arr = [appId];
            setAppHot(JSON.stringify(arr),setType).then(r => {
                if (r === 1) {
                    popNewMessage('添加成功');
                } else {
                    popNewMessage('添加失败');
                }
            });
        });
    }
}