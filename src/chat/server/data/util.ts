/**
 * 只有后端可以用的util
 */
import { Bucket } from '../../utils/db';
import * as CONSTANT from './constant';
import { IndexID } from './db/community.s';
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

// 获取索引ID
// 通用获取自增ID方法
export const getIndexID = (src: string, add: number):number => {
    const IndexIDBucket = new Bucket(CONSTANT.WARE_NAME, IndexID._$info.name);
    const indexID = new IndexID();
    indexID.key = src;
    IndexIDBucket.readAndWrite(indexID.key, (id: IndexID) => {
        id[0] === undefined ? (indexID.id = 1) : (indexID.id = (id[0].id + add));

        return indexID;
    });

    return indexID.id;
};