/**
 * 只有后端可以用的util
 */
import { Bucket } from '../../utils/db';
import * as CONSTANT from './constant';
/**
 * 用于测试的时候遍历表
 * @param dbMgr db manager
 * @param tableStruct table struct
 */
export const iterTable = (tableStruct:any) => {
    const infoBucket = new Bucket(CONSTANT.WARE_NAME, tableStruct._$info.name); 
    const iter = infoBucket.iter(null, false, null);
    iter.forEach(key => {
        console.log('elBase----------------read---------------', key);
    });
};