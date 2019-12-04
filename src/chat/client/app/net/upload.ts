import { uploadFileUrl } from '../../../../app/public/config';
import { resize } from '../../../../pi/widget/resize/resize';

/**
 * uploadFile to server
 * @param file file
 */
export const uploadFile = async (file, successCb?:(imgUrlSuf:string) => void,faileCb?:(err:any) => void) => {
    const formData = new FormData();
    formData.append('upload',file);
    
    return fetch(`${uploadFileUrl}?$forceServer=1`, {
        body: formData, // must match 'Content-Type' header
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers:{},   //
        mode: 'cors' // no-cors, cors, *same-origin
    }).then(res => {
        res.json().then(r => {
            console.log('uploadFile success ',r);
            if (r.result === 1) {
                successCb && successCb(r.sid);
            }
        });
        
    }).catch(err => {
        console.log('uploadFile fail ',err);            
        faileCb && faileCb(err);
    });
};

/**
 * arrayBuffer转file格式
 */
export const arrayBuffer2File = (buffer:ArrayBuffer) => {
    const u8Arr = new Uint8Array(buffer);
    const blob = new Blob([u8Arr], { type: 'image/jpeg' });
    const newFile = new File([blob], 'avatar.jpeg', { type: blob.type });
    console.log('arrayBuffer2File = ',newFile);

    return newFile;
};

/**
 * arrayBuffer图片压缩
 * @param buffer 图片arraybuffer
 */
export const imgResize = (buffer:ArrayBuffer,ratio:any = 0.3,wid:number= 200,callback:Function) => {
    const file = arrayBuffer2File(buffer);
    const fr = new FileReader();
    fr.readAsDataURL(file); 
    fr.onload = () => { 
        const dataUrl = fr.result.toString();  
        resize({ url: dataUrl, width: wid, ratio, type: 'jpeg' }, (res) => {
            console.log('resize---------', res);
            callback(res);
        });
    };
    
};

/**
 * 图片base64转file格式
 */
export const base64ToFile = (base64: string) => {
    const blob = base64ToBlob(base64);
    const newFile = new File([blob], 'avatar.jpeg', { type: blob.type });
    console.log(newFile);

    return newFile;
};

/**
 * base64 to blob
 */
export const base64ToBlob = (base64: string) => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
};