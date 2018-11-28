/**
 * 登录
 */

 // ================================================ 导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { UserMsg } from '../../../../server/data/db/message.s';
import { UserInfo } from '../../../../server/data/db/user.s';
import { Logger } from '../../../../utils/logger';
import { subscribe as subscribeMsg } from '../../net/init';
import { login as userLogin } from '../../net/rpc';
import * as subscribedb from '../../net/subscribedb';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

 // ================================================ 导出
export class Login extends Widget {
    public props:Props;
    constructor() {
        super();
        this.props = {
            uid:null,
            passwd:'',
            visible: false,// 密码可见性
        };
    }

    public inputName(e:any) {
        this.props.uid = parseInt(e.value,10);
    }

    public inputPasswd(e:any) {
        this.props.passwd = e.value;
    }
    // 改变眼睛状态
    public changeEye() {
        const temp = !this.props.visible;
        this.props.visible = temp;
        this.paint();
    }

    public openRegister() {
        popNew('client-app-view-register-register');
    }

    public login(e:any) {
        // 1 登陆
        //     - 通过uid去subscribeDB，监听表
        //         + contactMap
        //     - 主动获取
        //         + friendLinkMap
        //         + userInfoMap
        //     - 订阅自己的主题subscribeMsg
        //         + (r:UserHistory)=>{
        //             updateMap...
        //                 userChatMap
        //                 userHistoryMap
        //                 lastChat
        //         }
        userLogin(this.props.uid,this.props.passwd, (r:UserInfo) => {
            console.log('=====fff=====',r);
            // popNew("client-app-view-recentHistory-recentHistory",{"uid":10001})
            if (r.uid > 0) {
                logger.debug(JSON.stringify(r));
                popNew('client-app-view-recentHistory-recentHistory', { uid: this.props.uid });
                // 订阅消息主题 别人发消息可以收到
                subscribeMsg(r.uid.toString(),UserMsg,(r:UserMsg) => {
                    // TODO:
                });
                // 订阅数据库表
                subscribeDB(r.uid);
            }
        });
    }
}

/**
 * 登录成功订阅各种数据表的变化
 * @param uid user id
 */
const subscribeDB = (uid:number) => {
    subscribedb.subscribeContact(uid,null);
};
 // ================================================ 本地
interface Props  {
    uid:number;
    passwd:string;
    visible:boolean;
}