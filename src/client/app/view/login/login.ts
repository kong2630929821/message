/**
 * 登录
 */

 // ================================================ 导入
 import {Widget} from "../../../../pi/widget/widget";
 import {Forelet} from "../../../../pi/widget/forelet";
 import {popNew} from "../../../../pi/ui/root";
 import { login as userLogin} from '../../net/rpc';
 import {UserInfo} from "../../../../server/data/db/user.s";
 import * as subscribedb from "../../net/subscribedb";
 import { Logger } from '../../../../utils/logger';
import { subscribe as subscribeMsg} from "../../net/init";
import { UserHistory, UserMsg } from "../../../../server/data/db/message.s";

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

 // ================================================ 导出
 export class Login extends Widget {
     props = {
         uid:null,
         passwd:"",
         visible: false,// 密码可见性
         isClear: false//密码是否可清除
     } as Props

    inputName(e){
        console.log("inputName",e.value)
        this.props.uid = parseInt(e.value);
    }

    inputPasswd(e){
        console.log("inputPasswd",e.value)
        this.props.passwd = e.value;
        if(e.value){
            this.props.isClear = true;
        }
        else{
            this.props.isClear = false;
        }
        this.paint();
    }
    // 改变眼睛状态
    changeEye(){
        let temp = !this.props.visible;
        this.props.visible = temp;
        this.paint();
    }

    openRegister(){
        popNew("client-app-view-register-register")
    }

    login(e){
        // 1 登陆
        //     - 通过uid去subscribeDB，监听表
        //         + contactMap
        //     - 主动获取
        //         +　friendLinkMap
        //         +　userInfoMap
        //     - 订阅自己的主题subscribeMsg
        //         + (r:UserHistory)=>{
        //             updateMap...
        //                 userChatMap
        //                 userHistoryMap
        //                 lastChat
        //         }
        userLogin(this.props.uid,this.props.passwd, (r:UserInfo)=>{
            if(r.uid > 0){
                logger.debug(JSON.stringify(r));
                popNew("client-app-view-recentHistory-recentHistory")
                // 订阅消息主题 别人发消息可以收到
                subscribeMsg(r.uid.toString(),UserMsg,(r:UserMsg) => {

                });
                // 订阅数据库表
                subscribeDB(r.uid);
            }
        })
    }
 }

 /**
 * 登录成功订阅各种数据表的变化
 * @param uid 
 */
const subscribeDB = (uid:number)=>{
    subscribedb.subscribeContact(uid,null);
}
 // ================================================ 本地
 interface Props  {
     uid:number,
     passwd:string,
     visible:boolean,
     isClear:boolean
 }