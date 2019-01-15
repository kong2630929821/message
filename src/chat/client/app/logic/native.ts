/**
 * 一些底层操作
 */
import { AudioRecorder } from '../../../../pi/browser/audio_recorder';
import { CameraPicker } from '../../../../pi/browser/cameraPicker';
import { ImagePicker } from '../../../../pi/browser/imagePicker';
import { QRCode } from '../../../../pi/browser/qrcode';
import { DeviceIdProvider } from '../../../../pi/browser/systemInfoProvider';
import { WebViewManager } from '../../../../pi/browser/webview';
import { bottomNotice } from './logic';

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
 * 获取设备信息
 */
export const getDeviceId = (okCB?,errCB?) => {
    const systemInfo = new DeviceIdProvider();
    systemInfo.init();
    systemInfo.getDriverId({
        success: (result) => {
            console.log(`获取设备的唯一id成功\t ${result}`);
            okCB && okCB(result);
        }
        , fail: (result) => {
            console.log(`获取设备的唯一id失败\t  ${result}`);
            errCB && errCB(result);
        }
    });
};

/**
 * 语音录制开始
 */ 
const recorder = new AudioRecorder();
const audioContext = new AudioContext();
export const startRadio = () => {
    recorder.start(success => {
        if (success) {
            console.log('录音开始');
        } else {
            bottomNotice('录音开始，录制失败');
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
            bottomNotice('录音结束，传送失败');
        }
    });
};

/**
 * 播放语音
 */
export const playRadio = (data:any,cb:any) => {
    if (!data) {
        alert('无录音数据');

        return;
    }
    const size = data.byteLength;
    audioContext.decodeAudioData(data).then(data => {
        console.log(`播放数据：${data}, length = ${size}`);
        const source = audioContext.createBufferSource(); 
        source.buffer = data;
        source.loop = false; 
        source.connect(audioContext.destination); 
        source.start();
    });
};