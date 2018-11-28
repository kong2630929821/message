/**
 * inputMessage 组件相关处理
 */
// ===========================导入
import { Json } from '../../../../pi/lang/type';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';

interface Props {
    rid : number;
    isOnInput:boolean;
    message:string;
}

// ===========================导出
export class InputMessage extends Widget {
    public props:Props = {
        rid : 10001,
        isOnInput:false,
        message:''
    };

    public setProps(props:Json) {
        super.setProps(props);
        this.props.isOnInput = false;
    }
    
    // 麦克风输入处理
    public playRadio() {
        console.log('playRadio');
    }

    // 打开表情
    public playRemoji() {
        console.log('playRemoji');
    }

    // 打开更多功能
    public openTool() {
        console.log('openTool');
    }

    // 点击发送
    public send(e:any) {
        if (this.props.isOnInput) { // 有输入才触发发送事件处理
            notify(e.node,'ev-send',{ value:this.props.message });    
        }
        this.props.message = '';
        this.paint();
    }

    public handleOnInput(e:any) {
        if (e.value) {
            this.props.isOnInput = true;
        } else {
            this.props.isOnInput = false;
        }
        this.props.message = e.value;
        this.paint();
    }

}
