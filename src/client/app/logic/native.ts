import { ImagePicker } from '../../../pi/browser/imagePicker';
import { QRCode } from '../../../pi/browser/qrcode';
import { DeviceIdProvider } from '../../../pi/browser/systemInfoProvider';
import { WebViewManager } from '../../../pi/browser/webview';

/**
 * 一些底层操作
 */

export const selectImage = (ok?,cancel?) => {
    console.log('选择图片');
    const image = new ImagePicker();
    image.init();
    image.selectFromLocal({
        success: (width, height, result) => {
            ok && ok(width, height, result);            
        },
        fail: (result) => {
            cancel && cancel(result);
        },
        useCamera: 1,
        single: 1,
        max: 1
    });    
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
