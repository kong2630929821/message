import { Widget } from '../../../pi/widget/widget';

interface Props {
    checkType:any;// 处罚类型
    checkedList:any;// 选中的处罚类型
    checkTime:any;// 选择时长
    checkTimeList:any;// 选中时长
}

/**
 * 处罚弹框
 */
export class ReportBox extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:Props = {
        checkType:['禁止发动态','禁止发消息','冻结用户'],
        checkedList:[false,false,false],
        checkTime:['12小时','24小时','7天','30天','180天'],
        checkTimeList:[false,false,false,false,false]
    };
}