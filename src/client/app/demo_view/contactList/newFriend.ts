/**
 * 新朋友验证状态
 */
// ================================================ 导入
import { Json } from '../../../../pi/lang/type';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { Contact } from '../../../../server/data/db/user.s';
import { Result, UserArray } from '../../../../server/data/rpc/basic.s';
import { Logger } from '../../../../utils/logger';
import { acceptFriend, getUsersBasicInfo } from '../../../app/net/rpc';
import { GroupAgree } from '../../../../server/data/rpc/group.s';
import * as  store from '../../data/store';
import { clientRpcFunc } from '../../net/init';
import { agreeJoinGroup } from '../../../../server/data/rpc/group.p';
import { GroupInfo } from '../../../../server/data/db/group.s';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class NewFriend extends Widget {
    public ok:() => void;
    public props:Props = {
    	applyGroup:[]
    };
    
    
    public setProps(props:Json) {
        super.setProps(props);
        console.log('hhhhhhhhhh',props);
	this.props.applyGroup = props.applyGroup;
    }

    public goBack() {
        this.ok();
    }

    public agreeClick(e:any) {
        const v = parseInt(e.value,10);
        console.log(v);
        acceptFriend(v,true,(r:Result) => {
            // TODO:
        });
    }

    //同意入群申请
    public agreeGroupApply(e:any){
        const gid = parseInt(e.value,10);
        console.log(gid);

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
}

// ================================================ 本地
interface Props {
    applyGroup:number[];
}
store.register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (const value of r.values()) {
        forelet.paint(value);
    }    
});