/**
 * 入群申请验证状态
 */

// ================================================ 导入
import { Json } from '../../../../pi/lang/type';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { acceptUser } from '../../../../server/data/rpc/group.p';
import { GroupAgree } from '../../../../server/data/rpc/group.s';
import { Logger } from '../../../../utils/logger';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class GroupApplyStatus extends Widget {
    public ok:() => void;
    public props : Props = {
        gid:null,
        groupInfo:{}
    };
    public setProps(props:any) {
        super.setProps(props);
        this.props.groupInfo = this.getGroupInfo(this.props.gid);
    }
    public goBack() {
        this.ok();
    }
    // 获取群组信息
    public getGroupInfo(gid:number) {
        const ginfo = store.getStore(`groupInfoMap/${gid}`);
        logger.debug('============ginfo',ginfo);

        return ginfo;
    }
    public firstPaint() {
        super.firstPaint();
        store.register(`groupInfoMap/${this.props.gid}`,(r:GroupInfo) => {
            this.props.groupInfo = r;
            this.paint();
        });
    }
    // 同意入群申请（主动）
    public agreeJoinGroup(e:any) {
        const uid = parseInt(e.value,10);
        const gid = this.props.gid;
        const agree = new GroupAgree();
        agree.gid = gid;
        agree.uid = uid;
        agree.agree = true;
        logger.debug('==========agreeJoinGroup agree',agree);
        clientRpcFunc(acceptUser,agree,(r) => {
            logger.debug('==========agreeJoinGroup result',r);
        });
    }
}

// ================================================ 本地
interface Props {
    gid:number;
    groupInfo:Json;
}
