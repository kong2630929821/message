import { HttpClient, HttpClientResponse } from '../../../pi_pt/rust/httpc';
import { createHttpClient, getString, getStringAsync, HttpClientBody, HttpClientOptions, postString, postStringAsync } from '../../../pi_pt/rust/pi_serv/js_httpc';

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
 * jsonrpc
 * @param url -localhost + port
 * @param param -body
 */
export const http_get = (client: HttpClient, url: string, param: JSON) => {
    console.log('!!!!!!!!!!param:', param, JSON.stringify(param));
    const body = HttpClientBody.bodyString(JSON.stringify(param));
    const result = { ok: null, err: null };
    try {
        const r = getString(client, url, body);
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

export const fetch = (input: string, init?: RequestInit): Promise<Response> => {
    const client = createHttpClient(HttpClientOptions.default());
    let method = 'Get';
    let body = null;
    if (init) {
        if (init.headers) {
            for (const key in init.headers) {
                HttpClient.addHeaderSharedHttpc(client, key, init.headers[key]);
            }
        }
        if (init.body) {
            if (typeof init.body === 'string') {
                body = HttpClientBody.bodyString(init.body);
            } else {
                throw new Error('body type error, it must is string'); // 暂时不支持body为其他类型
            }
        } else {
            body = HttpClientBody.bodyString('');
        }
        if (init.method) {
            method = init.method;
        }
        // 其他属性： TODO
    }

    // tslint:disable-next-line:promise-must-complete
    return new Promise((resolve, reject) => {
        if (method === 'GET') {
            getStringAsync(client, input , body, (r: [HttpClient, HttpClientResponse]) => {
                if (((typeof r[1] === 'string' && (<any>r[1]).endsWith('Result is Err')) || (typeof r[1].self === 'string' && (<any>r[1].self).endsWith('Result is Err')))) {
                    reject(r[1]);
                } else {
                    resolve(r[1]);
                }
            });
        } else if (method === 'POST') {
            postStringAsync(client, input , body, (r: [HttpClient, HttpClientResponse]) => {
                if (((typeof r[1] === 'string' && (<any>r[1]).endsWith('Result is Err')) || (typeof r[1].self === 'string' && (<any>r[1].self).endsWith('Result is Err')))) {
                    reject(new Response1(r[1]));
                } else {
                    resolve(new Response1(r[1]));
                }
            });
        } else {
            // tslint:disable-next-line:prefer-template
            throw new Error('fetch type not supported: ' + method);
        }
    });
};

// tslint:disable-next-line:completed-docs
export class Response1 {
    public status: number;
    public _r: HttpClientResponse;

    constructor (_r: HttpClientResponse) {
        this._r = _r;
        this.status = _r.status();
    }

    public text() {
        return this._r.text();
    }

    public json() {
        return JSON.parse(this._r.text());
    }
}
if (!self.fetch) {
    self.fetch = fetch;
}