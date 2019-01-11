/**
 * 处理配置表获取
 */
// ===================================================== 导入
import { cfgMgr } from '../../../pi/util/cfg';
import { isString } from '../../../pi/util/util';
// ===================================================== 导出
// 获取map
export const getMap = (table: string | any, key?: string | number): Map<string | number, any> | any => {
    if (!isString(table)) {
        if (key) {
            table = tableNameAddKey(table._$info.name, table._$info.notes.get('primary'));
        } else {
            table = tableNameAddKey(table._$info.name);
        }
    }
    if (!initMap.has(table)) setMap(table);
    if (!initMap.has(table)) return;
    if (key !== undefined && key !== null) return initMap.get(table).get(key);

    return initMap.get(table);
};

/**
 * 表名与主键的组合
 */
export const tableNameAddKey = (tableName: string, key?: string): string => {
    if (!tableName) return tableName;
    if (!key) return tableName;

    return `${tableName}#${key}`;
};
// ===================================================== 本地
/**
 * 深度克隆
 * @param   obj 待克隆的对象
 * @return      生成的对象
 */
export const clone = (obj) => {
    let o;
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            o = [];
            for (const v of obj) {
                o.push(clone(v));
            }
        } else if (obj instanceof Map) {
            o = new Map();
            obj.forEach((v, k) => o.set(k, clone(v)));
        } else {
            o = {};
            Object.getOwnPropertyNames(obj).map(k => o[k] = clone(obj[k]));
        }
    } else {
        o = obj;
    }

    return o;
};

// 设置map
const setMap = (key) => {
    if (cfgMgr.map.has(key)) {
        const tempMap = clone(originCfg.get(key));
        /*  const tempMap = new Map();
         for (const [k, v] of originCfg.get(key)) {
             const values = clone(v);
             for (const m in values) {
                 if (typeof values[m] === 'string' && !isNaN(values[m])) {
                     values[m] = +values[m];
                 }
             }
             tempMap.set(k, values);
         } */
        initMap.set(key, tempMap);
    }
};
// ===================================================== 立即执行
const originCfg: any = cfgMgr.map;
const initMap = new Map();
