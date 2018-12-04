/**
 * 群聊列表
 */
// ================================ 导入
import { Json } from '../../../../pi/lang/type';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';
import { popNew } from '../../../../pi/ui/root';
import { clientRpcFunc } from '../../net/init';
import { applyJoinGroup } from '../../../../server/data/rpc/group.p';


// ================================ 导出
export class GroupListt extends Widget {
    public ok:() => void;
    public props:Props = {
        inputGid:null,
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
    // 输入要添加群聊的Gid
    public inputGid(e:any){
        this.props.inputGid = parseInt(e.value,10);
    }
    // 主动添加群聊
    public applyGroup(){
        clientRpcFunc(applyJoinGroup, this.props.inputGid, ((r) => {
            console.log("=====r",r)    
        }));
    }
    
}

// ================================================ 本地

interface Props {
    inputGid:number,
    groups:number[];
}
