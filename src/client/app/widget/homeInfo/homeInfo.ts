/**
 * homeInfo 组件相关处理
 *
 */ 

// ===========================导入
import { Widget } from '../../../../pi/widget/widget';

interface Props {
    userId:number;
    avatorPath : string;// 头像路径
    name : string;// 用户名还是组名
    note ?: string; // 群号或者备注
    isUser : boolean;// 是否是用户
    isContactor:boolean;// 是否是联系人
}

// ===========================导出
export class HomeInfo extends Widget {
    public props : Props = {
        userId:null,
        avatorPath : 'emoji.png',
        name : '群号',
        note : '',
        isUser : false,
        isContactor:true
    };
    public setProps(props:any) {
        super.setProps(props);
        console.log('hhhhhhhhhhhhhhhhhhhh',props);
    }
}
