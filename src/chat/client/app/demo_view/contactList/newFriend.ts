/**
 * 新朋友验证状态
 */

// ================================================ 导入
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { DEFAULT_ERROR_STR } from '../../../../server/data/constant';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { MSG_TYPE, UserHistory } from '../../../../server/data/db/message.s';
import { Contact } from '../../../../server/data/db/user.s';
import { Result } from '../../../../server/data/rpc/basic.s';
import { agreeJoinGroup } from '../../../../server/data/rpc/group.p';
import { GroupAgree } from '../../../../server/data/rpc/group.s';
import { sendUserMessage } from '../../../../server/data/rpc/message.p';
import { UserSend } from '../../../../server/data/rpc/message.s';
import { Logger } from '../../../../utils/logger';
import { acceptFriend } from '../../../app/net/rpc';
import { updateUserMessage } from '../../data/parse';
import * as  store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class NewFriend extends Widget {
    public ok:() => void;
    
    public goBack() {
        this.ok();
    }
    // 同意好友申请
    public agreeClick(e:any) {
        const v = parseInt(e.value,10);
        acceptFriend(v,true,(r:Result) => {
            if (r.r === 1) {
                const info = new UserSend();
                info.msg = '你们已经成为好友，开始聊天吧';
                info.mtype = MSG_TYPE.ADDUSER;
                info.rid = v;
                info.time = (new Date()).getTime();
                
                clientRpcFunc(sendUserMessage, info, (r:UserHistory) => {
                    const nextside = v;
        
                    if (r.hIncId === DEFAULT_ERROR_STR) {
                        alert('对方不是你的好友！');
                        
                        return;
                    } 
                    updateUserMessage(nextside, r);
                });
            }
        });
    }

    // 同意入群申请（被动）
    public agreeGroupApply(e:any) {
        const gid = parseInt(e.value,10);
        logger.debug('agreeGroupApply',gid);
        const agree = new GroupAgree();
        agree.agree = true;
        agree.gid = gid;
        agree.uid = store.getStore(`uid`);
        clientRpcFunc(agreeJoinGroup, agree,(gInfo:GroupInfo) => {
            if (gInfo.gid === -1) {

                return;
            }
            store.setStore(`groupInfoMap/${gInfo.gid}`,gInfo);
        });
    }
}

// ================================================ 本地
store.register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (const value of r.values()) {
        forelet.paint(value);
    }    
});