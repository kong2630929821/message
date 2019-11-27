/**
 * 群公告项
 */

// ================================================ 导入
import { Widget } from '../../../../../pi/widget/widget';
import { Logger } from '../../../../utils/logger';
import { depCopy } from '../../../../utils/util';
import * as store from '../../data/store';
import { timestampFormat } from '../../logic/logic';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class AnnounceItem extends Widget {
    public props:Props = {
        aIncId : '',
        announce: null,
        time:'',
        noticeTitle:''
    };
    public setProps(props:any) {
        super.setProps(props); 
        logger.debug(props.aIncId,'=============',this.props.aIncId);
        const announce = store.getStore(`announceHistoryMap/${this.props.aIncId}`,null);
        this.props.announce = announce;
        if (announce) {
            const notice = depCopy(announce.msg);
            this.props.noticeTitle = JSON.parse(notice).content;
            this.props.time = timestampFormat(announce.time,3);
        }
        logger.debug('====this.props.announce',announce);
    }

    public firstPaint() {
        super.firstPaint();
        store.register(`announceHistoryMap/${this.props.aIncId}`,() => {
            this.setProps(this.props);
            this.paint();
        });
    }
    
}

// ================================================ 本地
interface Props {
    aIncId:string;
    announce:any; // 公告详细
    time:string;
    noticeTitle:string;// 公告标题
}
