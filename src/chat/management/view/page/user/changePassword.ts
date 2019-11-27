import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    password:string;// 密码
    isChange:boolean;// 是否修改密码 true 可修改 false 不可修改
    id:string;
}

/**
 * 修改密码
 */
export class ChangePassword extends Widget {

    public props:Props = {
        password:'',
        isChange:false,
        id:'123333'
    };

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
        this.props.isChange  = false; 
        this.paint();
    }

    /**
     * 保存修改
     */
    public saveChange() {
        this.props.isChange = false;
        this.paint();
    }
}