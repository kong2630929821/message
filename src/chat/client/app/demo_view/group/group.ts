/**
 * 登录
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { Contact } from '../../../../server/data/db/user.s';
import { Result } from '../../../../server/data/rpc/basic.s';
import { agreeJoinGroup } from '../../../../server/data/rpc/group.p';
import { GroupAgree } from '../../../../server/data/rpc/group.s';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';
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
            gid: null
        };
        this.state = new Map();
    }

    public returnFunc() {
        this.ok();
    }

    public inputUid(e:any) {
        this.props.gid = parseInt(e.text,10);
    }

    public applyJoinGroup() {
        // TODO:
    }
    public chat(gid:number) {
        popNew('chat-client-app-demo_view-chat-group', { gid:gid });
    }
    public agree(gid:number) {
        const agree = new GroupAgree();
        agree.agree = true;
        agree.gid = gid;
        agree.uid = store.getStore(`uid`);
        clientRpcFunc(agreeJoinGroup, agree,(gInfo:GroupInfo) => {
            if (gInfo.gid === -1) {

                return;
            }
            store.setStore(`groupInfoMap/${gInfo.gid}`,gInfo);
        });
    }
    public reject(gid:number) {
        const agree = new GroupAgree();
        agree.agree = false;
        agree.gid = gid;
        agree.uid = store.getStore(`uid`);
        clientRpcFunc(agreeJoinGroup, agree,(gInfo:GroupInfo) => {
            if (gInfo.gid === -1) {

                return;
            }
            store.setStore(`groupInfoMap/${gInfo.gid}`,gInfo);
        });
    }
    public showInfo(gid:number) {
        // popNew('chat-client-app-demo_view-chat-group', { gid:gid });
    }
    public delGroup(uid:number) {
        // TODO:
    }
}

// ================================================ 本地
interface Props {
    gid: number;
}
type State = Contact;

store.register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map        
    for (const value of r.values()) {
        forelet.paint(value);
    }    
    
});