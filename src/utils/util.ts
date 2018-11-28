/**
 * 一些通用方法
 */

 // ================================================================= 导入
import { BonBuffer } from '../pi/util/bon';
import { ab2hex } from '../pi/util/util';
// ================================================================= 导出

/**
 * 是否是空字符串
 * @param str string
 */
export const notEmptyString = (str: String) => {
    if (str === undefined || str === null || str === '') {
        return false;
    }

    return true;
};

/**
 * 深拷贝
 * @param v value
 */
export const depCopy = (v: any): any => {
    return JSON.parse(JSON.stringify(v));
};

/**
 * 转换为bonBuffer
 * @param key key
 */
export const toBonBuffer = (key: any) => {
    return ab2hex(new BonBuffer().write(key).getBuffer());
};

/**
 * tpl不支持map所以需要将map转换为array
 */
export const map2Arr = (m:Map<any,any>) => {
    const arr = [];
    for (const [, v] of m) {
        arr.push(v);
    }

    return depCopy(arr);
};

/**
 * 通过user生成hid
 * @param sid sender id
 * @param rid reader id
 */
export const genUserHid = (sid:number, rid:number):string => {

    return (sid > rid) ? `u${rid}${sid}` :`u${sid}${rid}`;
};

/**
 * 通过groupid生成hid
 * @param gid group id
 */
export const genGroupHid = (gid:number):string => {

    return `g${gid}`; 
};

/**
 * generate the uuid
 * @param sid sender id
 * @param rid reader id
 */
export const genUuid = (sid:number, rid:number) : string => {
    
    return `${sid}:${rid}`;
};

/**
 * generate the history increament id
 * @param hid history id
 * @param index index 
 */
export const genHIncId = (hid:string, index:number) :string => {

    return `${hid}:${index}`;
};

/**
 * generate new id from the old one
 * @param oldId old id
 */

export const genNewIdFromOld = (oldId: number):number => {
    
    return oldId + 1;
};

/**
 * generat group user id
 * @param group id 
 * @param user id
 */
export const genGuid = (gid:number, uid:number) : string => {
    
    return `${gid}:${uid}`;
};

/**
 * generate announcement increament id
 * @param gid group id 
 * @param index  index
 */
export const genAnnounceIncId = (gid:number, index:number):string => {

    return `${gid}:${index}`;
};

/**
 * 删除value
 * @param value value
 * @param arr array
 */
export const delValueFromArray = (value: any, arr: any[]) => {
    return arr.filter((ele) => {
        return ele !== value;
    });
};

/**
 * history message id
 * @param gid group id
 */
export const genHidFromGid = (gid:number):string => {
    
    return `${gid}`;
};

/**
 * generate next index
 * @param index index
 */
export const genNextMessageIndex = (index:number):number => {
    
    return index + 1;
};