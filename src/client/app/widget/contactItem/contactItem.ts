/**
 * contactItem 组件相关处理
 */
// ===========================导入
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
import { getFriendAlias } from '../../logic/logic';

interface Props {
    uid?:number;
    info?:Json; // 用户信息
    text?:string; // 显示文本
    totalNew?: number;// 多少条消息
}

// ===========================导出
export class ContactItem extends Widget {
    public props : Props = {
        uid:null,
        info:null,  
        text:null,
        totalNew: null  
    };
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props, oldProps);
        console.log(props);
        if (!this.props.text) {
            this.props.info = getFriendAlias(this.props.uid);
        }
    }
   
}
