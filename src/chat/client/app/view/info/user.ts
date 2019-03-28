/**
 * 我的个人信息
 */
// ================================================ 导入
import { popNewMessage } from '../../../../../app/utils/tools';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { UserInfo } from '../../../../server/data/db/user.s';
import { changeUserInfo } from '../../../../server/data/rpc/user.p';
import * as store from '../../data/store';
import { copyToClipboard, getUserAvatar } from '../../logic/logic';
import { clientRpcFunc } from '../../net/init';

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

    // /**
    //  * 点击后可编辑昵称
    //  */
    // public editName() {
    //     this.props.nameEdit = true;
    //     this.paint();
    // }

    /**
     * 昵称更改
     */
    public nameChange() {
        popNew('chat-client-app-widget-pageEdit-pageEdit',{ title:'修改昵称', contentInput:this.props.name },(res:any) => {
            const userinfo = store.getStore(`userInfoMap/${this.props.sid}`,new UserInfo());
            const test = new UserInfo();
            test.uid = this.props.sid;
            test.name = res.content;
            test.tel = userinfo.tel;
            test.avatar = userinfo.avatar;
            test.sex = userinfo.sex;
            test.note = userinfo.note;
            test.wallet_addr = userinfo.wallet_addr;
            test.acc_id = userinfo.acc_id;
        
            clientRpcFunc(changeUserInfo, test, (r: UserInfo) => {
                if (r && r.uid > 0) {
                    store.setStore(`userInfoMap/${this.props.sid}`,test);
                    popNewMessage('修改个人信息成功');
                } else {
                    popNewMessage('修改个人信息失败');
                }
            });
        });
        
    }

    /**
     * 点击后可编辑电话号码
     */
    public editPhone() {
        this.props.phoneEdit = true;
        this.paint();
    }

    /**
     * 电话更改
     */
    public phoneChange(e:any) {
        this.props.tel = e.value;
        this.paint();
    }

    /**
     * 修改个人信息
     */
    public changeUserInfo() {
        const userinfo = store.getStore(`userInfoMap/${this.props.sid}`,new UserInfo());
        const test = new UserInfo();
        test.uid = this.props.sid;
        test.name = this.props.name;
        test.tel = this.props.tel;
        test.avatar = userinfo.avatar;
        test.sex = userinfo.sex;
        test.note = userinfo.note;
        test.wallet_addr = userinfo.wallet_addr;
        test.acc_id = userinfo.acc_id;
        
        clientRpcFunc(changeUserInfo, test, (r: UserInfo) => {
            // todo
            if (r && r.uid > 0) {
                store.setStore(`userInfoMap/${this.props.sid}`,test);
                popNewMessage('修改个人信息成功');
            } else {
                popNewMessage('修改个人信息失败');
            }
        });
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
            copyToClipboard(this.props.info.tel || '未知');
        }
        popNewMessage('复制成功');
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