/**
 * 群组聊天
 */

// ================================================ 导入
import { Widget } from '../../../../../pi/widget/widget';
import { DEFAULT_ERROR_STR } from '../../../../server/data/constant';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { AnnounceHistory, GroupHistory, MSG_TYPE } from '../../../../server/data/db/message.s';
import { sendGroupMessage } from '../../../../server/data/rpc/message.p';
import { GroupSend } from '../../../../server/data/rpc/message.s';
import { Logger } from '../../../../utils/logger';
import { updateGroupMessage } from '../../data/parse';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class GroupChat extends Widget {
    public ok:() => void;
    public props:Props;
    public bindCB: any;
    constructor() {
        super();
        this.props = {
            gid:null,
            groupName:'',
            inputMessage:'',
            hidIncArray: [],
            aIncIdArray:[],
            isLogin:true
        };
        this.bindCB = this.updateChat.bind(this);
    }
    public goBack() {
        this.ok();
    }
    public setProps(props:any) {
        super.setProps(props);
        this.props.hidIncArray = store.getStore(`groupChatMap/${this.getHid()}`,[]);
        this.props.groupName = store.getStore(`groupInfoMap/${this.props.gid}`,new GroupInfo()).name;
        this.props.aIncIdArray = store.getStore(`groupInfoMap/${this.props.gid}`,new GroupInfo()).annoceids;
        // this.props.aIncIdArray = [];
        this.props.isLogin = true;
        logger.debug('============groupChat',this.props);
    }
    public firstPaint() {
        super.firstPaint();
        store.register(`groupChatMap/${this.getHid()}`,this.bindCB);
        // store.register(`groupHistoryMap`,this.bindCB);
        store.register(`groupInfoMap/${this.props.gid}`,this.bindCB);
    }

    public attach() {
        super.attach();
        // 第一次进入定位到最新的一条消息
        document.querySelector('#messEnd').scrollIntoView();
    }

    public updateChat() {
        this.setProps(this.props);
        this.paint();
        // 有新消息来时定位到最新消息
        setTimeout(() => {
            document.querySelector('#messEnd').scrollIntoView();
            this.paint();
        }, 100);
    }
    public send(e:any) {
        logger.debug('====群组聊天信息发送',e);
        this.props.inputMessage = e.value;
        const message = new GroupSend();
        message.gid = this.props.gid;
        message.msg = this.props.inputMessage;
        message.mtype = e.msgType || MSG_TYPE.TXT;
        message.time = (new Date()).getTime();
        clientRpcFunc(sendGroupMessage, message, (() => {
            const gid = this.props.gid;

            return (r: GroupHistory) => {
                if (r.hIncId === DEFAULT_ERROR_STR) {
                    logger.debug('发送失败！');
                    
                    return;
                }
                // 如果是撤回公告
                if (r.msg.mtype === MSG_TYPE.RENOTICE) {
                    logger.debug('撤回公告');
                    const ah = new AnnounceHistory();
                    // 公告key使用群聊消息key
                    ah.aIncId = r.hIncId;
                    ah.announce = r.msg;
                    store.setStore(`announceHistoryMap/${ah.aIncId}`,ah);
                }
                // updateGroupMessage(gid, r);
            };
        })());
    }
    public destroy() {
        store.unregister(`groupChatMap/${this.getHid()}`,this.bindCB);

        return super.destroy();
    }
    private getHid() {

        return store.getStore(`groupInfoMap/${this.props.gid}`).hid;
    }
}

// ================================================ 本地
interface Props {
    gid:number;
    groupName: string; // 群名
    inputMessage:string; // 输入的群消息
    hidIncArray: string[]; // 群消息记录
    aIncIdArray: string[]; // 群公告记录
    isLogin:boolean;
}
