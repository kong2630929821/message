/**
 * 一些底层操作
 */
import { popNewMessage } from '../../../../app/utils/tools';
import { AudioRecorder } from '../../../../pi/browser/audio_recorder';
import { CameraPicker } from '../../../../pi/browser/cameraPicker';
import { ImagePicker } from '../../../../pi/browser/imagePicker';
import { QRCode } from '../../../../pi/browser/qrcode';
import { WebViewManager } from '../../../../pi/browser/webview';

/**
 * 选择图片
 */
export const selectImage = (ok?, cancel?) => {
    console.log('选择图片');
    const image = new ImagePicker();
    image.init();
    image.selectFromLocal({
        success: (width, height, url) => {
            ok && ok(width, height, url);            
        },
        fail: (result) => {
            cancel && cancel(result);
        },
        useCamera: 0,
        single: 1,
        max: 1
    });    

    return image;
};

/**
 * 打开照相机
 */
export const openCamera = (ok?, cancel?) => {
    console.log('打开照相机');
    const camera = new CameraPicker();
    camera.init();
    camera.takePhoto({
        success:(res) => {
            ok && ok(res);
        },
        fail: (result) => {
            cancel && cancel(result);
        }
    });
    
    return camera;
};

/**
 * 二维码扫描
 */
export const doScanQrCode = (ok?,cancel?) => {
    const qrcode = new QRCode();
    qrcode.init();
    qrcode.scan({
        success: (res) => {
            ok && ok(res);
            console.log('scan-------------',res);
        },
        fail: (r) => {
            cancel && cancel();
            console.log(`scan fail:${r}`);
        }
    });
    qrcode.close({
        success: (r) => {
            console.log(`close result:${r}`);
        }
    });
};

/**
 * 打开新网页
 */
export const openNewActivity = (url:string,title:string= '') => {
    WebViewManager.open(title, `${url}?${Math.random()}`, title, '');
};

/**
 * 语音录制开始
 */ 
const recorder = new AudioRecorder();
export const startRadio = () => {
    recorder.start(success => {
        if (success) {
            console.log('录音开始');
        } else {
            popNewMessage('录音开始，录制失败');
        }
    });
};

/**
 * 语音录制结束
 */
export const endRadio = (cb:any) => {
    recorder.stop(data => {
        if (data) {
            cb(data);
            console.log('录音结束');
        } else {
            popNewMessage('录音结束，传送失败');
        }
    });
};

/**
 * 获取语音权限是否打开
 */
export const getPromise = (cb:any) => {
    recorder.getPromission(success => {
        if (success) {
            cb && cb();
        } else {
            popNewMessage('未打开麦克风权限');
        }
    });
};