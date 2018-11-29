/**
 * 通讯录
 */

 // ================================================ 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { Contact } from '../../../../server/data/db/user.s';
import { Result, UserArray } from '../../../../server/data/rpc/basic.s';
import { Logger } from '../../../../utils/logger';
import * as store from '../../data/store';
import { getUsersBasicInfo, login as userLogin } from '../../net/rpc';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
// ================================================ 导出
export const forelet = new Forelet();

export class ContactList extends Widget {
    public props:Props = {
        sid:null,
        applyUserCount:null,
        friends:[],
        applyUser:[],
        userList:[]
    };
    public state:Map<number, Contact> = new Map();
    public ok:() => void;

    public setProps(props:Props,oldProps:JSON) {
        console.log('=========通讯录setProps',props);
        super.setProps(props,oldProps);
        // modify props
        this.props = props;
        this.props.friends = this.state.get(this.props.sid).friends;
        this.props.applyUser = this.state.get(this.props.sid).applyUser;
        this.props.applyUserCount = this.props.applyUser.length;
        this.props.userList = [];
        this.getFriends();
        // this.props.sid = 10000;
    }
     // 返回上一页
    public back() {
        this.ok();
    }
     // 获取friends信息
    public getFriends() {
        getUsersBasicInfo(this.props.friends,(r:UserArray) => {
            console.log('===通讯录好友信息===',r);
            r.arr.map(item => {
                const obj = {
                    uid :item.uid,
                    avatorPath : 'user.png',
                    text:item.uid.toString()
                };
                this.props.userList.push(obj);
            });
            this.paint();                    
        });
    }
     // 跳转至新的朋友验证状态界面
    public toNewFriend() {
        console.log('===========toNewFriend');
        popNew('client-app-view-addUser-newFriend',{ applyUserIds:this.props.applyUser });
    }
}

 // ================================================ 本地
interface UserList {
    uid: number;
    avatorPath: string;// 头像
    text: string;// 文本
}
interface Props {
    sid:number;
    applyUserCount:number;
    friends:number[];
    applyUser:number[];
    userList: UserList[]; 
}

type State = Map<number, Contact>;

store.register('contactMap',(r: Map<number, Contact>) => {
    forelet.paint(r);
    const w = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.setProps(w.props);
        w.paint();
    }
});