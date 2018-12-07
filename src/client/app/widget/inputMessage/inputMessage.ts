/**
 * inputMessage 组件相关处理
 */
// ===========================导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';
import { MSG_TYPE } from '../../../../server/data/db/message.s';
import { selectImage } from '../../logic/native';
import { uploadFile } from '../../net/upload';

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
        popNew('client-app-demo_view-chat-emoji',undefined,undefined,undefined,(emoji:string) => {
            this.props.message += `[${emoji}]`;
            this.paint();
        });
        console.log('playRemoji');
    }

    // 打开更多功能
    public openTool(e:any) {
        // FIXEME: 直接写的选择照片
        this.sendImg(e);
        console.log('openTool');
    }

    // 点击发送
    public send(e:any) {
        if (this.props.isOnInput) { // 有输入才触发发送事件处理
            notify(e.node,'ev-send',{ value:this.props.message, msgType:MSG_TYPE.TXT });
            this.props.isOnInput = false;
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
    public sendImg(e:any) {
        // FIXME: 此方法不应该写在这里，只是为了测试，请把我挪走
        selectImage((width, height, base64) => {
            uploadFile(base64, (imgUrlSuf:string) => {
                notify(e.node,'ev-send',{ value:`[${imgUrlSuf}]`, type:MSG_TYPE.IMG });
            });            
        });
    }

}
// ===========================本地
interface Props {
    rid : number;
    isOnInput:boolean;
    message:string;
}