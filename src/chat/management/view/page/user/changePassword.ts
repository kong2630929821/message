import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    password:string;// 密码
    isChange:number;// 是否修改密码 0没有修改 1修改 2保存
}

/**
 * 修改密码
 */
export class ChangePassword extends Widget {

    public props:Props = {
        password:'',
        isChange:0
    };
}