/**
 * inputMessage 组件相关处理
 */
// ===========================导入
import { getKeyBoardHeight, popNew } from '../../../../../pi/ui/root';
import { notify } from '../../../../../pi/widget/event';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { MSG_TYPE } from '../../../../server/data/db/message.s';
import { endRadio, getPromise, openCamera, selectImage, startRadio } from '../../logic/native';
import { arrayBuffer2File, imgResize, uploadFile } from '../../net/upload';

// ===========================导出
export class InputMessage extends Widget {
    public props:Props = {
        message:'',
        isOnEmoji:false,
        isOnTools:false,
        isOnRadio:false,
        toolList:[],
        chatType:'user'
    };
    private radioTime:number;

    public setProps(props:any) {
        super.setProps(props);
        this.props.toolList = [
            { name:'拍摄',img:'tool-camera.png' },
            { name:'相册',img:'tool-pictures.png' },
            { name:'红包',img:'tool-redEnv.png' }
        ];
    }

    // 麦克风输入处理
    public radioStart(e:any) {
        getPromise(() => {
            console.log('点击开始录音');
            this.props.isOnRadio = true;
            this.radioTime = Date.now();
            this.paint();
            startRadio();
                // 超过60秒自动停止录音
            setTimeout(() => {
                if (this.props.isOnRadio) {
                    this.radioEnd(e);
                }
            }, 59000);
        });
    }

    // 语音录入完成
    public radioEnd(e:any) {
        console.log('释放结束录音');
        this.props.isOnRadio = false;
        this.paint();
        endRadio((buffer) => {
            uploadFile(arrayBuffer2File(buffer),(radioUrl:string) => {
                console.log('录制的音频',radioUrl);
                const t = Date.now() - this.radioTime;
                const res = {
                    message:radioUrl,
                    time:Math.ceil(t / 1000)
                };
                notify(e.node,'ev-send',{ value:JSON.stringify(res), msgType:MSG_TYPE.VOICE });
            });
        });
    }

    // 打开表情包图库
    public playEmoji(e:any) {
        getRealNode(this.tree).getElementsByTagName('textarea')[0].blur();
        document.getElementById('emojiMap').style.height = `${getKeyBoardHeight()}px`;
        setTimeout(() => {
            notify(e.node,'ev-open-Emoji',{});
        }, 100);
        
    }

    // 打开更多功能
    public openTool(e:any) {
        getRealNode(this.tree).getElementsByTagName('textarea')[0].blur();
        document.getElementById('toolsMap').style.height = `${getKeyBoardHeight()}px`;
        setTimeout(() => {
            notify(e.node,'ev-open-Tools',{});
        }, 100);
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
                sendRedEnv(e,this.props.chatType);
                break;
            default:
        }
        notify(e.node,'ev-open-Tools',{});
    }

}
// ===========================本地
interface Props {
    isOnEmoji:boolean; // 是否打开表情图库
    message:string; // 消息内容
    isOnTools:boolean;  // 是否打开更多功能
    toolList:any[];  // 更多功能列表
    isOnRadio:boolean; // 是否正在录音
    chatType:string;  // 聊天类型 user|group
}

/**
 * 选择相册
 */
export const sendImage = (e:any) => {
    const imagePicker = selectImage((width, height, url) => {
        console.log('选择的图片',width,height,url);
        // 预览图片
        notify(e.node,'ev-send-before',{ value:{ compressImg:`<img src="${url}" alt="img" class='imgMsg'></img>` }, msgType:MSG_TYPE.IMG });

        imagePicker.getContent({
            quality:10,
            success(buffer:ArrayBuffer) {
                const value = {
                    compressImg:'',
                    originalImg:''
                };
                imgResize(buffer,(res) => {
                    
                    uploadFile(arrayBuffer2File(res.ab),(imgUrlSuf:string) => {
                        console.log('选择的照片压缩图',imgUrlSuf);
                        value.compressImg = imgUrlSuf;
        
                        // 压缩图上传成功后再获取一次原图
                        imagePicker.getContent({
                            quality:100,
                            success(buffer1:ArrayBuffer) {
                                uploadFile(arrayBuffer2File(buffer1),(imgUrlSuf1:string) => {
                                    console.log('选择的照片原图',imgUrlSuf1);
                                    value.originalImg = imgUrlSuf1;
                                    notify(e.node,'ev-send',{ value: JSON.stringify(value), msgType:MSG_TYPE.IMG });
                                });
                            }
                        });
        
                    });
                },400);
                    
            }
        });
    });

};

/**
 * 拍摄照片
 */
export const sendPicture = (e:any) => {
    const camera = openCamera((res) => {
        console.log('拍摄的图片',res);
        // 预览图片
        notify(e.node,'ev-send-before',{ value:{ compressImg:`<img src="${res}" alt="img" class='imgMsg'></img>` }, msgType:MSG_TYPE.IMG }); 
 
        camera.getContent({
            quality:10,
            success(buffer:ArrayBuffer) {
                const value = {
                    compressImg:'',
                    originalImg:''
                };
                imgResize(buffer,(res) => {
                   
                    uploadFile(arrayBuffer2File(res.ab),(imgUrlSuf:string) => {
                        console.log('拍摄的照片压缩图',imgUrlSuf);
                        value.compressImg = imgUrlSuf;
        
                        // 压缩图上传成功后再获取一次原图
                        camera.getContent({
                            quality:100,
                            success(buffer1:ArrayBuffer) {
                                uploadFile(arrayBuffer2File(buffer1),(imgUrlSuf1:string) => {
                                    console.log('拍摄的照片原图',imgUrlSuf1);
                                    value.originalImg = imgUrlSuf1;
                                    notify(e.node,'ev-send',{ value: JSON.stringify(value), msgType:MSG_TYPE.IMG });
                                });
                            }
                        });
        
                    });
                },400);
                
            }
        });
    });

};

// 发送红包
export const sendRedEnv = (e:any,chatType:string) => {
    popNew('app-view-earn-redEnvelope-writeRedEnv',{ inFlag:`chat_${chatType}` },(res) => {
        /**
         * res:{message,rid} 留言，红包ID
         */
        if (res && res.rid) {
            notify(e.node,'ev-send',{ value:JSON.stringify(res), msgType:MSG_TYPE.REDENVELOPE });
        }
    });
};