/**
 * 群聊天最近群公告项
 */

// ================================================ 导入
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { Announcement } from '../../../../server/data/db/message.s';
import { Logger } from '../../../../utils/logger';
import { depCopy } from '../../../../utils/util';
import * as store from '../../data/store';

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
        noticeTitle:''
    };
    public setProps(props:any) {
        super.setProps(props); 
        this.props.announce = store.getStore(`announceHistoryMap/${this.props.aIncId}`,new Announcement());
        if (this.props.announce) {
            const notice = depCopy(this.props.announce.msg);
            this.props.noticeTitle = JSON.parse(notice).title;
        }
    }
    public firstPaint() {
        super.firstPaint();
        // 当公告消息撤回 更新map
        store.register(`announceHistoryMap`,() => {
            this.setProps(this.props);
            this.paint();
        });  
    }
    // 关闭公告
    public closeAnnounce(e:any) {
        notify(e.node,'ev-close-announce',{});
    }
}

// ================================================ 本地
interface Props {
    gid:number;
    aIncId:string;
    announce:any; // 公告详细
    noticeTitle:string; // 公告标题
}
