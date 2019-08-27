import { Widget } from '../../../../../pi/widget/widget';
import { getUserInfoByNum } from '../../net/rpc';

interface Props {
    followList:string[];  // 关注列表
    followData:any[];  // 关注用户信息
}

/**
 * 管理关注
 */
export class ManageFollow extends Widget {
    public ok:() => void;
    public props:Props = {
        followList:[],
        followData:[]
    };

    public setProps(props:any) {
        super.setProps(props);
        this.props.followData = [];
        getUserInfoByNum(this.props.followList).then((r:string[]) => {
            this.props.followData = r;  // 关注
            this.paint();
        });
    }

    public goBack() {
        this.ok && this.ok();
    }
}
