import { popNew3 } from '../../../../../app/utils/tools';
import { gotoSquare } from '../../../../../app/view/base/app';
import { popModalBoxs } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { REPORT_ARTICLE, REPORT_POST } from '../../../../server/data/constant';
import { MSG_TYPE } from '../../../../server/data/db/message.s';
import { updateUserMessage } from '../../data/parse';
import { getStore, PostItem, setStore } from '../../data/store';
import { buildupImgPath, complaintUser, judgeFollowed, judgeLiked, timestampFormat } from '../../logic/logic';
import { popNewMessage } from '../../logic/tools';
import { delPost, follow, postLaud, sendUserMsg } from '../../net/rpc';

const imgSize = 180;// 多个图片的显示大小
const imgInterval = 17;// 图片的间隔
interface Props {
    postItem:PostItem;
    showAll:boolean;  // 详情页面
    showUtils:boolean;  // 显示操作
    likeActive:boolean;  // 点赞
    isMine:boolean;  // 是否本人发的帖
    timeFormat:any;  // 时间处理
    fgStatus:boolean;// 关注动画
    buildupImgPath:any;  // 组装图片路径
    publicName:string;// 公众号名字
    imgWidth:number;// 一张图片的宽
    imgHeight:number;// 一张图片的高
    gameLabel:any;// 游戏标签
    isUserDetailPage:boolean;// 用户详情页面的postItem
}
/**
 * 广场帖子
 */
export class SquareItem extends Widget {
    public props:Props = {
        postItem:{
            key:{
                id:0,
                num:''
            },  // 帖子ID及社区编号
            username:'用户名', // 用户名
            avatar:'', // 头像
            commentCount:0 , // 评论数量
            likeCount:0,   // 点赞数量
            createtime:0,     // 创建时间
            content:'',     // 内容
            imgs:[],  // 图片列表
            post_type:0, // 文章类型
            gender:2, // 性别 0 男 1 女
            comm_type:0, // 社区类型
            owner:0,
            label:'', // 对应的是哪一款游戏，可以为空，
            isPublic:false,// 公众号文章
            followed:false,
            offcial:false,// 官方
            body:'',
            state: 0,
            title: '',
            collectCount:0,
            forwardCount:0
        },
        showAll:false,
        showUtils:false,
        likeActive:false,
        isMine:false,
        timeFormat:timestampFormat,
        fgStatus:false,
        buildupImgPath:buildupImgPath,
        publicName:'',
        imgWidth:0,
        imgHeight:0,
        gameLabel:{
            name:'',
            icon:''
        },
        isUserDetailPage:false
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.props.postItem.avatar = buildupImgPath(props.postItem.avatar);
        const uid = getStore('uid',0);
        this.props.isMine = this.props.postItem.owner === uid;
        this.props.postItem.followed = judgeFollowed(this.props.postItem.key.num);
        this.props.likeActive = judgeLiked(this.props.postItem.key.num,this.props.postItem.key.id);
        const gameList = getStore('gameList');
        if (props.postItem.label && gameList.length) {
            const currentItem = gameList.find(item => item.title === this.props.postItem.label);
            this.props.gameLabel = {
                name:currentItem.title,
                icon:buildupImgPath(currentItem.img[0])
            };
        } else {
            this.props.gameLabel = {
                name:'',
                icon:''
            }; 
        }
        // 动态详情中隐藏工具栏  postDetail页面
        if (typeof props.expandItemTop === 'boolean') {
            this.props.showUtils = false;
        }
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
        postLaud(this.props.postItem.key.num, this.props.postItem.key.id).then(() => {
            if (this.props.likeActive) {
                this.props.postItem.likeCount -= 1;
                this.props.likeActive = false;
            } else {
                this.props.postItem.likeCount += 1;
                this.props.likeActive = true;
            }
            const list =  getStore('postReturn');
            const postList = list.postList ? list.postList :list;
            const current = postList.find(item => JSON.stringify(item.key) === JSON.stringify(this.props.postItem.key));
            if (current) {
                current.likeCount = this.props.postItem.likeCount;
            }
            setStore('postReturn',list);
            this.paint();
        });
    }

