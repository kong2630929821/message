/**
 * manageItem 组件相关处理
 */

// ================================================ 导入
import { notify } from '../../../../../pi/widget/event';
import { Widget } from '../../../../../pi/widget/widget';

// ================================================ 导出
export class ManageItem extends Widget {
    public props : Props = {
        manageList:[]
    };
    public openManageItem(e:any,index:number) {
        notify(e.node,'ev-openManageItem',{ value : index });
    }
    
}

// ================================================ 本地
interface Manage {
    title:string;// 标题
    quantity?:string;// 数量
}

interface Props {
    manageList : Manage[];
}
