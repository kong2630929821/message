/**
 * 群公告项
 */

// ================================================ 导入
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
import { AnnounceHistory } from '../../../../server/data/db/message.s';
import { Logger } from '../../../../utils/logger';
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
        time:''
    };
    public setProps(props:any) {
        super.setProps(props); 
        logger.debug(props.aIncId,'=============',this.props.aIncId);
        this.props.announce = store.getStore(`announceHistoryMap/${this.props.aIncId}`,new AnnounceHistory()).announce;
        logger.debug('====this.props.announce',this.props.announce);
        const time = this.props.announce ? this.props.announce.time : null;
        this.props.time = timestampFormat(time).substr(5,16);
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
}
