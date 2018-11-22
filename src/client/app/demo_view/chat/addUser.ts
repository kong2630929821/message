/**
 * 登录
 */

// ================================================ 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { Contact } from '../../../../server/data/db/user.s';
import { Result } from '../../../../server/data/rpc/basic.s';
import * as store from '../../data/store';
import { acceptFriend, applyFriend as applyUserFriend, delFriend as delUserFriend } from '../../net/rpc';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');

export class AddUser extends Widget {
    public props:Props;
    public state:Map<any,any>;
    public ok:() => void;
    constructor() {
        super();
        this.props = {
            sid: null,
            rid: null
        };
        this.state = new Map();
    }

    public returnFunc() {
        this.ok();
    }

    public inputUid(e:any) {
        this.props.rid = parseInt(e.text,10);
    }

    public applyFriend() {
        applyUserFriend(this.props.rid,(r:Result) => {
            // TODO:
        });
    }
    public chat(uid:number) {
        popNew('client-app-demo_view-chat-chat', { sid:this.props.sid,rid:uid });
    }
    public agree(uid:number) {
        acceptFriend(uid,true,(r:Result) => {
            // TODO:
        });
    }
    public reject(uid:number) {
        acceptFriend(uid,false,(r:Result) => {
            // TODO:
        });
    }
    public showInfo(uid:number) {
        popNew('client-app-demo_view-info-user', { sid:this.props.sid,rid:uid });
    }
    public delFriend(uid:number) {
        delUserFriend(uid,(r:Result) => {
            // TODO:
        });
    }
}

// ================================================ 本地
interface Props {
    sid: number;
    rid: number;
}
type State = Contact;

store.register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (const value of r.values()) {
        forelet.paint(value);
    }    
});