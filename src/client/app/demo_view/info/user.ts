/**
 * 我的个人信息
 */
// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { UserInfo } from '../../../../server/data/db/user.s';
import { changeUserInfo } from '../../../../server/data/rpc/user.p';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';
export class User extends Widget {
    public ok:() => void;
    constructor() {
        super();
        this.props = {
            sid:0,
            info:new UserInfo(),
            tel:'',
            name:'',
            nameEdit:false,
            phoneEdit:false
        };
    }

    public create() {
        super.create();
        this.props.sid = store.getStore('uid');
        this.props.info = store.getStore(`userInfoMap/${this.props.sid}`,new UserInfo());
        this.props.tel = this.props.info.tel || '未知';
        this.props.name = this.props.info.name;
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
        this.props.nameEdit = false;
        this.props.phoneEdit = false;
        this.paint();
    }

    /**
     * 点击后可编辑昵称
     */
    public editName() {
        this.props.nameEdit = true;
        this.paint();
    }

    /**
     * 昵称更改
     */
    public nameChange(e:any) {
        this.props.name = e.value;
        this.paint();
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
        test.avator = userinfo.avator;
        test.sex = userinfo.sex;
        test.note = userinfo.note;
        
        clientRpcFunc(changeUserInfo, test, (r: UserInfo) => {
            // todo
            if (r.uid !== -1) {
                const sid = store.getStore('uid');
                store.setStore(`userInfoMap/${sid}`,test);
                console.log('修改个人信息成功',r);
            }
        });
    }
}   
