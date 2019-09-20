import { Widget } from '../../../pi/widget/widget';
import { rippleShow } from '../utils/tools';

interface Props {
    checkType:any;// 处罚类型
    checkedList:number;// 选中的处罚类型
    checkTime:any;// 选择时长
    checkTimeList:number;// 选中时长
}

/**
 * 处罚弹框
 */
export class ReportBox extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:Props = {
        checkType:['禁止发动态','禁止发消息','冻结用户'],
        checkedList:0,
        checkTime:['12小时','24小时','7天','30天','180天'],
        checkTimeList:0
    };

    // 选择处罚类型
    public btnCheckType(index:number) {
        this.props.checkedList = index;
        this.paint();
    }

    // 处罚时间选择
    public btnCheckTime(index:number) {
        this.props.checkTimeList = index;
        this.paint();
    }
    // 取消
    public btnCancel() {
        this.cancel && this.cancel();
    }

    // 确认
    public btnOk() {
        this.ok && this.ok();
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}