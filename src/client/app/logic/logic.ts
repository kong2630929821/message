/**
 * 一些全局方法
 */

// =====================================导出

/**
 * 时间戳格式化 毫秒为单位
 */ 
export const timestampFormat = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

/**
 * Map转json
 */
export const map2Json = (data:Map<any,any>)  => {
    const res = {};
    data.forEach((v,k) => {
        res[k] = v;
    });

    return res;
};

/**
 * json转Map
 */
export const json2Map = (data:JSON) => {
    const res = new Map();
    for (const i in data) {
        res.set(i,data[i]);
    }

    return res;
};