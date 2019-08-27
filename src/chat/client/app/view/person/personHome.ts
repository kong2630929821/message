import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore } from '../../data/store';
import { getUserInfoByNum, getUserPostList } from '../../net/rpc';

interface Props {
    uid:number;
    num:string;
    activeTab:number;
    postList:any[];  // 发布的帖子列表
    followList:string[];  // 关注列表
    fansList:string[];  // 粉丝列表
    followData:any[];  // 关注用户信息
    fansData:any[];   // 粉丝用户信息
    isMine:boolean;  // 是否本人
}

/**
 * 个人主页
 */
export class PersonHome extends Widget {
    public ok:() => void;
    public props:Props = {
        uid:0,
        num:'',
        activeTab:0,
        postList:[],
        followList:[],
        fansList:[],
        followData:[],
        fansData:[],
        isMine:false
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.props.isMine = this.props.uid === getStore('uid');
        getUserInfoByNum(this.props.followList).then((r:string[]) => {
            this.props.followData = r;  // 关注
            this.paint();
        });
        getUserInfoByNum(this.props.fansList).then((r:string[]) => {
            this.props.fansData = r;  // 粉丝
            this.paint();
        });
    }

    public changeTab(i:number) {
        this.props.activeTab = i;
        this.paint();

        if (i === 0) {
            // getUserPostList(this.props.num).then((r:any) => {
            //     this.props.postList = r.list;  // 动态
            //     this.paint();
            // });

        }
    }

    public goBack() {
        this.ok && this.ok();
    }

    /**
     * 发动态
     */
    public sendPost() {
        popNew('chat-client-app-view-info-editPost',null,() => {
            getUserPostList(this.props.num).then((r:any) => {
                this.props.postList = r.list;  // 动态
                this.paint();
            });
        });
    }
}