import { getStoreData, setStoreData } from '../../../../../app/middleLayer/wrap';
import { uploadFileUrlPrefix } from '../../../../../app/publicLib/config';
import { popNew3 } from '../../../../../app/utils/tools';
import { Widget } from '../../../../../pi/widget/widget';
import { UserArray } from '../../../../server/data/rpc/basic.s';
import * as store from '../../data/store';
import { delNotice, rippleShow } from '../../logic/logic';
import { applyUserFriend, getChatUid, getPostDetile, getUsersBasicInfo } from '../../net/rpc';
// tslint:disable-next-line:missing-jsdoc
interface Props {
    name:string;
    isAddUser:string;
    recallBtn:boolean;
    urlPath:string;  // 图片路径前
    imgs:any;// 图片
    avatar:string;// 头像
    postInfo:any;
    currentIndex:number;
    noticeAllList:any;
}

/**
 * 消息列表
 */
export class Notice extends Widget {
    public ok: () => void;
    public props:Props = {
        name:'',
        isAddUser:'加好友',
        recallBtn:false,
        urlPath:uploadFileUrlPrefix,
        imgs:[],
        avatar:'',
        postInfo:[],
        currentIndex:-1,
        noticeAllList:[]
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
        this.props.noticeAllList = list;
        const noticeList = [];
        list.forEach(async (v) => {
            console.log(`1111111111111111111111111111是${v}`);
            let msg = '';
            let name = '';
            // const name = await getUserInfoName([v[0]]);
            getChatUid(v[0]).then((res:number) => {
                getUsersBasicInfo([res],[]).then((res: UserArray) => {
                    if (v[4]) {
                        getPostDetile(v[4],v[3]).then((r:any) => {
                            name = res.arr[0].name;
                            let fg = 0;
                            if (v[2] === store.GENERATORTYPE.NOTICE_1) {
                                msg = '你邀请的好友上线了';
                                fg = 0;
                            } else if (v[2] === store.GENERATORTYPE.NOTICE_2) {
                                msg = '邀请你的好友上线了';
                                fg = 0;
                            } else if (v[2] === store.GENERATORTYPE.NOTICE_3) {
                                msg = '有人赞了你的动态';
                                fg = 1;
                            } else if (v[2] === store.GENERATORTYPE.NOTICE_4) {
                                msg = '有人@了你';
                                fg = 1;
                            }
                            let img = '';
                            if (r[0].imgs.length) {
                                img = this.props.urlPath + r[0].imgs[0];
                            } else {
                                img = r[0].avatar ? r[0].avatar :'../../res/images/user_avatar.png';
                            }
                            // 类型 消息 名字 Uid pid num 图片 帖子详细信息
                            noticeList.push([fg,msg,name,v[0],v[3],v[4],img,r[0]]);
                            this.paint();
                            
                        });
                    } else {
                        name = res.arr[0].name;
                        let fg = 0;
                        if (v[2] === store.GENERATORTYPE.NOTICE_1) {
                            msg = '你邀请的好友上线了';
                            fg = 0;
                        } else if (v[2] === store.GENERATORTYPE.NOTICE_2) {
                            msg = '邀请你的好友上线了';
                            fg = 0;
                        } else if (v[2] === store.GENERATORTYPE.NOTICE_3) {
                            msg = '有人赞了你的动态';
                            fg = 1;
                        } else if (v[2] === store.GENERATORTYPE.NOTICE_4) {
                            msg = '有人@了你';
                            fg = 1;
                        }
                            // 类型 消息 名字 Uid pid num 图片 帖子详细信息
                        noticeList.push([fg,msg,name,v[0],v[3],v[4]]);
                        this.paint();
                    }
                    
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
        const data  = this.state[index][7];
        popNew3('chat-client-app-view-info-postDetail',{ ...data,showAll:true }) ;
    }

    // 长按打开消息撤回
    public openMessageRecall(index:number) {
        this.props.currentIndex = index;
        this.paint();
    }

    // 删除
    public recall(index:number) {
        const list = this.props.noticeAllList;
        const data  = list[index];
        if (data[2] === store.GENERATORTYPE.NOTICE_3) {
            delNotice('fabulousList',data);
        } 
        if (data[2] === store.GENERATORTYPE.NOTICE_4) {
            delNotice('conmentList',data);
        }
        this.state.splice(index,1);
        this.props.currentIndex = -1;
        this.paint(); 
    }

    // 页面点击
    public close() {
        this.props.currentIndex = -1;
        this.paint(); 
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}

const STATE = [];