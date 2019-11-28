import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { changePwd } from '../../../net/rpc';
import { getStore } from '../../../store/memstore';
import { popNewMessage } from '../../../utils/logic';

interface Props {
    password:string;// 密码
    isChange:boolean;// 是否修改密码 true 可修改 false 不可修改
    id:string;
}
let account = '';
let pwd = '';
/**
 * 修改密码
 */
export class ChangePassword extends Widget {

    public props:Props = {
        password:'',
        isChange:false,
        id:''
    };

    public create() {
        super.create();
        account = getStore('flags',{}).account;
        pwd = getStore('flags',{}).pwd;
        this.props.password = pwd ? pwd :'';
        this.props.id = account ? account :'';
    }

    public inputChangePass(e:any) {
        this.props.password = e.value;
    }
    /**
     * 修改密码
     */
    public changePassWord() {
        this.props.isChange = true;
        this.paint();
    }

    /**
     * 取消修改
     */
    public cancelChange() {
        this.props.password = pwd;
        this.props.isChange  = false; 
        this.paint();
    }

    /**
     * 保存修改
     */
    public saveChange() {
        changePwd(this.props.id,this.props.password).then(r => {
            if (r === 1) {
                popNewMessage('修改成功');
                this.props.isChange = false;
                this.paint();
                popNew('chat-management-view-base-login');
            } else {
                popNewMessage('修改失败');

            }
        });
    }
}