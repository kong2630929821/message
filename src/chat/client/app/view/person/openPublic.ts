import { Widget } from '../../../../../pi/widget/widget';

/**
 * 申请公众号
 */
export class OpenPublic extends Widget {
    public props:any = {
        chooseImage:false,
        avatar:'',
        avatarHtml:'',
        publicName:'',
        userProtocolReaded:false,
        contentInput:''
    };
}