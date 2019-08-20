/**
 * 我的个人信息
 */
// ================================================ 导入
import { popNewMessage } from '../../../../../app/utils/tools';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { UserInfo } from '../../../../server/data/db/user.s';
import * as store from '../../data/store';
import { copyToClipboard, getUserAvatar } from '../../logic/logic';

export class User extends Widget {
    public ok:() => void;
    public props:Props;
    constructor() {
        super();
        this.props = {
            sid:0,
            info:new UserInfo(),
            tel:'',
            name:'',
            phoneEdit:false,
            avatar:''
        };
    }

    public create() {
        super.create();
        this.props.sid = store.getStore('uid');
        this.props.info = store.getStore(`userInfoMap/${this.props.sid}`,new UserInfo());
        this.props.tel = this.props.info.tel || '未知';
        this.props.name = this.props.info.name;
        this.props.avatar = getUserAvatar(this.props.sid) || '../../res/images/user_avatar.png';
    }

    public goBack() {
        this.ok();
    } 

    /**
     * 页面点击
     */
    public pageClick() {
        const userinfo = store.getStore(`userInfoMap/${this.props.sid}`,new UserInfo());
        this.props.name = this.props.name || userinfo.name;
        this.props.tel = this.props.tel || '未知';
        this.props.phoneEdit = false;
        this.paint();
    }

    /**
     * 点击复制
     */
    public doCopy(i:number) {
        if (i === 0) {
            copyToClipboard(this.props.sid);
        } else if (i === 1) {
            copyToClipboard(this.props.info.acc_id);
        } else {
            copyToClipboard('未知');
        }
        popNewMessage('复制成功');
    }

    // 点击查看大图头像
    public showBigImg() {
        popNew('chat-client-app-widget-bigImage-bigImage',{ img: this.props.avatar });
    }
}   

interface Props  {
    sid:number;
    info:UserInfo;
    tel:string;
    name:string;
    phoneEdit:boolean;
    avatar:string;
}