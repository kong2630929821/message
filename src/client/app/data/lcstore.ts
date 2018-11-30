/**
 * 处理localStorage上的数据
 */

/**
 * 往localStorage写数据
 */
export const setLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

/**
 * 从localStorage读数据
 */
export const getLocalStorage = (key: string, defaultValue = undefined) => {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
};