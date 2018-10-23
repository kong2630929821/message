/**
 * 数据存储
 */

 // ============================================ 导入
 import { HandlerMap } from '../../../pi/util/event';
 import { depCopy } from "../util/util";

// ============================================ 导出

/**
 * 查找特定的值
 * @param keyName 
 * @param id 
 */
export const find = (keyName: KeyName, id?: number | string): any => {
    if (!id) {
        const value = store[keyName];
        if (!(value instanceof Map)) {
            return value instanceof Object ? depCopy(value) : value;
        }
        const arr = [];
        for (const [, v] of value) {
            arr.push(v);
        }

        return depCopy(arr);
    }
    const value = store[keyName].get(id);
    if (value instanceof Map) {
        const result = value.get(id);

        return result && depCopy(result);
    } else {
        return value && depCopy(value);
    }
};

/**
 * 获取原始数据
 * @param keyname 
 */
export const getBorn = (keyname) => {
    return store[keyname];
};

/**
 * 更新store
 * @param keyName 
 * @param data 
 * @param notified 
 */
export const updateStore = (keyName: KeyName, data: any, notified: boolean = true): void => {
    store[keyName] = data;
    if (notified) handlerMap.notify(keyName, [data]);
};

/**
 * 通知更新
 * @param keyName 
 * @param data 
 */
export const notify = (keyName: KeyName, data?: any) => {
    handlerMap.notify(keyName, [data]);
};

/**
 * 注册监听特定的数据
 * @param keyName 
 * @param cb 
 */
export const register = (keyName: KeyName, cb: Function): void => {
    handlerMap.add(keyName, <any>cb);
};

/**
 * 取消注册
 * @param keyName 
 * @param cb 
 */
export const unregister = (keyName: KeyName, cb: Function): void => {
    handlerMap.remove(keyName, <any>cb);
};

/**
 * store初始化
 */
export const initStore = () => {

}

/**
 * Store的声明
 */
export interface Store {

}

// ============================================ 本地

// 本质上是主键
type KeyName = 'user';

const store = <Store>{
    
}

// ============================================ 可执行
const handlerMap: HandlerMap = new HandlerMap();