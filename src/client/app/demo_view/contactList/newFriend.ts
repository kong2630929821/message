/**
 * 新朋友验证状态
 */
// ================================================ 导入
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
import { Result } from '../../../../server/data/rpc/basic.s';
import { Logger } from '../../../../utils/logger';
import { acceptFriend } from '../../../app/net/rpc';

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
        applyUserList:[]
    };
    public setProps(props:Json) {
        super.setProps(props);
        this.props.applyUser = props.applyUser;
        
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
    applyUserList : ApplyUserList[];
}
