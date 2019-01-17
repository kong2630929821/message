import { uploadFileUrl } from '../../../../app/config';
import { resize } from '../../../../pi/widget/resize/resize';

/**
 * uploadFile to server
 * @param file file
 */
export const uploadFile = async (file, successCb?:(imgUrlSuf:string) => void,faileCb?:(err:any) => void) => {
    const formData = new FormData();
    formData.append('upload',file);
    fetch(`${uploadFileUrl}?$forceServer=1`, {
        body: formData, // must match 'Content-Type' header
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors' // no-cors, cors, *same-origin
    }).then(response => response.json())
        .then(res => {
            console.log('uploadFile success ',res);
            if (res.result === 1) {
                successCb && successCb(res.sid);
            }
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
export const imgResize = (buffer:ArrayBuffer,callback:Function) => {
    const file = arrayBuffer2File(buffer);
    const fr = new FileReader();
    fr.readAsDataURL(file); 
    fr.onload = () => { 
        const dataUrl = fr.result.toString();  
        resize({ url: dataUrl, width: 200, ratio: 0.3, type: 'jpeg' }, (res) => {
            console.log('resize---------', res);
            callback(res);
        });
    };
    
};