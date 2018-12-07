/**
 * 主动入群验证信息
 */

// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { acceptUser } from '../../../../server/data/rpc/group.p';
import { GroupAgree } from '../../../../server/data/rpc/group.s';
import { Logger } from '../../../../utils/logger';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class GroupApplyInfo extends Widget {
    public ok:() => void;
    public props: Props = {
        gid:null,
        uid:null,
        name:'',
        applyInfo: '',
        isSolve:''
    };
    public setProps(props:any) {
        super.setProps(props);
        logger.debug('==================主动申请入群验证详细',props);
        this.props.gid = props.activeToGGid;
        this.props.uid = props.id;
        this.props.isSolve = props.isagree ? '已同意' :'';
    }
    public goBack() {
        this.ok();
    }
    // 点击拒绝添加好友
    public reject() {
        const uid = this.props.uid;
        const gid = this.props.gid;
        const agree = new GroupAgree();
        agree.gid = gid;
        agree.uid = uid;
        agree.agree = false;
        logger.debug('==========active GroupApplyInfo reject',agree);
        clientRpcFunc(acceptUser,agree,(r) => {
            logger.debug('==========active GroupApplyInfo reject result',r);
            this.props.isSolve = '已拒绝';
            this.paint();
        });
    }

    // 点击同意添加好友
    public agree() {
        const uid = this.props.uid;
        const gid = this.props.gid;
        const agree = new GroupAgree();
        agree.gid = gid;
        agree.uid = uid;
        agree.agree = true;
        logger.debug('==========active GroupApplyInfo agree',agree);
        clientRpcFunc(acceptUser,agree,(r) => {
            logger.debug('==========active GroupApplyInfo agree result',r);
            this.props.isSolve = '已同意';
            this.paint();
        });
    }
    
}

// ================================================ 本地
interface Props {
    gid:number; // 主动加群的群id
    uid:number; // 申请加群的用户id
    name: string; // 用户名
    applyInfo: string; // 申请信息 
    isSolve:string;
}
