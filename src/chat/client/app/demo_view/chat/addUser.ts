/**
 * 登录
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { Contact } from '../../../../server/data/db/user.s';
import { Result } from '../../../../server/data/rpc/basic.s';
import * as store from '../../data/store';
import { acceptFriend, applyFriend as applyUserFriend, delFriend as delUserFriend } from '../../net/rpc';

// ================================================ 导出
export const forelet = new Forelet();

export class AddUser extends Widget {
    public props:Props;
    public state:Contact;
    public ok:() => void;
    constructor() {
        super();
        this.props = {
            sid: null,
            rid: null
        };
    }

    public back() {
        this.ok();
    }

    public inputUid(e:any) {
        this.props.rid = parseInt(e.value,10);
    }

    public applyFriend() {
        const sid = store.getStore('uid');
        if (this.props.rid === sid) {
            alert('不能添加自己为好友');

            return;
        }
        applyUserFriend(this.props.rid,(r:Result) => {
            if (r.r === 0) {
                alert(`${this.props.rid}已经是你的好友`);
    
                return;
            }
        });
    }
    public chat(uid:number) {
        popNew('chat-client-app-demo_view-chat-chat', { sid:this.props.sid,rid:uid });
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
        popNew('chat-client-app-demo_view-info-user', { sid:this.props.sid,rid:uid });
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

store.register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (const value of r.values()) {
        forelet.paint(value);
    }    
});