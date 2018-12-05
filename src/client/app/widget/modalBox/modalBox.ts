/**
 * modalbox
 */
import { Widget } from '../../../../pi/widget/widget';
import { notify } from '../../../../pi/widget/event';
import { clientRpcFunc } from '../../net/init';
import { userExitGroup, setOwner, dissolveGroup } from '../../../../server/data/rpc/group.p';

interface Props {
    gid:number;
    guid:number;
    record:number;
    topic:string;
    title: string;
    content: string;
    sureText: string;
    cancelText: string;
    style?: string; // 修改content的样式
}
export class ModalBox extends Widget {
    public props: Props;
    public ok: () => void;
    public setProps(props){
        super.setProps(props);
        this.props.gid = props.gid;
        this.props.guid = props.guid;
        this.props.record = props.record;
        this.props.topic = props.topic;
    }
    public cancel: () => void;

    public cancelBtnClick(e: any) {
        this.cancel && this.cancel();
    }
    public okBtnClick(e: any) {
        console.log("==============click sure",this.props.record)
        // 删除群组
        if(this.props.record === 2){
            console.log("ev-deleteGroup");
            clientRpcFunc(userExitGroup,this.props.gid,(r) => {
                console.log("========用户主动退出群组",r);
            })
        }
        // 确定转让群主
        if(this.props.topic === "transOwner"){
            console.log("transGroupOwner");
            clientRpcFunc(setOwner,this.props.guid,(r) => {
                console.log("========转让群主",r);
            })
        }
        // 解散群
        if(this.props.topic === "dissolveGroup"){
            console.log("dissolveGroup");
            clientRpcFunc(dissolveGroup,this.props.gid,(r) => {
                console.log("========解散群",r);
            })
        }
        this.ok && this.ok();
    }
}
