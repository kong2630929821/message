/**
 * 群聊列表
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { applyJoinGroup } from '../../../../server/data/rpc/group.p';
import { Logger } from '../../../../utils/logger';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class GroupListt extends Widget {
    public ok:() => void;
    public props:Props = {
        inputGid:null,
        groups:[]
    };
    public goBack() {
        this.ok();
    }

    // 点击查看群的详细信息
    public showInfo(gid:number) {
        popNew('chat-client-app-demo_view-group-groupInfo', { gid:gid });
    }

    // 输入要添加群聊的Gid
    public inputGid(e:any) {
        this.props.inputGid = parseInt(e.value,10);
    }

    // 主动添加群聊
    public applyGroup() {
        if (this.props.inputGid) {
            clientRpcFunc(applyJoinGroup, this.props.inputGid, ((r) => {
                logger.debug('===========主动添加群聊返回',r);
                if (r.r === -2) {
                    alert('申请的群不存在');
                } else if (r.r === -1) {
                    alert('您已经是该群的成员');
                }
            }));
        } else {
            alert('请输入想要加入的群组');
        }
        
    }
    
}

// ================================================ 本地
interface Props {
    inputGid:number; // 用户输入的要添加的群组id
    groups:number[]; // 群组列表
}