import { getStoreData, setStoreData } from '../../../../../app/middleLayer/wrap';
import { Widget } from '../../../../../pi/widget/widget';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { UserArray } from '../../../../server/data/rpc/basic.s';
import * as store from '../../data/store';
import { applyUserFriend, getChatUid, getUsersBasicInfo } from '../../net/rpc';
// tslint:disable-next-line:missing-jsdoc
interface Props {
    name:string;
    isAddUser:string;
}

/**
 * 消息列表
 */
export class Notice extends Widget {
    public ok: () => void;
    public props:Props = {
        name:'',
        isAddUser:'加好友'
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.state = STATE;
        this.init();   
    }

    public init() {
        const list = store.getStore('noticeList',[]);
        const noticeList = [];
        list.forEach(async (v) => {
            console.log(`1111111111111111111111111111是${v}`);
            let msg = '';
            let name = '';
            // const name = await getUserInfoName([v[0]]);
            getChatUid(v[0]).then((res:number) => {
                getUsersBasicInfo([res],[]).then((r: UserArray) => {
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
            
        });
        this.state = noticeList;   
        const lastReadNotice = list[list.length - 1];
        store.setStore('lastReadNotice',lastReadNotice);
    }
    public goBack() {
        this.ok && this.ok(); 
    }

    // 添加好友
    public addFriend(accId:string) {
        this.props.isAddUser = '已申请';
        applyUserFriend(accId).then(() => {
            getStoreData('inviteUsers').then(inviteUsers => {
                // 我邀请的好友

                const invite = inviteUsers.invite_success;
                let index = null;
                invite.forEach((v,i) => {
                    if (v[0] === accId) {
                        index = i;
                    }
                });
                invite.splice(index,1);
                setStoreData('inviteUsers/invite_success',invite);

                // 邀请我的好友
                setStoreData('inviteUsers/convert_invite',[]);
            });
            
        });
        this.paint();
    }

    // 去帖子详情
    public gotoPostDetail(index:number) {
        const data  = this.state[index];
    }
}

const STATE = [];