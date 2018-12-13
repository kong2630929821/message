/**
 * 单聊
 */

// ================================================ 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { DEFAULT_ERROR_STR } from '../../../../server/data/constant';
import { MSG_TYPE, UserHistory } from '../../../../server/data/db/message.s';
import { sendUserMessage } from '../../../../server/data/rpc/message.p';
import { UserSend } from '../../../../server/data/rpc/message.s';
import { Logger } from '../../../../utils/logger';
import { genUuid } from '../../../../utils/util';
import { updateUserMessage } from '../../data/parse';
import * as store from '../../data/store';
import { getFriendAlias } from '../../logic/logic';
import { clientRpcFunc } from '../../net/init';
import { sendMessage } from '../../net/rpc';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);
export const forelet = new Forelet();

export class Chat extends Widget {
    public props:Props;
    public bindCB: any;
    public ok: () => void;
    constructor() {
        super();
        this.props = {
            sid: null,
            rid: null,
            name:'',
            inputMessage:'',
            hidIncArray: []
        }; 
        this.bindCB = this.updateChat.bind(this);
    }
    public setProps(props:any) {
        super.setProps(props);
        this.props.sid = store.getStore('uid');
        this.props.name = getFriendAlias(this.props.rid);
        const hIncIdArr = store.getStore(`userChatMap/${this.getHid()}`, []);
        this.props.hidIncArray = hIncIdArr;

        // 更新上次阅读到哪一条记录
        const hincId = hIncIdArr.length > 0 ? hIncIdArr[hIncIdArr.length - 1] : undefined;
        const lastRead = store.getStore(`lastRead/${this.props.rid}`,{ msgId:undefined,msgType:'user' });
        lastRead.msgId = hincId;
        store.setStore(`lastRead/${this.props.rid}`,lastRead);
    }

    public firstPaint() {
        super.firstPaint();
        store.register(`userHistoryMap`,this.bindCB);
        // store.register(`userChatMap/${this.getHid()}`,this.bindCB);
        // 第一次进入定位到最新的一条消息
        setTimeout(() => {
            document.querySelector('#messEnd').scrollIntoView();
            this.paint();
        }, 200);
    }

    /**
     * 更新聊天记录
     */
    public updateChat() {
        this.setProps(this.props);
        this.paint();
        // 有新消息来时定位到最新消息
        setTimeout(() => {
            document.querySelector('#messEnd').scrollIntoView();
            this.paint();
        }, 100);
    }

    /**
     * 查看用户详情
     */
    public goUserDetail(e:any) {
        popNew('client-app-demo_view-info-userDetail',{ uid: e.rid, inFlag: 1 });
    }

    public send(e:any) {
        logger.debug('=========send chat',e);
        this.props.inputMessage = e.value;
        sendMessage(this.props.rid, e.value, (() => {
            const nextside = this.props.rid;

            return (r: UserHistory) => {
                if (r.hIncId === DEFAULT_ERROR_STR) {
                    alert('对方不是你的好友！');
                    
                    return;
                }
                updateUserMessage(nextside, r);
            };
        })(), e.msgType);
    }
    public destroy() {
        store.unregister(`userChatMap/${this.getHid()}`,this.bindCB);

        return super.destroy();
    }
    public goBack() {
        this.ok();
    }

    private getHid() {
        const friendLink = store.getStore(`friendLinkMap/${genUuid(this.props.sid, this.props.rid)}`);
        
        return friendLink && friendLink.hid;
    }
}

// ================================================ 本地
interface Props {
    sid: number;
    rid: number;
    name:string;
    inputMessage:string;
    hidIncArray: string[];
}