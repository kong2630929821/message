/**
 * 群聊列表
 */

// ================================================ 导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
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
    public setProps(props:Props) {
        super.setProps(props);
        this.props.groups = props.groups;
    }
    // 点击查看群的详细信息
    public showInfo(gid:number) {
        popNew('client-app-demo_view-group-groupInfo', { gid:gid });
    }
    // 输入要添加群聊的Gid
    public inputGid(e:any) {
        this.props.inputGid = parseInt(e.value,10);
    }
    // 主动添加群聊
    public applyGroup() {
        clientRpcFunc(applyJoinGroup, this.props.inputGid, ((r) => {
            logger.debug('===========主动添加群聊返回',r);
        }));
    }
    
}

// ================================================ 本地
interface Props {
    inputGid:number; // 用户输入的要添加的群组id
    groups:number[]; // 群组列表
}
