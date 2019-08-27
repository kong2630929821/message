import { Widget } from '../../../../../pi/widget/widget';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { UserArray } from '../../../../server/data/rpc/basic.s';
import * as store from '../../data/store';
import { getUsersBasicInfo } from '../../net/rpc';
import { getUserInfoName } from '../../logic/logic';
// tslint:disable-next-line:missing-jsdoc
interface Props {
    name:string;
}

// tslint:disable-next-line:completed-docs
export class Notice extends Widget {
    public ok: () => void;
    public props:Props = {
        name:''
    };

    public create() {
        super.create();
        this.state = STATE;
        this.init();   
    }

    public init() {
        const list = store.getStore('noticeList',[]);
        const noticeList = [];
        list.forEach(async (v) => {
            let msg = '';
            let name = '';
            // const name = await getUserInfoName([v[0]]);
            getUsersBasicInfo([],[v[0]]).then((r: UserArray) => {
                name = r.arr[0].name;
                let fg = 0;
                if (v[2] === GENERATOR_TYPE.NOTICE_1) {
                    msg = '你邀请的好友上线了';
                    fg = 0;
                } else if (v[2] === GENERATOR_TYPE.NOTICE_2) {
                    msg = '邀请你的好友上线了';
                    fg = 0;
                } else if (v[2] === GENERATOR_TYPE.NOTICE_3) {
                    msg = '有人赞了你的动态';
                    fg = 1;
                } else if (v[2] === GENERATOR_TYPE.NOTICE_4) {
                    msg = '有人@了你';
                    fg = 1;
                }
                noticeList.push([fg,msg,name,v[0]]);
                this.paint();
            });
            
        });
        this.state = noticeList;   
        const lastReadNotice = list[list.length - 1];
        store.setStore('lastReadNotice',lastReadNotice);
    }
    public goBack() {
        this.ok && this.ok(); 
    }
}

const STATE = [];