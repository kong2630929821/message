import { popNewMessage } from '../../../../../app/utils/tools';
import { popModalBoxs, popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { MSG_TYPE } from '../../../../server/data/db/message.s';
import { updateUserMessage } from '../../data/parse';
import { getStore } from '../../data/store';
import { buildupImgPath, judgeFollowed } from '../../logic/logic';
import { follow, getFansList, getUserInfoByNum, getUserPostList, sendUserMsg } from '../../net/rpc';

interface Props {
    isMine:boolean;  // 是否自己的公众号
    showTool:boolean;  // 显示操作栏
    followed:boolean; // 是否关注
    pubNum:string;  // 公众号ID
    uid:number; // uid
    postList:any[];  // 发布的帖子列表
    totalFans:number;  // 粉丝总数
    totalPost:number;  // 总文章数
    name:string;   // 公众号名
    avatar:string;
}

/**
 * 公众号主页
 */
export class PublicHome extends Widget {
    public ok:() => void;
    public props:Props = {
        isMine:true,
        showTool:false,
        followed:false,
        pubNum:'',
        uid:0,
        postList:[],
        totalFans:0,
        totalPost:0,
        name:'',
        avatar:'',
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const sid = getStore('uid', 0);
        this.props.followed = judgeFollowed(this.props.pubNum);
        this.props.isMine = this.props.uid === sid;

        getUserInfoByNum([this.props.pubNum]).then(r => {
            this.props.name = r[0].user_info.name;
            this.props.avatar = buildupImgPath(r[0].user_info.avatar);
        });
        getUserPostList(this.props.pubNum).then((r:any) => {
            this.props.postList = r.list.map(r => { // 动态
                return {
                    ...r,
                    img: JSON.parse(r.body).imgs[0] ? buildupImgPath(JSON.parse(r.body).imgs[0]) :(r.avatar ? buildupImgPath(r.avatar) :'../../res/images/user_avatar.png')
                };
            });  
            this.props.totalPost = r.total;
            this.paint();
        });
        getFansList(this.props.pubNum).then((r:string[]) => {
            this.props.totalFans = r.length;  // 粉丝
            this.paint();
        });
    }

    public goBack() {
        this.ok && this.ok();
    }

    public showUtils() {
        this.props.showTool = !this.props.showTool;
        this.paint();
    }

    // 关注 取消关注
    public followBtn() {
        this.closeUtils();
        if (this.props.followed) {
            popModalBoxs('chat-client-app-widget-modalBox-modalBox', { title:'取消关注',content:'确定取消关注？' },() => {
                follow(this.props.pubNum).then(r => {
                    this.props.followed = !this.props.followed;
                    this.paint();
                });
            });
        } else {
            follow(this.props.pubNum).then(r => {
                this.props.followed = !this.props.followed;
                this.paint();
            });
        }
        
    }

    // 关闭操作列表
    public closeUtils() {
        this.props.showTool = false;
        this.paint();
    }

    // 发公众号文章
    public sendArticle() {
        this.closeUtils();
        popNew('chat-client-app-view-info-editPost',{ isPublic:true,num: this.props.pubNum },() => {
            getUserPostList(this.props.pubNum).then((r:any) => {
                this.props.postList = r.list.map(r => { // 动态
                    return {
                        ...r,
                        img: JSON.parse(r.body).imgs[0]
                    };
                });  
                this.props.totalPost = r.total;
                this.paint();
            });
        });
    }

    /**
     * 查看详情
     */
    public goDetail(i:number) {
        this.closeUtils();
        popNew('chat-client-app-view-info-postDetail',{ ...this.props.postList[i],showAll:true });
    }

    /**
     * 推荐给好友
     */
    public recomment() {
        popNew('chat-client-app-view-person-friendList',null,(r) => {
            console.log('11111111111111111111',r);
            const val = {
                name:this.props.name,
                type:'公众号',
                avatar:this.props.avatar,
                uid:this.props.uid,
                num:this.props.pubNum
            };
            sendUserMsg(r,JSON.stringify(val),MSG_TYPE.NameCard).then((res:any) => {
                updateUserMessage(r, res);
                popNewMessage('推荐成功');
            },() => {
                popNewMessage('推荐失败');
            });
        });
    }
}