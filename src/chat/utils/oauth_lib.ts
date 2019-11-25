
/**
 * 连接钱包服务器封装
 */
import { ab2hex } from '../../../pi/util/util';
import { digest, DigestAlgorithm } from '../../../pi_pt/rust/pi_crypto/digest';
import { ECDSASecp256k1 } from '../../../pi_pt/rust/pi_crypto/signature';
import { WALLET_API_ADD_APP, WALLET_API_SET_APP_CONFIG, WALLET_APPID, WALLET_SERVER_KEY, WALLET_SERVER_URL } from '../server/data/constant';
import * as http from './http_client';

// 签名
export const sign = (msg: string, privateKey: string) => {
    const secp = ECDSASecp256k1.new();
    const data = str2ab(msg);
    // 消息的sha256哈希，哈希算法可以自己选择
    const hash = digest(DigestAlgorithm.SHA256, data).asSliceU8();
    // 私钥， 32字节
    const skAb = DecodeHexStringToByteArray(privateKey);

    // 签名结果
    const sig = secp.sign(hash, skAb).asSliceU8();
    console.log('oauth_lib!!!!!!!!!!!!sign!!!!msg:', msg, 'sign:', ab2hex(sig), 'key:', privateKey);
    
    return ab2hex(sig);

};

const str2ab = (str):Uint8Array => {
    const arr = [];
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        arr[i] = str.charCodeAt(i);
    }

    console.log(arr);

    return new Uint8Array(arr);
};

// json转字符串为uri并按照字典排序
export const json_uri_sort = (json) => {
    const keys = Object.keys(json).sort();
    let msg = '';
    for (const index in keys) {
        const key = keys[index];
        if (msg === '') {
            // msg += key + '=' + json[key];
            msg = `${msg}${key}=${json[key]}`;
        } else {
            // msg += '&' + key + '=' + json[key];
            msg = `${msg}&${key}=${json[key]}`;
        }
    }

    console.log('!!!!!!!!!!!!!!!msg:', msg);

    return msg;
};

const DecodeHexStringToByteArray = (hexString:string) => {
    const result = [];
    while (hexString.length >= 2) { 
        result.push(parseInt(hexString.substring(0, 2), 16));
        hexString = hexString.substring(2, hexString.length);
    }
    
    return new Uint8Array(result);
};

// body 为json
export const oauth_send = (uri: string, body) => {
    console.log('oauth_send!!!!!!!', uri, body);
    // 增加时间戳
    body.timestamp = new Date().getTime();
    body.appid = WALLET_APPID;
    // 签名
    const signStr = sign(json_uri_sort(body), WALLET_SERVER_KEY);
    console.log('!!!!!!!!!!!!key:', WALLET_SERVER_KEY, 'sign:', signStr);
    body.sign = signStr;
    const url = `${WALLET_SERVER_URL}${uri}`;
    console.log('!!!!!!!!!url:', url);
    const client = http.createClient();
    console.log('11111111111111111111');
    http.addHeader(client, 'content-type', 'application/json');
    console.log('2222222222222222');

    return http.post(client, url, body);
};

// 添加app
export const add_app = (gid: string, name: string, imgs: string, desc: string, url: string, pk: string, mch_id: string, notify_url: string): Boolean => {
    const r = oauth_send(WALLET_API_ADD_APP, { gid, name, imgs, desc, url, pk, mch_id, notify_url });
    console.log('add_app!!!!!!!!!!!r:', JSON.stringify(r));
    if (r.ok) {
        const json = JSON.parse(r.ok);
        if (json.result === 1) {
            return true;
        } 
    }

    return false;
};

// 编辑推荐游戏
export const set_app_config = (type: number, app_ids: string): Boolean => {
    const r = oauth_send(WALLET_API_SET_APP_CONFIG, { type, app_ids });
    console.log('set_app_config!!!!!!!!!!!r:', JSON.stringify(r));
    if (r.ok) {
        const json = JSON.parse(r.ok);
        if (json.result === 1) {
            return true;
        } 
    }

    return false;
};