// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { GROUP_STATE, GroupInfo } from '../../../../server/data/db/group.s';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
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
        avatar:'',
        gInfo:null,
        show:true
    };

    public setProps(props: any) {
        super.setProps(props);
        const group = this.props.gInfo = store.getStore(`groupInfoMap/${this.props.gid}`,new GroupInfo());
        this.props.official = group.level === 5;
        this.props.show = group.state === GROUP_STATE.CREATED;
        this.props.avatar = getGroupAvatar(this.props.gid) || '../../res/images/groups.png';
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    public goChat() {
        popNew('chat-client-app-view-chat-chat', { id: this.props.gInfo.gid, chatType: GENERATOR_TYPE.GROUP });
    }
}

// ================================================ 本地
interface Props {
    gid:number; // 群组id
    avatar:string; // 图标或头像
    official:boolean; // 是否是官方群组
    gInfo:GroupInfo; // 简介
    show:boolean;  // 是否显示 群未被解散
}
