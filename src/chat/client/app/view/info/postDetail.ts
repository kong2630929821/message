import { popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { getStore, PostItem, setStore } from '../../data/store';
import { buildupImgPath, getUserAvatar, judgeLiked, timestampFormat } from '../../logic/logic';
import { popNewMessage } from '../../logic/tools';
import { getCommentLaudList, getPostDetile, postLaud, showComment, showLikeList } from '../../net/rpc';

interface Props {
    active: string;
    likeActive: boolean;  // 点赞
    showAll: boolean;    // 展示详情，子组件需要
    commentList: any[];  // 评论列表
    likeList: any[]; // 点赞记录
    gender: number;  // 性别 0 男 1 女
    commentLikeList:number[]; // 点赞的评论列表
    timeFormat:any;  // 时间处理
    refresh:boolean; // 是否可以请求更多数据
    expandItem:number;// 动态详情工具展示
    dealData:any;  // 组装数据
    expandItemTop:boolean;
    postItem:PostItem;
}
const TAB = {
    comment: 'comment',
    like: 'like'
};
/**
 * 广场帖子详情
 */
export class PostDetail extends Widget {
    public ok: (value?:string) => void;
    public props: Props = {
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
        active: TAB.comment,
        likeActive: false,
        showAll: true,
        commentList: [],
        likeList: [],
        gender: 0,
        commentLikeList:[],
        timeFormat:timestampFormat,
        refresh:true,
        expandItem:-1,
        dealData:this.dealData,
        expandItemTop:false
    };

    public setProps(props: any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.props.likeActive = judgeLiked(this.props.postItem.key.num,this.props.postItem.key.id);
        getCommentLaudList(this.props.postItem.key.num,this.props.postItem.key.id).then((r:number[]) => {
            this.props.commentList = this.props.commentList.map(v => {
                v.likeActive = r.indexOf(v.key.id) > -1;

                return v;
            });
            this.props.commentLikeList = r;
            this.paint();
        });
        showComment(this.props.postItem.key.num, this.props.postItem.key.id).then((r: any) => {
            this.props.commentList = r.map(v => {
                v.likeActive = this.props.commentLikeList.indexOf(v.key.id) > -1;

                return v;
            });
            this.paint();
        });
        showLikeList(this.props.postItem.key.num,this.props.postItem.key.id).then((r: any) => {
            this.props.likeList = r.map(v => {
                v.avatar = buildupImgPath(v.avatar);
                
                return v;
            });
            this.paint();
        });
        getPostDetile(this.props.postItem.key.num,this.props.postItem.key.id).then((r:any) => {
            this.props.postItem.likeCount = r[0].likeCount;
            this.props.postItem.commentCount = r[0].commentCount;
            this.paint();
            // 刷新广场数据
            const postlist = getStore('postReturn',[]);
            const ind = postlist.postList.findIndex(r => r.key.num === this.props.postItem.key.num && r.key.id === this.props.postItem.key.id);
            if (ind > -1) {
                postlist.postList[ind].commentCount = this.props.postItem.commentCount;
                postlist.postList[ind].likeCount = this.props.postItem.likeCount;
                setStore('postReturn',postlist);
            }
        });
    }

    // 返回
    public goBack() {
        this.ok && this.ok();
    }

    // 切换tab
    public changeTab(tab: string) {
        this.props.active = tab;
        this.paint();
    }

    /**
     * 点赞
     */
    public async likeBtn() {
        this.props.likeActive = !this.props.likeActive;
        this.props.postItem.likeCount += this.props.likeActive ? 1 : -1;
        try {
            await postLaud(this.props.postItem.key.num, this.props.postItem.key.id);
            const uid = getStore('uid',0);
            if (this.props.likeActive) {

                // const userInfo = getStore(`userInfoMap/${getStore('uid')}`);
                // this.props.likeList.push({
                //     key:{ uid },
                //     avatar:getUserAvatar(userInfo.uid),
                //     createtime:Date.now(),
                //     username:userInfo.name,
                //     gender:userInfo.sex
                // }); 
            } else {
                const ind = this.props.likeList.findIndex(r => r.key.uid === this.props.postItem.key.num === uid);
                ind > -1 && this.props.likeList.splice(ind,1);
            }
            this.paint();

            const postlist = getStore('postReturn/postList',[]);

            const ind = postlist.findIndex((r) => {
                return r.key.num === this.props.postItem.key.num && r.key.id === this.props.postItem.key.id;
            });
            if (ind > -1) {
                postlist[ind].likeActive = this.props.likeActive;
                postlist[ind].likeCount = this.props.postItem.likeCount;
                setStore('postReturn/postList',postlist);
            }
        } catch (r) {
            this.props.likeActive = !this.props.likeActive;
            this.props.postItem.likeCount += this.props.likeActive ? 1 : -1;
            this.paint();
            console.log('error ',r);
            popNewMessage('点赞失败了');
        }
    }

    /**
     * 评论
     */
    public doComment() {
        popNew('chat-client-app-view-info-editComment', { key:this.props.postItem.key }, (r) => {
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
            this.props.postItem.commentCount++;
            this.paint();
            this.updateComment();
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
        this.props.postItem.commentCount++;
        this.paint();
        this.updateComment();
    }

    /**
     * 删除评论
     */
    public deleteComment(i:number) {
        this.props.commentList.splice(i,1);
        this.props.postItem.commentCount--;
        this.paint();
        this.updateComment();
    }

    // 更新评论
    public updateComment() {
        const postlist = getStore('postReturn/postList',[]);
        const ind = postlist.findIndex((r:any) => {
            return r.key.num === this.props.postItem.key.num && r.key.id === this.props.postItem.key.id;
        });
        if (ind > -1) {
            postlist[ind].commentCount = this.props.postItem.commentCount;
            setStore('postReturn/postList',postlist);
        }
    }

    /**
     * 滚动加载更多评论或点赞
     */
    public scrollPage() {
        this.pageClick();
        const page = document.getElementById('postPage');
        const contain = document.getElementById('postContain');
        if (this.props.refresh && (contain.offsetHeight - page.scrollTop - page.offsetHeight) < 150) {
            console.log('1111111111111111111111111');
            this.props.refresh = false;
            
            if (this.props.active === TAB.comment) {
                let list = this.props.commentList;
                showComment(this.props.postItem.key.num, this.props.postItem.key.id,list[list.length - 1].key.id).then((r: any) => {
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
                showLikeList(this.props.postItem.key.num, this.props.postItem.key.id,list[list.length - 1].key.uid).then((r: any) => {
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

    /**
     * 展示操作
     */
    public expandTools(e:any,i:number) {
        this.pageClick();
        this.props.expandItem = e.value ? i :-1;
        this.paint();
    }

    public pageClick() {
        this.props.expandItem = -1;
        this.props.expandItemTop = !this.props.expandItemTop;
        this.paint();
    }

    /**
     * 组装squareItem的数据
     */
    public dealData(v:any,r:boolean) {
        return { 
            ...v,
            showUtils: r 
        };
    }

    /**
     * 点击游戏标签回到对应标签页
     */
    public changeTag(e:any) {
        const tagList = getStore('tagList');
        // 判断当前的标签页
        this.ok && this.ok(tagList[e.value]);
    }

}