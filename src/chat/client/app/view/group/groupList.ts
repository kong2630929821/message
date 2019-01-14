/**
 * 群聊列表
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { Contact } from '../../../../server/data/db/user.s';
import { applyJoinGroup } from '../../../../server/data/rpc/group.p';
import { Logger } from '../../../../utils/logger';
import * as store from '../../data/store';
import { bottomNotice, rippleShow } from '../../logic/logic';
import { clientRpcFunc } from '../../net/init';
// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class GroupListt extends Widget {
    public ok:() => void;
    public props:Props = {
        inputGid:null
    };
    
    public create() {
        super.create();
        const sid = store.getStore('uid').toString();
        this.state = store.getStore('contactMap',new Contact()).get(sid);
    }

    public goBack() {
        this.ok();
    }

    // 点击查看群的详细信息
    public showInfo(gid:number) {
        popNew('chat-client-app-view-group-groupInfo', { gid:gid });
    }

    // 输入要添加群聊的Gid
    public inputGid(e:any) {
        this.props.inputGid = parseInt(e.value,10);
    }

    // 主动添加群聊
    public applyGroup(e:any) {
        rippleShow(e);
        if (!this.props.inputGid) {
            bottomNotice('请输入群聊ID');
           
        } else {
            clientRpcFunc(applyJoinGroup, this.props.inputGid, ((r) => {
                logger.debug('===========主动添加群聊返回',r);
                if (r.r === -2) {
                    bottomNotice('您申请的群不存在');
                } else if (r.r === -1) {
                    bottomNotice('您已经是该群的成员');
                }
            }));
        }

    }

    // 创建群聊
    public groupChat() {
        popNew('chat-client-app-view-group-setGroupChat');
    }
    
}

// ================================================ 本地
store.register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (const value of r.values()) {
        forelet.paint(value);
    }    
});

interface Props {
    inputGid:number; // 用户输入的要添加的群组id
}