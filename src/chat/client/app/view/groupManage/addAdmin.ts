
 // ================================================ 导入
import { popNewMessage } from '../../../../../app/utils/pureUtils';
import { Json } from '../../../../../pi/lang/type';
import { Widget } from '../../../../../pi/widget/widget';
import { delValueFromArray } from '../../../../utils/util';
import * as store from '../../data/store';
import { addAdministror } from '../../net/rpc';

 // ================================================ 导出
/**
 * 添加管理员
 */
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
        this.props.ginfo = store.getStore(`groupInfoMap/${this.props.gid}`);
        this.props.applyAdminMembers = [];
    }
    public goBack() {
        this.ok && this.ok();
    }
    
    // 选择成员
    public addAdminMember(e:any) {
        const uid = e.value;
        if (this.props.applyAdminMembers.findIndex(item => item === uid) === -1) {
            this.props.applyAdminMembers.push(uid);
        } else {
            this.props.applyAdminMembers = delValueFromArray(uid, this.props.applyAdminMembers);
        }
    }

    // 点击添加管理员
    public completeAddAdmin() {
        if (this.props.applyAdminMembers.length <= 0) {
            return ;
        }

        addAdministror(this.props.gid,this.props.applyAdminMembers).then(() => {
            popNewMessage('设置管理员成功');
            this.goBack();
        }).catch((err) => {
            if (err && err.r === -2) {
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