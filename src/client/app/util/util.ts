/**
 * 一些通用方法
 */

// ================================================ 导出

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