/**
 * 群公告详细
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { DEFAULT_ERROR_STR } from '../../../../server/data/constant';
import { AnnounceHistory, GroupHistory, MSG_TYPE } from '../../../../server/data/db/message.s';
import { sendGroupMessage } from '../../../../server/data/rpc/message.p';
import { GroupSend } from '../../../../server/data/rpc/message.s';
import { getGidFromHincid } from '../../../../utils/util';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
export class AnnounceDetail extends Widget {
    public ok:() => void;

    public setProps(props:any) {
        super.setProps(props); 
        const announce = store.getStore(`announceHistoryMap/${props.aIncId}`,new AnnounceHistory()).announce;  
        this.props.content = announce ? announce.msg :'';  
    }
    
    // 点击删除公告
    public deleteAnnounce(e:any) {
        popNew('chat-client-app-widget-openLink-openLink',{ text:'确认删除' },() => {
            const message = new GroupSend();
            message.gid = getGidFromHincid(this.props.aIncId);
            message.msg = this.props.aIncId;
            message.mtype = MSG_TYPE.RENOTICE;
            message.time = (new Date()).getTime();
            clientRpcFunc(sendGroupMessage, message, (r:GroupHistory) => {
                // TODO
                if (r.hIncId === DEFAULT_ERROR_STR) {
                    console.log('删除公告失败');
                        
                    return;
                }
            });
        });
    }

    public goBack() {
        this.ok();
    }
}
