/**
 * 添加管理员
 */

 // ================================================ 导入
import { popNewMessage } from '../../../../../app/utils/tools';
import { Json } from '../../../../../pi/lang/type';
import { Widget } from '../../../../../pi/widget/widget';
import { Logger } from '../../../../utils/logger';
import { delValueFromArray } from '../../../../utils/util';
import * as store from '../../data/store';
import { addAdministror } from '../../net/rpc';

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
        this.ok && this.ok();
    }
    public getGroupInfo(gid:number) {
        const ginfo = store.getStore(`groupInfoMap/${gid}`);
        logger.debug('============ginfo',ginfo);

        return ginfo;
    }
    // 选择成员
    public addAdminMember(e:any) {
        const uid = e.value;
        logger.debug('添加管理员',uid);
        if (this.props.applyAdminMembers.findIndex(item => item === uid) === -1) {
            this.props.applyAdminMembers.push(uid);
        } else {
            this.props.applyAdminMembers = delValueFromArray(uid, this.props.applyAdminMembers);
        }
        logger.debug(`applyAdminMembers is : ${JSON.stringify(this.props.applyAdminMembers)}`);
    }

    // 点击添加管理员
    public completeAddAdmin() {
        if (this.props.applyAdminMembers.length <= 0) {
            return ;
        }

        addAdministror(this.props.gid,this.props.applyAdminMembers).then(() => {
            this.goBack();
        },(r) => {
            if (r.r === -2) {
                popNewMessage('最多可设置5个管理员');
            }
        });
        
    }
}

 // ================================================ 本地
interface Props {
    gid:number;
    ginfo:Json;
    applyAdminMembers:number[];
}