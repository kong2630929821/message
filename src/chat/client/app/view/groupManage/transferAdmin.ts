/**
 * 转让群主
 */

 // ================================================ 导入
import { popNewMessage } from '../../../../../app/utils/tools';
import { Json } from '../../../../../pi/lang/type';
import { popModalBoxs } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { setOwner } from '../../../../server/data/rpc/group.p';
import { Logger } from '../../../../utils/logger';
import { genGuid } from '../../../../utils/util';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
 // tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
export const forelet = new Forelet();
const logger = new Logger(WIDGET_NAME);

export class TransferGroupOwner extends Widget {
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
    public getGroupInfo(gid:number) {
        const ginfo = store.getStore(`groupInfoMap/${gid}`);
        logger.debug('============ginfo',ginfo);

        return ginfo;
    }
    public openConfirmTranBox(uid:number) {
        const groupUser = store.getStore(`groupUserLinkMap/${genGuid(this.props.gid, uid)}`,{ userAlias:'' });
        const modalObj = { content:`"${groupUser.userAlias}"将成为新群主，确认后您将你失去群主身份。`,sureText:'确定',cancelText:'取消',style:'color:#F7931A' };
        const guid = genGuid(this.props.gid,uid);
        popModalBoxs('chat-client-app-widget-modalBox-modalBox',modalObj,
        () => {
            clientRpcFunc(setOwner,guid,(r) => {
                popNewMessage('转让群主成功');
                this.ok();
            });
        },
        () => {
            logger.debug('=============== cancel transGroupOwner');
        }
    );
        this.paint();
    }
}

 // ================================================ 本地
interface Props {
    gid:number;
    ginfo:Json;
}
