import { Widget } from '../../../pi/widget/widget';
import { setPunish, setReportHandled } from '../net/rpc';
import { PENALTY, popNewMessage } from '../utils/logic';
import { rippleShow } from '../utils/tools';

interface Props {
    title:string;// 标题
    content:string;// 内容
    prompt:string;// 提示
    btn1:string;// 按钮1
    btn2:string;// 按钮2
    invalid:boolean;// 投诉不成立
    id:number;// 投诉的ID
    key:string;
}

/**
 * 确认框
 */
export class ConfirmBox extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:Props = {
        title:'',
        content:'',
        prompt:'',
        btn1:'取消',
        btn2:'确认',
        invalid:false,
        id:0,
        key:''
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    // 取消
    public btnCancel() {
        this.cancel && this.cancel();
    }

    // 确认
    public btnOk() {
        if (this.props.invalid) {
            setReportHandled(this.props.id).then((r:any) => {
                if (!isNaN(r)) {
                    popNewMessage('操作成功');
                    this.ok && this.ok();
                } else {
                    popNewMessage('操作失败');
                }
            });
        } else {
            const punish = PENALTY.DELETE_CONTENT;
            const key = this.props.key;
            setPunish(key,this.props.id,punish,0).then((r:any) => {
                if (!isNaN(r)) {
                    popNewMessage('处理成功');
                } else {
                    popNewMessage('处理失败');
                }
            });
        }
        // this.ok && this.ok();
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}