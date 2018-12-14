/**
 * 群聊天最近群公告项
 */

// ================================================ 导入
import { Json } from '../../../../pi/lang/type';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { AnnounceHistory, MSG_TYPE } from '../../../../server/data/db/message.s';
import { Logger } from '../../../../utils/logger';
import * as store from '../../data/store';
import { timestampFormat } from '../../logic/logic';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class LatestAnnounceItem extends Widget {
    public props:Props = {
        gid:null,
        aIncId : '',
        announce: null,
        time:'',
        isOwner:false
    };
    public setProps(props:any) {
        super.setProps(props); 
        logger.debug(props.aIncId,'=======LatestAnnounceItem======',this.props.aIncId);
        this.props.announce = store.getStore(`announceHistoryMap/${this.props.aIncId}`,new AnnounceHistory()).announce;
        logger.debug('====this.props.announce',this.props.announce);
        const uid = store.getStore('uid');
        const ownerid = store.getStore(`groupInfoMap/${this.props.gid}`,new GroupInfo()).ownerid;
        this.props.isOwner = uid === ownerid;
    }
    public firstPaint() {
        super.firstPaint();
        // 当公告消息撤回 更新map
        store.register(`announceHistoryMap`,() => {
            this.setProps(this.props);
            this.paint();
        });  
    }
    // 撤销最近公告项
    public recallLatestAnnounce(e:any) {
        logger.debug('recallLatestAnnounce');
        // 群主才能撤销公告
        if (this.props.isOwner) {
            notify(e.node,'ev-send',{ value:this.props.aIncId, msgType:MSG_TYPE.RENOTICE });
        }
    }
}

// ================================================ 本地
interface Props {
    gid:number;
    aIncId:string;
    announce:any; // 公告详细
    time:string;
    isOwner:boolean; // 是否群主
}
