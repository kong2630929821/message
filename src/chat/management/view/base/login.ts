import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { createRootTest, getAllGameInfo, getAllGameList, managementLogin } from '../../net/rpc';
import { setStore } from '../../store/memstore';
import { popNewMessage } from '../../utils/logic';
import { rippleShow } from '../../utils/tools';
/**
 * 登陆
 */
export class Login extends Widget {
    public props:any = {
        name:'',
        pwd:''
    };

    public nameChange(e:any) {
        this.props.name = e.value;
    }

    public pwdChange(e:any) {
        this.props.pwd = e.value;
    }

    public keydown(e:any) {
        if (e.value === 'Enter') {
            this.loginUser();
        }
    }

    public loginUser() {
        // popNew('chat-management-view-base-home');
        if (this.props.name && this.props.pwd) {
            managementLogin(this.props.name,this.props.pwd).then(r => {
                if (r === 1) {
                    this.loginSuccess();
                } else {
                    popNewMessage('账号密码错误');
                }
            }).catch(() => {
                popNewMessage('账号密码错误','error');
            });
        } else {
            popNewMessage('请输入账号密码','warn');
        }
    }

    // 注册
    public reg() {
        if (this.props.name && this.props.pwd) {
            createRootTest(this.props.name,this.props.pwd).then(r => {
                if (r === 1) {
                    popNewMessage('注册成功');
                } else {
                    popNewMessage('注册失败');
                }
            }).catch(() => {
                popNewMessage('注册失败','error');
            });
        } else {
            popNewMessage('请输入账号密码','warn');
        }
    }
    
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    /**
     * 登录成功
     */
    public loginSuccess() {
        // 获取全部游戏
        getAllGameList().then(r => {
            if (r.length) {
                const appId = JSON.stringify(r);
                getAllGameInfo(appId).then(r => {
                    console.log(`全部应用========appId==${appId}================`,r);
                    setStore('appList',r);
                });
            }
        });
        popNew('chat-management-view-base-home');
    }
}