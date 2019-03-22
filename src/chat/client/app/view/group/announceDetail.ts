/**
 * 群公告详细
 */

// ================================================ 导入
import { popNewMessage } from '../../../../../app/utils/tools';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { DEFAULT_ERROR_STR } from '../../../../server/data/constant';
import { Announcement, GroupHistory, MSG_TYPE } from '../../../../server/data/db/message.s';
import { sendGroupMessage } from '../../../../server/data/rpc/message.p';
import { GroupSend } from '../../../../server/data/rpc/message.s';
import { depCopy, getGidFromHincid } from '../../../../utils/util';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
export class AnnounceDetail extends Widget {
    public ok:() => void;

    public setProps(props:any) {
        super.setProps(props); 
        if (props.aIncId) {
            const announce = store.getStore(`announceHistoryMap/${props.aIncId}`,new Announcement());
            if (announce.msg) {
                const notice = depCopy(announce.msg);
                this.props.title = JSON.parse(notice).title;
                this.props.content = JSON.parse(notice).content;  
            }
        } 

    }
    
    // 点击撤回公告
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
                    popNewMessage('撤回公告失败');
                        
                    return;
                } else {
                    popNewMessage('撤回公告成功');
                    this.ok();
                }
            });
        });
    }

    public goBack() {
        this.ok();
    }
}
