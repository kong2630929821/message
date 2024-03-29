import { getStoreData, setStoreData } from '../../../../../app/api/walletApi';
import { uploadFileUrlPrefix } from '../../../../../app/public/config';
import { popNew3 } from '../../../../../app/utils/tools';
import { popNew } from '../../../../../pi/ui/root';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import * as store from '../../data/store';
import { delNotice, rippleShow } from '../../logic/logic';
import { applyUserFriend, getUsersBasicInfo } from '../../net/rpc';
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
        const userInfos = store.getStore('userInfoMap',[]);
        const accIdToUid = store.getStore('accIdToUid',[]);
        list.forEach(async (v) => {
            let fg = 0;
            let msg = '';
            let name = '';
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
            if (v[4]) {
                if (v[5].imgs.length) {
                    img = this.props.urlPath + v[5].imgs[0];
                } else {
                    img = v[5].avatar ? v[5].avatar :'../../res/images/user_avatar.png';
                }
                name = v[5].username;
            } else {
                // name = userInfos.get(v[0]).name;
                let uid = accIdToUid.get(v[0]);
                if (uid) {
                    const info = userInfos.get(`${uid}`);
                    if (info) {
                        // 如果存在用户信息
                        name = info.name;
                    } else {
                        // 不存在用户信息
                        const res:any = await getUsersBasicInfo([],[v[0]]);
                        userInfos.set(`${uid}`,res.arr[0]);
                        store.setStore('userInfoMap',userInfos);
                        name = res.arr[0].name;
                    }
                } else {
                    const res:any = await getUsersBasicInfo([],[v[0]]);
                    uid = res.arr[0].uid;
                    userInfos.set(`${uid}`,res.arr[0]);
                    accIdToUid.set(v[0],uid);
                    store.setStore('userInfoMap',userInfos);
                    name = res.arr[0].name;
                }
            }
            
            noticeList.push([fg,msg,name,v[0],v[3],v[4],img,v[5]]);

        });
        this.state = noticeList;   
        const lastReadNotice = list[list.length - 1];
        store.setStore('lastReadNotice',lastReadNotice);
        this.latestMsg();
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
        this.close();
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

    // 设置
    public groupDetail() {
        popNew('chat-client-app-view-info-setting',{ noticeSet:1 },() => {
            this.state = [];
            this.paint();
        });
    }

    /**
     * 定位最新消息
     */
    public latestMsg() {
        setTimeout(() => {
            const $scrollElem = this.getScrollElem();
            // console.log($scrollElem.scrollHeight);
            $scrollElem.scrollTop = $scrollElem.scrollHeight;
            this.paint();
        }, 100);
        
    }

    /**
     * 获取滚动区元素
     */
    public getScrollElem() {
        return getRealNode((<any>this.tree).children[1]);
    }
    
}

const STATE = [];