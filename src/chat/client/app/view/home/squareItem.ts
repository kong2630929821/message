import { uploadFileUrlPrefix } from '../../../../../app/publicLib/config';
import { popNew3, popNewMessage } from '../../../../../app/utils/tools';
import { popModalBoxs, popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { MSG_TYPE } from '../../../../server/data/db/message.s';
import { updateUserMessage } from '../../data/parse';
import { getStore } from '../../data/store';
import { buildupImgPath, complaintUser, judgeFollowed, timestampFormat } from '../../logic/logic';
import { delPost, follow, sendUserMsg } from '../../net/rpc';

interface Props {
    key:any;   // 帖子ID及社区编号
    username:string;
    avatar:string;
    owner:number;  // 用户UID
    commentCount:number;  // 评论数量
    likeCount:number;   // 点赞数量
    createtime:string;      // 创建时间
    content:string;     // 内容
    showAll:boolean;  // 详情页面
    showUtils:boolean;  // 显示操作
    likeActive:boolean;  // 点赞
    followed:boolean;  // 已关注
    imgs:string[];  // 图片列表
    offical:boolean;  // 官方
    isPublic:boolean; // 公众号文章
    gender:number;  // 性别 0 男 1 女
    isMine:boolean;  // 是否本人发的帖
    urlPath:string;  // 图片路径前
    timeFormat:any;  // 时间处理
}
/**
 * 广场帖子
 */
export class SquareItem extends Widget {
    public props:Props = {
        key:{
            id:0,
            num:''
        },
        username:'用户名',
        avatar:'',
        owner:0,
        commentCount:0,
        likeCount:15,
        createtime:'',
        content:'',
        showAll:false,
        showUtils:false,
        likeActive:false,
        followed:false,
        isPublic:false,
        imgs:[],
        offical:false,
        gender:1,   // 性别 0男 1女
        isMine:false,
        urlPath:uploadFileUrlPrefix,
        timeFormat:timestampFormat
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.props.avatar = buildupImgPath(props.avatar);
        const uid = getStore('uid',0);
        this.props.isMine = this.props.owner === uid;
        this.props.followed = judgeFollowed(this.props.key.num);
    }

    public attach() {
        super.attach();
        const content = getRealNode(this.tree).querySelector('div.content');
        if (content && content.clientHeight > 120) {
            (<any>content).style.display = '-webkit-box';
            content.querySelector('span').style.display = 'block';
        }
    }

    /**
     * 查看详情
     */
    public goDetail(e:any) {
        this.closeUtils(e);
        notify(e.node,'ev-goDetail',null);
    }

    /**
     * 展示操作
     */
    public showTools(e:any) {
        this.props.showUtils = !this.props.showUtils;
        this.paint();
        notify(e.node,'ev-tools-expand',{ value:this.props.showUtils });
    }

    /**
     * 点赞
     */
    public likeBtn(e:any) {
        this.closeUtils(e);
        notify(e.node,'ev-likeBtn',{ value:this.props.key });
    }

    /**
     * 评论
     */
    public doComment(e:any) {
        this.closeUtils(e);
        notify(e.node,'ev-commentBtn',{ value:this.props.key });
    }

    // 关闭操作列表
    public closeUtils(e:any) {
        this.props.showUtils = false;
        this.paint();
        notify(e.node,'ev-closeTools',null);
    }

    /**
     * 查看用户详情
     */
    public goUserDetail(e:any) {
        this.closeUtils(e);
        if (this.props.isPublic) {
            popNew3('chat-client-app-view-person-publicHome', { uid: this.props.owner, pubNum: this.props.key.num });
        } else {
            popNew3('chat-client-app-view-info-userDetail', { uid: this.props.owner, num:this.props.key.num });
        }
    }

    /**
     * 举报
     */
    public complaint(e:any) {
        this.closeUtils(e);
        complaintUser(this.props.username);
    }

    /**
     * 删除帖子
     */
    public delPost(e:any) {
        this.closeUtils(e);
        popModalBoxs('chat-client-app-widget-modalBox-modalBox', { title:'删除',content:'确定删除该动态或文章？' },() => {
            delPost(this.props.key.num,this.props.key.id).then(r => {
                notify(e.node,'ev-delBtn',{ value:this.props.key });
                this.paint();
            });
        });
        
    }

    /**
     * 关注用户
     */
    public followUser(e:any) {
        this.closeUtils(e);
        if (this.props.followed) {
            popModalBoxs('chat-client-app-widget-modalBox-modalBox', { title:'取消关注',content:'确定取消关注？' },() => {
                follow(this.props.key.num);
            });
        } else {
            follow(this.props.key.num);
        }
        
    }

    /**
     * 分享文章
     */
    public shareArt() {
        popNew('chat-client-app-view-person-friendList',null,(r) => {
            console.log('11111111111111111111',r);
            sendUserMsg(r,JSON.stringify(this.props),MSG_TYPE.Article).then((res:any) => {
                updateUserMessage(r, res);
                popNewMessage('分享成功');
            },() => {
                popNewMessage('分享失败');
            });
        });
    }
}
