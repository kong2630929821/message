// ================================================ 导入
import { Widget } from '../../../../../pi/widget/widget';
import { GROUP_STATE, GroupInfo } from '../../../../server/data/db/group.s';
import * as store from '../../data/store';
import { getGroupAvatar, rippleShow } from '../../logic/logic';

// ================================================ 导出
/**
 * GroupItem 组件相关处理
 */
export class GroupItem extends Widget {
    public props: Props = {
        gid:null,
        official:false,
        show:true,
        name:'',
        avatar:'',
        msg:''
    };

    public setProps(props: any) {
        super.setProps(props);
        
        const group = store.getStore(`groupInfoMap/${this.props.gid}`,new GroupInfo());
        this.props.official = group.level === 5;
        this.props.name = group.name; 
        this.props.show = group.state === GROUP_STATE.CREATED;
        this.props.avatar = getGroupAvatar(this.props.gid) || '../../res/images/groups.png';
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}

// ================================================ 本地
interface Props {
    gid:number; // 群组id
    name:string; // 群名
    show:boolean;  // 是否展示
    avatar:string; // 图标或头像
    official:boolean; // 是否是官方群组
    msg:string; // 简介
}
