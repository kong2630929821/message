import { popNewMessage } from '../../../../../app/utils/tools';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore, setStore } from '../../data/store';
import { buildupImgPath, judgeLiked, timestampFormat } from '../../logic/logic';
import { getCommentLaudList, postLaud, showComment, showLikeList } from '../../net/rpc';

interface Props {
    key: any;
    username: string;
    avatar: string;
    title: string;     // 标题
    createtime: string;
    content: string;
    active: string;
    commentCount: number;   // 评论数量
    likeCount: number;  // 点赞数量
    likeActive: boolean;  // 点赞
    isPublic: boolean;   // 是否是公众号发布的帖子
    showAll: boolean;    // 展示详情，子组件需要
    commentList: any[];  // 评论列表
    likeList: any[]; // 点赞记录
    gender: number;  // 性别 0 男 1 女
    commentLikeList:number[]; // 点赞的评论列表
    timeFormat:any;  // 时间处理
    refresh:boolean; // 是否可以请求更多数据
}
const TAB = {
    comment: 'comment',
    like: 'like'
};
/**
 * 广场帖子详情
 */
export class PostDetail extends Widget {
    public ok: () => void;
    public props: Props = {
        key: {
            num: '',
            id: 0
        },
        username: '用户名',
        avatar: '../../res/images/user_avatar.png',
        title: '详情',
        createtime: '',
        content: '',
        active: TAB.comment,
        commentCount: 0,
        likeCount: 15,
        likeActive: false,
        isPublic: true,
        showAll: true,
        commentList: [],
        likeList: [],
        gender: 0,
        commentLikeList:[],
        timeFormat:timestampFormat,
        refresh:true
    };

    public setProps(props: any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.props.likeActive = judgeLiked(this.props.key.num,this.props.key.id);
        getCommentLaudList(this.props.key.num,this.props.key.id).then((r:number[]) => {
            this.props.commentList = this.props.commentList.map(v => {
                v.likeActive = r.indexOf(v.key.id) > -1;

                return v;
            });
            this.props.commentLikeList = r;
            this.paint();
        });
        this.init(this.props.active);
    }

    public init(tab:string) {
        if (tab === TAB.comment) {
            showComment(this.props.key.num, this.props.key.id).then((r: any) => {
                this.props.commentList = r.map(v => {
                    v.likeActive = this.props.commentLikeList.indexOf(v.key.id) > -1;

                    return v;
                });
                this.paint();
            });
            
        } else {
            showLikeList(this.props.key.num,this.props.key.id).then((r: any) => {
                this.props.likeList = r.map(v => {
                    v.avatar = buildupImgPath(v.avatar);
                    
                    return v;
                });
                this.paint();
            });
        }
    }

    public goBack() {
        this.ok && this.ok();
    }

    public changeTab(tab: string) {
        this.props.active = tab;
        this.init(tab);
        this.paint();
    }

    /**
     * 点赞
     */
    public async likeBtn() {
        this.props.likeActive = !this.props.likeActive;
        this.props.likeCount += this.props.likeActive ? 1 : -1;
        this.paint();
        try {
            await postLaud(this.props.key.num, this.props.key.id, () => {
                // 失败了则撤销点赞或取消点赞操作
                this.props.likeActive = !this.props.likeActive;
                this.props.likeCount += this.props.likeActive ? 1 : -1;
                this.paint();
            });
        } catch (r) {
            popNewMessage('点赞失败了');
        }
        const postlist = getStore('postList',[]);
        const ind = postlist.findIndex(r => r.key.num === this.props.key.num && r.key.id === this.props.key.id);
        postlist[ind].likeActive = this.props.likeActive;
        postlist[ind].likeCount = this.props.likeCount;
        setStore('postList',postlist);
    }

    /**
     * 评论
     */
    public doComment() {
        popNew('chat-client-app-view-info-editComment', { key:this.props.key }, (r) => {
            const uid = getStore('uid');
            const userinfo = getStore(`userInfoMap/${uid}`,{});
            this.props.commentList.unshift({
                key: r.key,
                msg: r.value,
                createtime: Date.now(),
                likeCount: 0,
                username: userinfo.name,
                avatar: buildupImgPath(userinfo.avatar),
                gender: userinfo.sex,
                owner:uid
            });
            this.props.commentCount++;
            this.paint();

            const postlist = getStore('postList',[]);
            const ind = postlist.findIndex(r => r.key.num === this.props.key.num && r.key.id === this.props.key.id);
            postlist[ind].commentCount = this.props.commentCount;
            setStore('postList',postlist);
        });
    }

    /**
     * 回复评论
     */
    public replyComment(e:any) {
        const uid = getStore('uid');
        const userinfo = getStore(`userInfoMap/${uid}`,{});
        this.props.commentList.unshift({
            key: e.key,
            msg: e.value,
            createtime: Date.now(),
            likeCount: 0,
            username: userinfo.name,
            avatar: buildupImgPath(userinfo.avatar),
            gender: userinfo.sex,
            owner: uid,
            orgName: e.username,
            orgMess: e.mess
        });
        this.props.commentCount++;
        this.paint();

        const postlist = getStore('postList',[]);
        const ind = postlist.findIndex(r => r.key.num === this.props.key.num && r.key.id === this.props.key.id);
        postlist[ind].commentCount = this.props.commentCount;
        setStore('postList',postlist);
    }

    /**
     * 删除评论
     */
    public deleteComment(i:number) {
        this.props.commentList.splice(i,1);
        this.props.commentCount--;
        this.paint();
    }

    /**
     * 滚动加载更多评论或点赞
     */
    public scrollPage() {
        const page = document.getElementById('postPage');
        const contain = document.getElementById('postContain');
        if (this.props.refresh && (contain.offsetHeight - page.scrollTop - page.offsetHeight) < 150) {
            console.log('1111111111111111111111111');
            this.props.refresh = false;
            
            if (this.props.active === TAB.comment) {
                let list = this.props.commentList;
                showComment(this.props.key.num, this.props.key.id,list[list.length - 1].key.id).then((r: any) => {
                    if (list[list.length - 1].key.id !== r[0].key.id) {
                        r = r.map(v => {
                            v.likeActive = this.props.commentLikeList.indexOf(v.key.id) > -1;
    
                            return v;
                        });
                        list = list.concat(r);
                    }
                    this.props.commentList = list;
                    this.paint();
                });

            } else {
                let list = this.props.likeList;
                showLikeList(this.props.key.num, this.props.key.id,list[list.length - 1].key.uid).then((r: any) => {
                    if (list[list.length - 1].key.uid !== r[0].key.uid) {
                        r = r.map(v => {
                            v.avatar = buildupImgPath(v.avatar);
                            
                            return v;
                        });
                        list = list.concat(r);
                    }
                    this.props.likeList = list;
                    this.paint();
                });
            }
            
        }
    }
}