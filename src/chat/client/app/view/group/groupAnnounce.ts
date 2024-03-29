
// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { MSG_TYPE } from '../../../../server/data/db/message.s';
import { sendGroupMessage } from '../../../../server/data/rpc/message.p';
import { GroupSend } from '../../../../server/data/rpc/message.s';
import { depCopy } from '../../../../utils/util';
import * as store from '../../data/store';
import { timestampFormat } from '../../logic/logic';
import { popNewMessage } from '../../logic/tools';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出

/**
 * 群公告
 */
export class GroupAnnounce extends Widget {
    public ok:() => void;
    public props:Props = {
        gid:0,
        aIncIdArray:[],
        isOwner:false,
        createTime:''
    };
    public setProps(props:any) {
        super.setProps(props); 
        const gInfo = store.getStore(`groupInfoMap/${this.props.gid}`,new GroupInfo());
        this.props.aIncIdArray = depCopy(gInfo.annoceids);
        const uid = store.getStore('uid');
        if (uid === gInfo.ownerid) {
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
        popNew('chat-client-app-widget-pageEdit-pageEdit',{ title:'新公告',needTitle:false,maxLength:150 },(r:any) => {
            const message = new GroupSend();
            message.gid = this.props.gid;
            message.msg = JSON.stringify(r);
            message.mtype = MSG_TYPE.NOTICE;
            message.time = (new Date()).getTime();
            clientRpcFunc(sendGroupMessage, message, () => {
                popNewMessage('发布群公告成功');
            });
        });
    }
    
    // 查看公告详情
    public goDetail(aIncId:string) {
        if (aIncId) {
            popNew('chat-client-app-view-group-announceDetail',{ aIncId:aIncId,isOwner:this.props.isOwner });
        } else {
            // popNew('chat-client-app-view-group-announceDetail',{ title: '本群须知',content:'欢迎大家入群' });
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
