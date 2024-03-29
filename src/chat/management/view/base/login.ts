import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { ADMINISTRATOR, HAOHAICUSTOMERSERVICE, OFFICIAL } from '../../config';
import { createRootTest, getAllGameInfo, getAllGameList, getHotApp, getOfficialList, getRecommendApp, managementLogin } from '../../net/rpc';
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
        
        // 保存账号
        setStore('flags/account',this.props.name);

        // 保存密码
        setStore('flags/pwd',this.props.pwd);

        // 判断权限
        const account = this.props.name.split('@');
        // 存在@符号的账号则为官方账号 num为账号中@符号后的字段 uid为@符号前的字段
        if (account[1]) {

            // 官方账号
            setStore('flags/auth',OFFICIAL);
            setStore('flags/num',account[1]);
            setStore('uid',account[0]);
        } else {
            setStore('flags/num',0);
            if (/^[0-9]+$/.test(account[0])) {
                // 好嗨客服
                setStore('flags/auth',HAOHAICUSTOMERSERVICE);
            } else {
                // 管理员
                setStore('flags/auth',ADMINISTRATOR);
            }

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

            // 获取热门游戏
            getHotApp().then(r => {
                if (r) {
                    getAllGameInfo(r).then(res => {
                        setStore('hotApp',res);
                        console.log('获取热门游戏',res);
                    });
                }
            });

            // 获取推荐游戏
            getRecommendApp().then(r => {
                if (r) {
                    getAllGameInfo(r).then(res => {
                        setStore('recommendApp',res);
                        console.log('获取推荐游戏',res);
                    });
                }
            });
            
            // 获取绑定的appid
            getOfficialList();
        }

        // 进入管理端
        popNew('chat-management-view-base-home');
        
    }
}