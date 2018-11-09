/**
 * 通讯录
 */

 // ================================================ 导入
 import { Widget } from "../../../../pi/widget/widget";
 import { Forelet } from "../../../../pi/widget/forelet";
 import { popNew } from "../../../../pi/ui/root";
 import { login as userLogin, getUsersBasicInfo} from '../../net/rpc';
 import * as store from "../../data/store";
 import { Contact } from "../../../../server/data/db/user.s";
 import { Result, UserArray} from "../../../../server/data/rpc/basic.s";
 import { Logger } from '../../../../utils/logger';

declare var module;
export const forelet = new Forelet;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

 // ================================================ 导出
 export class ContactList extends Widget {
     props = {
         sid:null,
         applyUserCount:null,
         friends:[],
         applyUser:[],
         userList:[]
     }  as Props
     state = new Map;
     ok:()=>void

     setProps(props,oldProps){
        console.log("=========通讯录setProps",props)
        super.setProps(props,oldProps);
        //modify props
        this.props = props;
        this.props.friends = this.state.get(this.props.sid).friends;
        this.props.applyUser = this.state.get(this.props.sid).applyUser;
        this.props.applyUserCount = this.props.applyUser.length;
        this.props.userList = [];
        this.getFriends();
        // this.props.sid = 10000;
     }
     // 返回上一页
     back(){
        this.ok();
     }
     // 获取friends信息
     public getFriends(){
        getUsersBasicInfo(this.props.friends,(r:UserArray) => {
            console.log("===通讯录好友信息===",r)
            r.arr.map( item => {
                let obj = {
                    uid :item.uid,
                    avatorPath : "user.png",
                    text:item.uid.toString(),
                };
                this.props.userList.push(obj);
            });
            this.paint();                    
        })
    }
     // 跳转至新的朋友验证状态界面
     toNewFriend(){
         console.log("===========toNewFriend")
        popNew("client-app-view-addUser-newFriend",{applyUserIds:this.props.applyUser});
     }
 }

 // ================================================ 本地
 interface UserList {
    uid: number;
    avatorPath: string;// 头像
    text: string;//文本
}
 interface Props {
     sid:number,
     applyUserCount:number,
     friends:Array<number>,
     applyUser:Array<number>,
     userList: UserList[] 
 }

 type State = Map<number, Contact>

 store.register("contactMap",(r: Map<number, Contact>) => {
    forelet.paint(r);
    let w = forelet.getWidget(WIDGET_NAME)
    if(w){
        w.setProps(w.props);
        w.paint()
    }
 })