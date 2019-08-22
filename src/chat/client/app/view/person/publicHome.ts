import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore } from '../../data/store';
import { follow } from '../../net/rpc';

interface Props {
    isMine:boolean;  // 是否自己的公众号
    showTool:boolean;  // 显示操作栏
    followed:boolean; // 是否关注
    pubNum:string;  // 公众号ID
    uid:number; // uid
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
        uid:0
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const sid = getStore('uid', 0);
        const followList = getStore(`followNumList/${sid}`,{ public_list:[] }).public_list;
        this.props.followed = followList.indexOf(this.props.pubNum) > -1;
        this.props.isMine = this.props.uid === sid;
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
        follow(this.props.pubNum).then(r => {
            this.props.followed = !this.props.followed;
            this.paint();
        });
    }

    // 发公众号文章
    public sendArticle() {
        popNew('chat-client-app-view-info-editPost',{ isPublic:true,num: this.props.pubNum });
    }
}