    /**
     * 评论
     */
    public doComment(e:any) {
        this.closeUtils(e);
        // 当评论数量大于0则跳转详情
        if (this.props.postItem.commentCount > 0) {
            this.goDetail(e);
        } else {
            notify(e.node,'ev-commentBtn',{ value:this.props.postItem.key });
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
        if (this.props.postItem.isPublic) {
            popNew3('chat-client-app-view-person-publicHome', { uid: this.props.postItem.owner, pubNum: this.props.postItem.key.num });
        } else {
            if (this.props.isUserDetailPage) return;
            popNew3('chat-client-app-view-info-userDetail', { uid: this.props.postItem.owner, num:this.props.postItem.key.num },(value) => {
                if (value !== undefined) {
                    gotoSquare(value);
                }
            });
        }
    }

    /**
     * 举报
     */
    public complaint(e:any) {
        this.closeUtils(e);
        const avatar = this.props.postItem.avatar ? buildupImgPath(this.props.postItem.avatar) :'../../res/images/user_avatar.png';
        const key = `${this.props.postItem.isPublic ? REPORT_ARTICLE :REPORT_POST}%${JSON.stringify(this.props.postItem.key)}`;
        // 文章则传文章标题
        const title = this.props.postItem.isPublic ? this.props.postItem.title :'';
        complaintUser(`${this.props.postItem.username} 的内容`,this.props.postItem.gender,avatar,this.props.postItem.content,this.props.postItem.isPublic ? REPORT_ARTICLE :REPORT_POST,key,this.props.postItem.owner,title);
    }

    /**
     * 删除帖子
     */
    public delPost(e:any) {
        this.closeUtils(e);
        popModalBoxs('chat-client-app-widget-modalBox-modalBox', { title:'删除',content:'确定删除该动态或文章？' },() => {
            delPost(this.props.postItem.key.num,this.props.postItem.key.id).then(r => {
                notify(e.node,'ev-delBtn',{ value:this.props.postItem.key });
                this.paint();
            });
        });
        
    }

    /**
     * 关注用户
     */
    public followUser(e:any) {
        this.closeUtils(e);
        if (this.props.postItem.followed) {
            popModalBoxs('chat-client-app-widget-modalBox-modalBox', { title:'取消关注',content:'确定取消关注？' },() => {
                follow(this.props.postItem.key.num);
                this.props.postItem.followed = false;
                this.paint();
            });
        } else {
            this.props.fgStatus = true;
            this.paint();
            setTimeout(() => {
                this.props.fgStatus = false;
                this.props.postItem.followed = true;
                popNewMessage('关注成功');
                this.paint();
                follow(this.props.postItem.key.num);
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
        // 判断是否查看过原图
        const key = this.props.postItem.key.id;
        let value = [];
        this.props.postItem.imgs.forEach(v => {
            value.push(false);
        });
        const originalImage = getStore('originalImage');
        if (!originalImage.get(key)) {
            originalImage.set(key,value);
        } else {
            value = originalImage.get(key);
        }
        const val = [];
        const icon = [];
        this.props.postItem.imgs.forEach((v:any) => {
            icon.push(buildupImgPath(v.compressImg));
            val.push(buildupImgPath(v.originalImg));
        });
        popNew3('chat-client-app-view-imgSwiper-imgSwiper',{
            list:val,
            thumbnail:icon,
            activeIndex:ind + 1,
            showOrg:value,
            key
        });
    }

    /**
     * 计算一张图片宽高
     */
    public calcImg() {
        if (this.props.postItem.imgs.length !== 1) {
            return;
        }
        const src = buildupImgPath(this.props.postItem.imgs[0].compressImg);
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

    /**
     * 去标签页
     */
    public goLabel(e:any) {
        const tagList = getStore('tagList');
        // 判断当前的标签页
        const index = tagList.indexOf(this.props.gameLabel.name);
        notify(e.node,'ev-change-tag',{ value:index });
    }
}
