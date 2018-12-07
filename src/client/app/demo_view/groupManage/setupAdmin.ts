/**
 * 设置管理员
 */

// ================================================ 导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { delAdmin } from '../../../../server/data/rpc/group.p';
import { Logger } from '../../../../utils/logger';
import { genGuid } from '../../../../utils/util';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class SetupAdmin extends Widget {
    public ok:() => void;
    public props:Props = {
        gid:null,
        ginfo:{}
    };
    public setProps(props:any) {
        super.setProps(props);
        this.props.gid = props.gid;
        this.props.ginfo = this.getGroupInfo(this.props.gid);
    }
    public goBack() {
        this.ok();
    }
    public firstPaint() {
        super.firstPaint();
        store.register(`groupInfoMap/${this.props.gid}`,(r:GroupInfo) => {
            this.props.ginfo = r;
            this.paint();
        });
    }
    public getGroupInfo(gid:number) {
        const ginfo = store.getStore(`groupInfoMap/${gid}`);
        logger.debug('============ginfo',ginfo);

        return ginfo;
    }
    // 打开添加管理员页面
    public openAddAdmin() {
        popNew('client-app-demo_view-groupManage-addAdmin',{ gid:this.props.gid });
    }
    // 移除管理员
    public removeAdmin(uid:number) {
        const guid = genGuid(this.props.gid,uid);
        clientRpcFunc(delAdmin,guid,(r) => {
            logger.debug('==============removeAdmin',r);
        });
    }
}

 // ================================================ 本地
interface Props {
    gid:number;
    ginfo:Json;
}