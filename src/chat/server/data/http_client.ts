import { HttpClient } from '../../../pi_pt/rust/httpc';
import { createHttpClient, HttpClientBody, HttpClientOptions, postString } from '../../../pi_pt/rust/pi_serv/js_httpc';

/**
 * 创建客户端
 */
export const createClient = () => {
    return createHttpClient(HttpClientOptions.default());
};

/**
 * 添加头信息
 * 'content-type':'application/json'
 */
export const addHeader = (client: HttpClient, key: string, value: string) => {
    HttpClient.addHeaderSharedHttpc(client, key, value);
};

/**
 * jsonrpc
 * @param url -localhost + port
 * @param param -body
 */
export const post = (client: HttpClient, url: string, param: JSON) => {
    console.log('!!!!!!!!!!param:', param, JSON.stringify(param));
    const body = HttpClientBody.bodyString(JSON.stringify(param));
    const result = { ok: null, err: null };
    try {
        const r = postString(client, url, body);
        if (((typeof r[1] === 'string' && (<any>r[1]).endsWith('Result is Err')) || (typeof r[1].self === 'string' && (<any>r[1].self).endsWith('Result is Err')))) {
            result.err = r[1];

            return result;
        } else {
            result.ok = r[1].text();

            return result;
        }
    } catch (e) {
        console.log('http request error:!!!!!!!!!!!!!!!!!!!', e);
        result.err = e;

        return result;
    }
};

/**
 * formdatarpc
 * @param url url
 * @param key formdata key
 * @param value formdata value
 */
export const formPost = (client: HttpClient, url: string, key:string, value:string) => {
    const body = HttpClientBody.formString(key,value);
    const result = { ok: null, err: null };
    try {
        const r = postString(client, url, body);
        if (((typeof r[1] === 'string' && (<any>r[1]).endsWith('Result is Err')) || (typeof r[1].self === 'string' && (<any>r[1].self).endsWith('Result is Err')))) {
            result.err = r[1];

            return result;
        } else {
            result.ok = r[1].text();

            return result;
        }
    } catch (e) {
        console.log('http request error:!!!!!!!!!!!!!!!!!!!', e);
        result.err = e;

        return result;
    }
};