/**
 * 添加好友
 */

// ================================================ 导入
import { popNewMessage } from '../../../../../app/utils/tools';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { Contact, GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import * as store from '../../data/store';
import { rippleShow } from '../../logic/logic';
import { doScanQrCode } from '../../logic/native';
import { applyUserFriend } from '../../net/rpc';

// ================================================ 导出
export const forelet = new Forelet();

export class AddUser extends Widget {
    public props: Props;
    public state: Contact;
    public ok: () => void;
    constructor() {
        super();
        this.props = {
            sid: null,
            rid: null,
            btns:[
                ['search.png','搜群'],
                ['search.png','通讯录好友'],
                ['search.png','qq/微信好友'],
                ['search.png','扫一扫']
            ]
        };
    }

    public create() {
        super.create();
        const sid = store.getStore('uid').toString();
        this.state = store.getStore('contactMap',new Contact()).get(sid);
    }
    
    public back() {
        this.ok();
    }

    public inputUid(e: any) {
        this.props.rid = e.value;
        this.paint();
    }

    /**
     * 添加好友
     */
    public applyFriend() {
        if (!this.props.rid) {
            popNewMessage('请输入好友ID');

            return;
        }
        
        applyUserFriend(this.props.rid).then((r) => {
            if (r === 0) {
                popNewMessage(`你们已经是好友了`);
            } else {
                popNewMessage('发送成功');
            }

        },(r) => {
            if (r.r === -1) {
                popNewMessage('不能添加自己为好友');
            } else {
                popNewMessage(`用户不存在`);

            }
            
        });
    }

    public chat(uid: number) {
        popNew('chat-client-app-view-chat-chat', { id: uid, chatType: GENERATOR_TYPE.USER });
    }

    public goNext(e:any,i: number) {
        switch (i) {
            case 0:
                doScanQrCode((res) => {  // 扫描二维码
                    this.props.rid = res;
                    console.log(res);
                    this.paint();
                });
                break;
            case 1:
                popNew('app-view-mine-other-addFriend'); // 展示我的二维码
                break;
            default:
        }
    }
    
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    // 点击搜索
    public goSearch() {
        popNew('chat-client-app-view-chat-search');
    }

}

// ================================================ 本地
interface Props {
    sid: number;
    rid: string;
    btns:string[][];
}

store.register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (const value of r.values()) {
        forelet.paint(value);
    }
});