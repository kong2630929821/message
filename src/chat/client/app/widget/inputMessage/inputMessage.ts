/**
 * inputMessage 组件相关处理
 */
// ===========================导入
import { popNewMessage } from '../../../../../app/utils/tools';
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
        isOnAudio:false,
        recordAudio:false,
        toolList:[
            { name:'拍摄',img:'tool-camera.png' },
            { name:'相册',img:'tool-pictures.png' },
            { name:'红包',img:'tool-redEnv.png' }
        ],
        chatType:'user',
        istyle:[0,0],
        audioText:'按住说话(30S)'
        
    };
    private audioCount:number;   // 录音倒计数
    private interval:any;    // 录音倒计时循环事件
    private touchStartY:number;   // 点击位置
    private touchMoveY:number;   // 移动位置
    private cancelRecord:boolean;  // 是否取消录音

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    // 麦克风输入处理
    public audioStart(e:any) {
        console.log('点击开始录音');
        this.touchStartY = e.changedTouches[0].screenY;
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.props.recordAudio = true;
        this.paint();

        // ===================测试代码============================//
        // this.audioCount = 0;   // 计数到30
        // this.props.audioText = `上滑取消(0S)`;
        // this.paint();
        // const list = getWidth(15,80);
        // this.interval = setInterval(() => {
        //     this.audioCount++;
        //     let r1 = 0;
        //     let r2 = 0;
        //     if (this.audioCount < 15) {
        //         r1 = list[this.audioCount];
        //     } else {
        //         r1 = 160;
        //         r2 = list[this.audioCount - 15];
        //     }
        //     this.props.istyle = [r1,r2];
        //     this.props.audioText = `上滑取消(${this.audioCount}S)`;
        //     this.paint();

        //     if (this.audioCount >= 30) {  // 超过30秒自动停止录音
        //         clearInterval(this.interval);
        //         if (this.props.recordAudio) {
        //             this.audioEnd(e);
        //         }
        //     }
        // },1000);

        // ======================正式代码===========================//
        getPromise(() => {
            console.log('点击开始录音');
            startRadio(() => {
                this.props.recordAudio = true;
                this.audioCount = 0;   // 计数到30
                this.props.audioText = `上滑取消(0S)`;
                this.paint();

                const list = getWidth(15,80);
                this.interval = setInterval(() => {
                    this.audioCount++;
                    let r1 = 0;
                    let r2 = 0;
                    if (this.audioCount < 15) {
                        r1 = list[this.audioCount];
                    } else {
                        r1 = 160;
                        r2 = list[this.audioCount - 15];
                    }
                    this.props.istyle = [r1,r2];
                    this.props.audioText = `上滑取消(${this.audioCount}S)`;
                    this.paint();

                    if (this.audioCount >= 30) {  // 超过30秒自动停止录音
                        clearInterval(this.interval);
                        if (this.props.recordAudio) {
                            this.audioEnd(e);
                        }
                    }
                },1000);

            });
            
        });
    }

    // 语音录入完成
    public audioEnd(e:any) {
        console.log('释放结束录音');
        this.props.recordAudio = false;
        this.props.istyle = [0,0];
        this.props.audioText = `按住说话(30S)`;
        this.paint();
        if (this.interval) {
            clearInterval(this.interval);
        }
        if (this.cancelRecord) {
            popNewMessage('取消录音');
            endRadio(null);

            return;
        }

        endRadio((buffer) => {
            if (this.audioCount) {  // 录音大于1秒才上传
                uploadFile(arrayBuffer2File(buffer),(audioUrl:string) => {
                    console.log('录制的音频',audioUrl);
                    const res = {
                        message:audioUrl,
                        time:this.audioCount
                    };
                    notify(e.node,'ev-send',{ value:JSON.stringify(res), msgType:MSG_TYPE.VOICE });

                });
            } else {
                popNewMessage('录音太短');
            }
        });
    }

    // 取消语音录音
    public audioStop(e:any) {
        this.touchMoveY = e.changedTouches[0].screenY;
        if (this.touchStartY - this.touchMoveY > 80) {  // 上滑
            this.cancelRecord = true;
            console.log('取消录音');
        } else {
            this.cancelRecord = false;
            console.log('继续录音');
        }
    }

    // 打开表情包图库
    public openEmoji(e:any) {
        getRealNode(this.tree).getElementsByTagName('textarea')[0].blur();
        document.getElementById('emojiMap').style.height = `${getKeyBoardHeight()}px`;
        setTimeout(() => {
            notify(e.node,'ev-open-Emoji',{});
        }, 100);
        // 更换图标样式
        this.props.isOnEmoji = !this.props.isOnEmoji;
        this.paint();
    }

    // 打开更多功能
    public openTool(e:any) {
        getRealNode(this.tree).getElementsByTagName('textarea')[0].blur();
        document.getElementById('toolsMap').style.height = `${getKeyBoardHeight()}px`;
        setTimeout(() => {
            notify(e.node,'ev-open-Tools',{});
        }, 100);
    }

    // 打开语音录入
    public openAudio(e:any) {
        this.props.isOnAudio = !this.props.isOnAudio;
        console.log(this.props.isOnAudio);
        getRealNode(this.tree).getElementsByTagName('textarea')[0].blur();
        document.getElementById('audioWrap').style.height = `${getKeyBoardHeight()}px`;
        setTimeout(() => {
            notify(e.node,'ev-open-audio',{});
        }, 100);
        this.paint();
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
    isOnAudio:boolean; // 是否打开录音界面
    chatType:string;  // 聊天类型 user|group
    recordAudio:boolean;  // 正在录入语音
    istyle:number[];   // 语音录入进度条宽度
    audioText:string;  // 语音录入提示语
    is:boolean;
}

/**
 * 选择相册
 */
export const sendImage = (e:any) => {
    const imagePicker = selectImage((width, height, url) => {
        console.log('选择的图片',width,height,url);

        imagePicker.getContent({
            quality:10,
            success(buffer:ArrayBuffer) {
                const value = {
                    compressImg:'',
                    originalImg:''
                };

                imgResize(buffer,(res) => {  // 压缩图片
                    value.compressImg = `<div style="background-image:url(${res.base64});height: 230px;width: 230px;" class="previewImg"></div>`;
                    // 预览图片
                    notify(e.node,'ev-send-before',{ msgType:MSG_TYPE.IMG, value:JSON.stringify(value) });
                    
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
                                    notify(e.node,'ev-send',{ msgType:MSG_TYPE.IMG, value:JSON.stringify(value) });
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
    const camera = openCamera((r) => {
        console.log('拍摄的图片',r);
       
        camera.getContent({
            quality:10,
            success(buffer:ArrayBuffer) {
                const value = {
                    compressImg:'',
                    originalImg:''
                };
                imgResize(buffer,(res) => {
                    value.compressImg = `<div style="background-image:url(${res.base64});height: 230px;width: 230px;" class="previewImg"></div>`;
                    // 预览图片
                    notify(e.node,'ev-send-before',{ msgType:MSG_TYPE.IMG, value:JSON.stringify(value) }); 

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
                                    notify(e.node,'ev-send',{ msgType:MSG_TYPE.IMG, value:JSON.stringify(value) });
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

/**
 * 半圆宽度等比分数组
 * @param num 份数
 * @param len 半径
 */
export const getWidth = (num:number,len:number) => {
    const list = [];
    for (let i = 0;i < num;i++) {
        list[i] = i < num / 2 ? Math.ceil(len - Math.cos(i / num * 3.14) * len) :Math.ceil(len - Math.cos(i / num * 3.14) * len);
    }

    return list;
};