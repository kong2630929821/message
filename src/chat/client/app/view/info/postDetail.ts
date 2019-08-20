import { popNewMessage } from '../../../../../app/utils/tools';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore, setStore } from '../../data/store';
import { postLaud, showComment, showLikeList } from '../../net/rpc';
import { parseEmoji } from '../home/square';

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
        gender: 0
    };

    public setProps(props: any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.init(this.props.active);
    }

    public init(tab:string) {
        if (tab === TAB.comment) {
            showComment(this.props.key.num, this.props.key.id).then((r: any) => {
                this.props.commentList = r.list;
                this.paint();
            });
        } else {
            showLikeList(this.props.key.num,this.props.key.id).then((r: any) => {
                this.props.likeList = r.list;
                const ind = r.list.findIndex(v => {
                    return v.key.uid === getStore('uid');
                });
                if (ind > -1) {
                    this.props.likeActive = true;
                }
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
            this.props.commentList.unshift({
                key: r.key,
                msg: parseEmoji(r.value),
                createtime: Date.now(),
                likeCount: 0,
                username: this.props.username,
                avatar: this.props.avatar,
                gender: this.props.gender
            });
            this.paint();
        });
    }

    /**
     * 回复评论
     */
    public replyComment(e:any) {
        this.props.commentList.unshift({
            key: e.key,
            msg: parseEmoji(e.value),
            createtime: Date.now(),
            likeCount: 0,
            username: this.props.username,
            avatar: this.props.avatar,
            gender: this.props.gender,
            orgName: e.username,
            orgMess: e.mess
        });
        this.paint();
    }
}