import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    isPublic:boolean;  // 公众号列表
    followList:any[];  // 关注列表
}

/**
 * 管理关注
 */
export class ManageFollow extends Widget {
    public ok:() => void;
    public props:Props = {
        isPublic:false,
        followList:[]
    };

    public setProps(props:any) {
        super.setProps(props);
        this.props.followList = [];
    }

    public goBack() {
        this.ok && this.ok();
    }
}
