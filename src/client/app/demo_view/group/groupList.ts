/**
 * 群聊列表
 */
// ================================ 导入
import { Json } from '../../../../pi/lang/type';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';
import { popNew } from '../../../../pi/ui/root';


// ================================ 导出
export class GroupListt extends Widget {
    public ok:() => void;
    public props:Props = {
        groups:[],
    };
    public goBack(){
        this.ok();
    }
    setProps(props,oldProps){
       super.setProps(props,oldProps);
       this.props.groups = props.groups;

    }
    // 点击查看群的详细信息
    public showInfo(gid:number){
        popNew('client-app-demo_view-group-groupInfo', { gid:gid });
    }
    
}

// ================================================ 本地

interface Props {
    groups:number[];
}
