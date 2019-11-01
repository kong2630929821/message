import { popNew3 } from '../../../../../app/utils/tools';
import { popModalBoxs } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { REPORT_ARTICLE, REPORT_POST } from '../../../../server/data/constant';
import { MSG_TYPE } from '../../../../server/data/db/message.s';
import { updateUserMessage } from '../../data/parse';
import { getStore } from '../../data/store';
import { buildupImgPath, complaintUser, judgeFollowed, timestampFormat } from '../../logic/logic';
import { popNewMessage } from '../../logic/tools';
import { delPost, follow, sendUserMsg } from '../../net/rpc';

const imgSize = 180;// 多个图片的显示大小
const imgInterval = 17;// 图片的间隔
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
    timeFormat:any;  // 时间处理
    fgStatus:boolean;// 关注动画
    buildupImgPath:any;  // 组装图片路径
    publicName:string;// 公众号名字
    imgWidth:number;// 一张图片的宽
    imgHeight:number;// 一张图片的高
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
        timeFormat:timestampFormat,
        fgStatus:false,
        buildupImgPath:buildupImgPath,
        publicName:'',
        imgWidth:0,
        imgHeight:0
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
        this.calcImg();
    }

    public attach() {
        super.attach();
        const content = getRealNode(this.tree).querySelector('div.content');
        if (content && content.clientHeight > 110) {
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
        // 当评论数量大于0则跳转详情
        if (this.props.commentCount > 0) {
            this.goDetail(e);
        } else {
            notify(e.node,'ev-commentBtn',{ value:this.props.key });
        }
       
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
        const avatar = this.props.avatar ? buildupImgPath(this.props.avatar) :'../../res/images/user_avatar.png';
        const key = `${this.props.isPublic ? REPORT_ARTICLE :REPORT_POST}%${JSON.stringify(this.props.key)}`;
        complaintUser(`${this.props.username} 的内容`,this.props.gender,avatar,this.props.content,this.props.isPublic ? REPORT_ARTICLE :REPORT_POST,key);
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
            this.props.fgStatus = true;
            this.paint();
            setTimeout(() => {
                this.props.fgStatus = false;
                popNewMessage('关注成功');
                follow(this.props.key.num);
            },400);
            
        }
        
    }

    /**
     * 分享文章
     */
    public shareArt() {
        popNew3('chat-client-app-view-person-friendList',null,(r) => {
            console.log('11111111111111111111',r);
            sendUserMsg(r,JSON.stringify(this.props),MSG_TYPE.Article).then((res:any) => {
                updateUserMessage(r, res);
                popNewMessage('分享成功');
            },() => {
                popNewMessage('分享失败');
            });
        });
    }

    /**
     * 查看大图
     */
    public showBigImg(ind:number) {
        // const val:any = this.props.imgs[ind];
        // popNew3('chat-client-app-widget1-bigImage-bigImage',{
        //     img: buildupImgPath(val.compressImg),
        //     originalImg: buildupImgPath(val.originalImg)
        // });
        const val = [];
        const icon = [];
        this.props.imgs.forEach((v:any) => {
            icon.push(buildupImgPath(v.compressImg));
            val.push(buildupImgPath(v.originalImg));
        });
        popNew3('chat-client-app-view-imgSwiper-imgSwiper',{
            list:val,
            thumbnail:icon,
            activeIndex:ind + 1
        });
    }

    /**
     * 计算一张图片宽高
     */
    public calcImg() {
        if (this.props.imgs.length !== 1) {
            return;
        }
        const src = buildupImgPath(this.props.imgs[0].compressImg);
        const img = new Image();
        img.src = src;
        img.onload = () => {
            const width = img.width;
            const height = img.height;
            const ratio = width / height;
            // 图片显示规则
            if (ratio < 0.5) {
                // 1.如果图片 宽 / 高 < 0.5（如微博长图） 宽度最小占二格1/3（包括间距），高最多占二栏，

                this.props.imgWidth = (imgSize * 2 + imgInterval * 2) / 3;
                this.props.imgHeight = imgSize * 2 + imgInterval * 2;

            } else if (ratio >= 0.5 && ratio <= 2) {
                // 2.如果图片 0.5 <= 宽 / 高 <= 2 图片限定4个格子的大小内（包括间距）

                this.props.imgWidth = imgSize * 2 + imgInterval * 2;
                this.props.imgHeight = imgSize * 2 + imgInterval * 2;
            } else {
                // 3.如果图片 宽 / 高 > 2（如全景图） 宽最多占三格 高最多占一格（包括间距），最小占二格1/3（包括间距）

                this.props.imgWidth = imgSize * 3 + imgInterval * 2;
                this.props.imgHeight = imgSize + imgInterval; 
            }
            this.paint();
        };
        
    }
}
