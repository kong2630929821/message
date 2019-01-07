/**
 * inputMessage 组件相关处理
 */
// ===========================导入
import { getKeyBoardHeight, popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { MSG_TYPE } from '../../../../server/data/db/message.s';
import { openCamera, selectImage } from '../../logic/native';
import { imgResize, uploadFile } from '../../net/upload';

// ===========================导出
export class InputMessage extends Widget {
    public props:Props = {
        message:'',
        isOnEmoji:false,
        isOnTools:false,
        toolList:[]
    };

    public setProps(props:any) {
        super.setProps(props);
        this.props.toolList = [
            { name:'拍摄',img:'tool-camera.png' },
            { name:'相册',img:'tool-pictures.png' },
            { name:'红包',img:'tool-redEnv.png' },
            { name:'转账',img:'tool-transaction.png' },
            { name:'名片',img:'tool-card.png' }
        ];
    }

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
        getRealNode(this.tree).getElementsByTagName('textarea')[0].blur();
        document.getElementById('toolsMap').style.height = `${getKeyBoardHeight()}px`;

        notify(e.node,'ev-open-Tools',{});
        // this.sendImg(e);
    }

    // 点击发送
    public send(e:any) {
        if (this.props.message !== '') { // 有输入才触发发送事件处理
            notify(e.node,'ev-send',{ value:this.props.message, msgType:MSG_TYPE.TXT });
        }
        this.props.message = '';
        this.paint();
    }

    // 选择功能
    public pickTool(e:any,i:number) {
        switch (i) {
            case 0:
                sendPicture(e);
                break;
            case 1:
                sendImage(e);
                break;
            case 2:
                sendRedEnv(e);
                break;
            default:
        }
    }

}
// ===========================本地
interface Props {
    isOnEmoji:boolean; // 是否打开表情图库
    message:string; // 消息内容
    isOnTools:boolean;  // 是否打开更多功能
    toolList:any[];  // 更多功能列表
}

/**
 * 发送图片消息
 */
export const sendImage = (e:any) => {
    const imagePicker = selectImage(() => { 
        imagePicker.getContent({
            success(buffer:ArrayBuffer) {
                imgResize(buffer,(res) => {
                    uploadFile(res.base64,(imgUrlSuf:string) => {
                        console.log('选择的照片',imgUrlSuf);
                        notify(e.node,'ev-send',{ value:`[${imgUrlSuf}]`, msgType:MSG_TYPE.IMG });
                    });
                });
            }
        });
    });
};

/**
 * 拍摄照片
 */
export const sendPicture = (e:any) => {
    openCamera((res) => { 
        imgResize(res,(res) => {
            uploadFile(res.base64,(imgUrlSuf:string) => {
                console.log('拍摄的照片',imgUrlSuf);
                notify(e.node,'ev-send',{ value:`[${imgUrlSuf}]`, msgType:MSG_TYPE.IMG });
            });
        });
    });
};

// 发送红包
export const sendRedEnv = (e:any) => {
    popNew('app-view-earn-redEnvelope-writeRedEnv',{ inFlag:'chat' },(res) => {
        /**
         * res:{message,rid} 留言，红包ID
         */
        if (res && res.rid) {
            notify(e.node,'ev-send',{ value:JSON.stringify(res), msgType:MSG_TYPE.REDENVELOPE });
        }
    });
};