/**
 * 用户详细信息
 */
// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { FriendLink, UserInfo } from '../../../../server/data/db/user.s';
import { genUuid } from '../../../../utils/util';
import * as store from '../../data/store';
export class User extends Widget {
    public props:Props;
    public ok:() => void;
    constructor() {
        super();
        this.props = {
            sid:-1,
            rid:-1,
            info : new UserInfo(),
            alias:''
        };
    }
    public setProps(props:any) {
        super.setProps(props);
        this.props.info = store.getStore(`userInfoMap/${this.props.rid}`,new UserInfo());
        this.props.alias = store.getStore(`friendLinkMap/${genUuid(this.props.sid,this.props.rid)}`,new FriendLink()).alias;
    }
    public back() {
        this.ok();
    } 
}   

interface Props {
    sid:number;
    rid:number;
    info:UserInfo;
    alias:string;
}