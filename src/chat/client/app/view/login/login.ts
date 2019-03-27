/**
 * 登录
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { UserInfo } from '../../../../server/data/db/user.s';
import { SendMsg } from '../../../../server/data/rpc/message.s';
import * as store from '../../data/store';
import { init, subscribe as subscribeMsg } from '../../net/init';
import { getFriendHistory, login as userLogin } from '../../net/rpc';

// ================================================ 导出
export class Login extends Widget {
    constructor() {
        super();
        this.props = {
            uid: null,
            passwd: '',
            visible: false,// 密码可见性
            isClear: false// 密码是否可清除
        };
    }

    public inputName(e: any) {
        this.props.uid = parseInt(e.value, 10);
    }

    public inputPasswd(e: any) {
        this.props.passwd = e.value;
        if (e.value) {
            this.props.isClear = true;
        } else {
            this.props.isClear = false;
        }
        this.paint();
    }

    public openRegister() {
        popNew('chat-client-app-view-register-register');
    }

    public login(e: any) {
        // 让所有输入框的失去焦点
        const inputs = getRealNode(this.tree).getElementsByTagName('input');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].blur();
        }

        userLogin(this.props.uid, this.props.passwd, (r: UserInfo) => {
            if (r.uid > 0) {
                store.setStore(`uid`, r.uid);
                store.setStore(`userInfoMap/${r.uid}`, r);
                init(r.uid);
                popNew('chat-client-app-view-chat-contact', { sid: this.props.uid });
                subscribeMsg(this.props.uid.toString(), SendMsg, (v: SendMsg) => {   // 订阅发送给我的消息
                    if (v.code === 1) {
                        getFriendHistory(v.rid);
                    }
                });
            }
        });

    }

    /**
     * 切换密码是否可见
     */
    public changeEye() {
        this.props.visible = !this.props.visible;
        this.paint();
    }

}
