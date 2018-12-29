/**
 * 添加好友
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { Contact, GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { Result } from '../../../../server/data/rpc/basic.s';
import * as store from '../../data/store';
import { doScanQrCode } from '../../logic/native';
import { applyFriend as applyUserFriend } from '../../net/rpc';

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
            rid: null
        };
    }

    public back() {
        this.ok();
    }

    public inputUid(e: any) {
        this.props.rid = e.value;
    }

    /**
     * 添加好友
     */
    public applyFriend() {
        const sid = store.getStore('uid');
        if (!this.props.rid) {
            alert('请输入好友ID');

            return;
        }
        // if (this.props.rid === sid) {
        //     alert('不能添加自己为好友');

        //     return;
        // }
        applyUserFriend(this.props.rid, (r: Result) => {
            if (r.r === 0) {
                alert(`${this.props.rid}已经是你的好友`);

                return;
            }
        });
    }
    public chat(uid: number) {
        popNew('chat-client-app-demo_view-chat-chat', { id: uid, chatType: GENERATOR_TYPE.USER });
    }

    public goNext(i: number) {
        setTimeout(() => {
            switch (i) {
                case 0:
                    doScanQrCode((res) => {  // 扫描二维码
                        console.log(res);
                        // TODO
                    });
                    break;
                case 1:
                    popNew('app-view-mine-other-addFriend'); // 展示我的二维码
                    break;
                case 2:
                    this.applyFriend();  // 添加好友
                    break;
                default:
            }
        }, 500);
    }

}

// ================================================ 本地
interface Props {
    sid: number;
    rid: string;
}

store.register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (const value of r.values()) {
        forelet.paint(value);
    }
});