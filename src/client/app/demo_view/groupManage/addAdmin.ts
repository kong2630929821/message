/**
 * 添加管理员
 */

 // ================================================ 导入
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
import { addAdmin } from '../../../../server/data/rpc/group.p';
import { GuidsAdminArray } from '../../../../server/data/rpc/group.s';
import { Logger } from '../../../../utils/logger';
import { delValueFromArray, genGuid } from '../../../../utils/util';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

 // ================================================ 导出
 // tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class AddAdmin extends Widget {
    public ok:() => void;
    public props:Props = {
        gid:null,
        ginfo:{},
        applyAdminMembers:[]
    };
    public setProps(props:any) {
        super.setProps(props);
        this.props.gid = props.gid;
        this.props.ginfo = this.getGroupInfo(this.props.gid);
        this.props.applyAdminMembers = [];
    }
    public goBack() {
        this.ok();
    }
    public getGroupInfo(gid:number) {
        const ginfo = store.getStore(`groupInfoMap/${gid}`);
        logger.debug('============ginfo',ginfo);

        return ginfo;
    }
    // 添加管理员
    public addAdminMember(uid:number) {
        if (this.props.applyAdminMembers.findIndex(item => item === uid) === -1) {
            this.props.applyAdminMembers.push(uid);
        } else {
            this.props.applyAdminMembers = delValueFromArray(uid, this.props.applyAdminMembers);
        }
        logger.debug(`applyAdminMembers is : ${JSON.stringify(this.props.applyAdminMembers)}`);
    }
    // 点击添加
    public completeAddAdmin() {
        if (this.props.applyAdminMembers.length <= 0) {
            return ;
        }
        const guidsAdmin = new GuidsAdminArray();
        const guids = this.props.applyAdminMembers.map(item => genGuid(this.props.gid,item));
        logger.debug('===============',guids,typeof guids);
        guidsAdmin.guids = guids;
        clientRpcFunc(addAdmin,guidsAdmin,(r) => {
            logger.debug('=============completeAddAdmin',r);
        });
    }
}

 // ================================================ 本地
interface Props {
    gid:number;
    ginfo:Json;
    applyAdminMembers:number[];
}