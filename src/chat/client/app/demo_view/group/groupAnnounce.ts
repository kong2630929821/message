/**
 * 群公告
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { factorial } from '../../../../../pi/util/math';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { Logger } from '../../../../utils/logger';
import * as store from '../../data/store';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class GroupAnnounce extends Widget {
    public ok:() => void;
    public props:Props = {
        gid:null,
        aIncIdArray:[]
    };
    public setProps(props:any) {
        super.setProps(props); 
        this.props.aIncIdArray = store.getStore(`groupInfoMap/${this.props.gid}`,new GroupInfo()).annoceids;
    }
    public goBack() {
        this.ok();
    }
    public firstPaint() {
        super.firstPaint();
        // store.register(`groupInfoMap/${this.props.gid}`,() => {
        //     this.setProps(this.props);
        //     this.paint();
        // });
        store.register(`announceHistoryMap`,() => {
            this.setProps(this.props);
            this.paint();
        });
    }
    // 编辑群公告
    public editGroupAnnounce() {
        const uid = store.getStore('uid');
        const ownerid = store.getStore(`groupInfoMap/${this.props.gid}`,new GroupInfo()).ownerid;
        // 群主才能编辑公告
        if (uid === ownerid) {
            popNew('chat-client-app-demo_view-group-announceEdit',{ gid:this.props.gid });
        }
    }
    
}

// ================================================ 本地
interface Props {
    gid:number;
    aIncIdArray:string[]; // 公告消息记录
}