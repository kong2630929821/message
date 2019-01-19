/**
 * 群公告
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { MSG_TYPE } from '../../../../server/data/db/message.s';
import { sendGroupMessage } from '../../../../server/data/rpc/message.p';
import { GroupSend } from '../../../../server/data/rpc/message.s';
import { Logger } from '../../../../utils/logger';
import * as store from '../../data/store';
import { bottomNotice, timestampFormat } from '../../logic/logic';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class GroupAnnounce extends Widget {
    public ok:() => void;
    public props:Props = {
        gid:null,
        aIncIdArray:[],
        isOwner:false,
        createTime:''
    };
    public setProps(props:any) {
        super.setProps(props); 
        const gInfo = store.getStore(`groupInfoMap/${this.props.gid}`,new GroupInfo());
        this.props.aIncIdArray = gInfo.annoceids;
        const uid = store.getStore('uid');
        const ownerid = gInfo.ownerid;
        if (uid === ownerid) {
            this.props.isOwner = true;
        }
        this.props.createTime = timestampFormat(gInfo.create_time,2);
    }
    public goBack() {
        this.ok();
    }
    public firstPaint() {
        super.firstPaint();
        store.register(`announceHistoryMap`,() => {
            this.setProps(this.props);
            this.paint();
        });
    }

    // 编辑群公告
    public editGroupAnnounce() {
        popNew('chat-client-app-widget-pageEdit-pageEdit',{ title:'编辑群公告',needTitle:true },(r:any) => {
            const message = new GroupSend();
            message.gid = this.props.gid;
            message.msg = JSON.stringify(r);
            message.mtype = MSG_TYPE.NOTICE;
            message.time = (new Date()).getTime();
            clientRpcFunc(sendGroupMessage, message, () => {
                bottomNotice('发布群公告成功');
            });
        });
    }
    
    // 查看公告详情
    public goDetail(aIncId:string) {
        if (aIncId) {
            popNew('chat-client-app-view-group-announceDetail',{ aIncId:aIncId });
        } else {
            popNew('chat-client-app-view-group-announceDetail',{ title: '本群须知',content:'欢迎大家入群' });
        }
    }
}

// ================================================ 本地
interface Props {
    gid:number;
    aIncIdArray:string[]; // 公告消息记录
    isOwner:boolean; // 是否是群主
    createTime:string; // 群创建时间
}
