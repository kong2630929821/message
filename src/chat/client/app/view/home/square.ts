import { popNew3 } from '../../../../../app/utils/tools';
import { notify } from '../../../../../pi/widget/event';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore, register } from '../../data/store';
import { postLaud, showPost } from '../../net/rpc';
import { EMOJIS_MAP } from '../../widget/emoji/emoji';

export const forelet = new Forelet();

interface Props {
    showTag:boolean;  // 显示标签列表
    tagList:string[];  // 标签列表
    active:number;  // 当前显示的标签
    follows:number;  // 关注人数
}
export const TagList = ['广场','关注','公众号','热门'];
/**
 * 广场
 */
export class Square extends Widget {
    public state:any;
    public props:Props = {
        showTag:false,
        tagList:TagList,
        active:0,
        follows:0
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        State.postList = [];
        this.state = State;
        this.init(this.props.active);
        showPost(this.props.active + 1);
    }

    public init(ind:number) {
        if (ind === 2) {
            const pubNum = getStore('pubNum', 0);
            this.props.follows = this.state.followList.public_list.filter(v => {

                return v !== pubNum;
            }); 
        } else {
            const user = getStore(`userInfoMap/${getStore('uid')}`, {});
            this.props.follows = this.state.followList.person_list.filter(v => {
                return v !== user.comm_num;
            });
        } 
    }

    // 切换tag
    public changeTag(ind:number,e:any) {
        this.props.showTag = false;
        this.props.active = ind;
        this.init(ind);
        this.paint();
        notify(e.node,'ev-square-change',{ value:ind });
    }

    // 管理我关注的公众号 其他账号
    public goManage() {
        popNew3('chat-client-app-view-person-manageFollow',{ followList:this.props.follows });
    }

    /**
     * 点赞
     */
    public likeBtn(i:number) {
        const v = this.state.postList[i];
        v.likeActive = !v.likeActive;
        v.likeCount += v.likeActive ? 1 :-1;
        this.paint();
        postLaud(v.key.num, v.key.id, () => {
            // 失败了则撤销点赞或取消点赞操作
            v.likeActive = !v.likeActive;
            v.likeCount += v.likeActive ? 1 :-1;
            this.paint();
        });
    }

    /**
     * 评论
     */
    public commentBtn(i:number) {
        const v = this.state.postList[i];
        popNew3('chat-client-app-view-info-editComment',{ key:v.key },() => {
            v.commentCount ++;
            this.paint();
            popNew3('chat-client-app-view-info-postDetail',{ ...v,showAll:true });
        });
    }

    /**
     * 删除
     */
    public delPost(i:number) {
        this.state.postList.splice(i,1);
        this.paint();
    }
}
const State = {
    followList:{
        person_list:[],
        public_list:[]
    },
    likeList:[],
    postList:[]  // 帖子列表
};
// 关注列表
register('followNumList',r => {
    for (const value of r.values()) {
        State.followList = value;
        const list = value.person_list.concat(value.public_list);
        State.postList.forEach((v,i) => {
            State.postList[i].followed = list.indexOf(v.key.num) > -1;
        });
    }
   
    forelet.paint(State);
});
// 点赞列表
register('laudPostList',r => {
    for (const value of r.values()) {
        State.likeList = value.list;
        State.postList.forEach((v,i) => {
            State.postList[i].likeActive = State.likeList.findIndex(r => r.num === v.key.num && r.id === v.key.id) > -1;
        });
    }
    
    forelet.paint(State);
});
// 帖子数据
register('postList',r => {
    State.postList = r;
    forelet.paint(State);
});

// 转换文字中的链接
const httpHtml = (str:string) => {
    const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|:|#)+)/g;
    
    return str.replace(reg, '<a href="javascript:;" class="linkMsg">$1$2</a>');
};

// 转换表情包
export const parseEmoji = (msg:any) => {    
    msg = httpHtml(msg);
    msg = msg.replace(/\[(\S+?)\]/ig, (match, capture) => {
        const url = EMOJIS_MAP.get(capture) || undefined;
        if (url) {
            return `<img src="../../chat/client/app/res/emoji/${url}" alt="${capture}" class='emojiMsg'></img>`;
        } else {
            return match;
        }
    });

    return msg;
};