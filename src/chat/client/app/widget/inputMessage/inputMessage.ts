/**
 * inputMessage 组件相关处理
 */
// ===========================导入
import { getKeyBoardHeight } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { MSG_TYPE } from '../../../../server/data/db/message.s';
import { selectImage } from '../../logic/native';
import { uploadFile } from '../../net/upload';

// ===========================导出
export class InputMessage extends Widget {
    public props:Props = {
        message:'',
        isOnEmoji:false
    };

    // 麦克风输入处理
    public playRadio() {
        console.log('playRadio');
    }

    // 打开表情包图库
    public playEmoji(e:any) {
        
        getRealNode(this.tree).getElementsByTagName('textarea')[0].blur();
        document.getElementById('emojiMap').style.height = `${getKeyBoardHeight()}px`;

        notify(e.node,'ev-open-Emoji',{});
    }

    // 打开更多功能
    public openTool(e:any) {
        // FIXEME: 直接写的选择照片
        this.sendImg(e);
    }

    // 点击发送
    public send(e:any) {
        if (this.props.message !== '') { // 有输入才触发发送事件处理
            notify(e.node,'ev-send',{ value:this.props.message, msgType:MSG_TYPE.TXT });
        }
        this.props.message = '';
        this.paint();
    }

    public sendImg(e:any) {
        // FIXME: 此方法不应该写在这里，只是为了测试，请把我挪走
        selectImage((width, height, base64) => {
            uploadFile(base64, (imgUrlSuf:string) => {
                notify(e.node,'ev-send',{ value:`[${imgUrlSuf}]`, msgType:MSG_TYPE.IMG });
            });            
        });
    }

}
// ===========================本地
interface Props {
    isOnEmoji:boolean;
    message:string;
}