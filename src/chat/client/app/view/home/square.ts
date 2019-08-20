import { popNew3 } from '../../../../../app/utils/tools';
import { notify } from '../../../../../pi/widget/event';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { CommType, PostArr } from '../../../../server/data/rpc/community.s';
import { register, setStore } from '../../data/store';
import { postLaud, showPost } from '../../net/rpc';
import { EMOJIS_MAP } from '../../widget/emoji/emoji';

export const forelet = new Forelet();

interface Props {
    showTag:boolean;  // 显示标签列表
    tagList:string[];  // 标签列表
    active:number;  // 当前显示的标签
}
export const TagList = ['广场','关注','热门','公众号'];
/**
 * 广场
 */
export class Square extends Widget {
    public state:any;
    public props:Props = {
        showTag:false,
        tagList:TagList,
        active:0
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.state = State;

        showPost('').then((r:PostArr) => {
            console.log('获取广场帖子',r);
            if (r && r.list) {
                const data:any = r.list;
                data.forEach((res,i) => {
                    data[i].offcial = res.comm_type === CommType.official;
                    data[i].isPublic = res.comm_type === CommType.publicAcc;
                    const body = JSON.parse(res.body);
                    data[i].content = parseEmoji(body.msg);
                    data[i].imgs = body.imgs;
                    data[i].followed = State.followList.indexOf(res.key.num) > -1;
                    data[i].likeActive = State.likeList.findIndex(r => r.num === res.key.num && r.id === res.key.id) > -1;
                });
                this.state.postList = data;
                setStore('postList',data,false);
                this.paint();
            }
        });
    }

    // 切换tag
    public changeTag(e:any,ind:number) {
        this.props.showTag = false;
        this.props.active = ind;
        this.paint();
        notify(e.node,'ev-square-change',{ value:ind });
    }

    // 管理我关注的公众号 其他账号
    public goManage() {
        popNew3('chat-client-app-view-person-manageFollow');
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

}
const State = {
    followList:[],
    likeList:[],
    postList:[]  // 帖子列表
};
// 关注列表
register('followNumList',r => {
    for (const value of r.values()) {
        State.followList = value.list;
        State.postList.forEach((v,i) => {
            State.postList[i].followed = State.followList.indexOf(v.key.num) > -1;
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
            // FIXME: 不应该写死,应该动态获取
            // url = url.replace('../../','/client/app/');

            return `<img src="../../chat/client/app/res/emoji/${url}" alt="${capture}" class='emojiMsg'></img>`;
        } else {
            return match;
        }
    });

    return msg;
};