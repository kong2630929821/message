/**
 * 新朋友验证状态
 */
// ================================================ 导入
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
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
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class NewFriend extends Widget {
    public ok:() => void;
    public props:Props = {
        sid:null,
        applyUser:[],
        applyGroup:[],
        applyUserList:[]
    };
    public setProps(props:Json) {
        super.setProps(props);
        console.log('hhhhhhhhhh',props);
        this.props.applyUser = props.applyUser;
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
interface ApplyUserList {
    uid:number;// id
    avatorPath : string;// 头像
    userName : string;// 用户名
    applyInfo : string; // 其他
}
interface Props {
    sid: number;
    applyUser:number[];
    applyGroup:number[];
    applyUserList : ApplyUserList[];
}
