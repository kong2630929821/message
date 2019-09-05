import { uploadFileUrlPrefix } from '../../../../../app/publicLib/config';
import { popNew3, popNewMessage } from '../../../../../app/utils/tools';
import { Widget } from '../../../../../pi/widget/widget';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import { removeFromBlackList } from '../../../../server/data/rpc/user.p';
import * as store from '../../data/store';
import { getFriendsInfo, rippleShow } from '../../logic/logic';
import { clientRpcFunc } from '../../net/init';

interface Props {
    name:string;// 标题
    blackList:any;// 黑名单
    urlPath:string;// 图片路径
    addType?:string;
    chatHistory?:any;// 聊天记录
    minTitle?:string;// 小标题
}

/**
 * 黑名单管理
 */
export class BlackList extends Widget {
    public props:Props = {
        name:'',
        blackList:[],
        urlPath:uploadFileUrlPrefix,
        addType:'',
        chatHistory:[],
        minTitle:''
    };

    public ok:() => void;

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        if (this.props.chatHistory.length) {
            this.props.blackList = this.props.chatHistory;

            return ;
        }
        if (!this.props.addType) {
            this.init();// 公众号
        } else {
            this.initData();// 黑名单
        }
        
    }

    // 初始化数据
    public initData() {
        const data =  store.getStore('contactMap',[]);
        const uid = store.getStore('uid');
        const blackList = data.size ? data.get(`${uid}`).blackList :[];
        const friends = getFriendsInfo().friends;
        friends.forEach(v => {
            if (blackList.indexOf(v.uid) !== -1) {
                const avatar = v.avatar ? this.props.urlPath + v.avatar :'../../res/images/user_avatar.png';
                const note = v.note ? v.note :'没有简介';
                this.props.blackList.push({ text:v.name,uid:v.uid,img:avatar,msg:note,sex:v.gender });
            }
        });
    }

    // 初始化公众号
    public init() {
        const post = store.getStore('communityInfoMap',[]);
        for (const [key ,value] of post) {
            const avatar = value.user_info.avatar ? this.props.urlPath + value.user_info.avatar :'../../res/images/user_avatar.png';
            this.props.blackList = [{ text:value.user_info.name,num:value.comm_info.num,img:avatar }];
        }
    }

    // 返回
    public goBack() {
        this.ok && this.ok();
    }

    // 移除黑名单
    public remove(index:number) {
        const uid = this.props.blackList[index].uid;
        clientRpcFunc(removeFromBlackList, uid, (r) => {
            if (r && r.r === 1) {
                popNewMessage('移出黑名单');
                this.props.blackList.splice(index,1);
                this.paint();
            }
        });
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
    
    // 跳转
    public goTo(index:number) {
        const data = this.props.blackList[index];
        if (this.props.chatHistory.length) {
            // popNew3('chat-client-app-view-chat-chat', { id: data.uid, chatType: GENERATOR_TYPE.USER });
        } else if (!this.props.addType) {
            // 公众号
            popNew3('chat-client-app-view-person-publicHome',{ uid:data.uid,pubNum:data.num });
        } else {
            // 黑名单
            popNew3('chat-client-app-view-info-userDetail',{ uid:data.uid });
        }
    }
}