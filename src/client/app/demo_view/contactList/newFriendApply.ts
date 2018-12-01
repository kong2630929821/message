/**
 * 新朋友验证信息
 */

// ================================================ 导入
import { Widget } from '../../../../pi/widget/widget';
import { Result } from '../../../../server/data/rpc/basic.s';
import { Logger } from '../../../../utils/logger';
import { acceptFriend } from '../../../app/net/rpc';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class NewFriendApply extends Widget {
    public ok:() => void;
    public props:Props = {
        uid:null,
        applyInfo: '',
        info:{},
        isSolve:''
    };
    public setProps(props:any) {
        super.setProps(props);
        this.props.isSolve = props.isagree ? '已同意' :'';
    }

    public goBack() {
        this.ok();
    }

    // 点击拒绝添加好友
    public reject() {
        acceptFriend(this.props.uid,false,(r:Result) => {
            // TODO:
            this.props.isSolve = '已拒绝';
            this.paint();
        });
    }

    // 点击同意添加好友
    public agree() {
        acceptFriend(this.props.uid,true,(r:Result) => {
            // TODO:
            this.props.isSolve = '已同意';
            this.paint();
        });
    }
    
}

// ================================================ 本地

interface Props {
    uid:number;
    info:any;
    applyInfo: string;
    isSolve:string;
}
