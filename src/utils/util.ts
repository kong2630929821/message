/**
 * 一些通用方法
 */

 // ================================================================= 导入
import { ab2hex } from '../pi/util/util';
import { BonBuffer } from '../pi/util/bon';
// ================================================================= 导出

/**
 * 是否是空字符串
 * @param str 
 */
export const notEmptyString = (str: String) => {
    if (str == undefined || str == null || str == "") {
        return false
    }
    return true
}

/**
 * 深拷贝
 * @param v 
 */
export const depCopy = (v: any): any => {
    return JSON.parse(JSON.stringify(v));
};

/**
 * 转换为bonBuffer
 * @param key 
 */
export const toBonBuffer = (key: any) => {
    return ab2hex(new BonBuffer().write(key).getBuffer());
}


/**
 * tpl不支持map所以需要将map转换为array
 */
export const map2Arr = (m:Map<any,any>) => {
    const arr = [];
    for (const [, v] of m) {
        arr.push(v);
    }
    return depCopy(arr);
}