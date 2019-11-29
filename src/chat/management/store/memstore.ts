import { HandlerMap } from '../../../pi/util/event';
import { getFile, initFileStore, writeFile } from '../../client/app/data/lcstore';
import { ListItem } from '../view/page/application/thirdApplication';

/**
 * 判断是否是对象
 */
const isObject = (value: any) => {
    const vtype = typeof value;

    return value !== null && (vtype === 'object' || vtype === 'function');
};

/**
 * 数据深拷贝
 */
export const deepCopy = (v: any): any => {
    if (!v || v instanceof Promise || !isObject(v)) return v;
    if (v instanceof Map) {
        return v;  // TODO 暂不对map做处理

        // return new Map(JSON.parse(JSON.stringify(v)));
    }

    const newobj = v.constructor === Array ? [] : {};
    for (const i in v) {
        newobj[i] = isObject(v[i]) ? deepCopy(v[i]) : v[i];
    }

    return newobj;
};

/**
 * 根据路径获取数据
 */
export const getStore = (path: string, defaultValue = undefined) => {
    let ret = store;
    for (const key of path.split('/')) {
        if (key in ret) {
            ret = ret[key];
        } else {
            // 路径中有和store内部不同的键，肯定是bug
            // tslint:disable-next-line:prefer-template
            throw new Error('getStore Failed, path = ' + path);
        }
    }
    const deepRet = deepCopy(ret);

    return (typeof deepRet === 'boolean' || typeof deepRet === 'number') ? deepRet : (deepRet || defaultValue);
};

/**
 * 更新store并通知
 */
export const setStore = (path: string, data: any, notified = true) => {
    const keyArr = path.split('/');

    const notifyPath = [];
    for (let i = 0; i < keyArr.length; i++) {
        // tslint:disable-next-line:prefer-template
        const path = i === 0 ? keyArr[i] : notifyPath[i - 1] + '/' + keyArr[i];
        notifyPath.push(path);
    }
    // console.log(notifyPath);
    // 原有的最后一个键
    const lastKey = keyArr.pop();

    let parent = store;
    for (const key of keyArr) {
        if (key in parent) {
            parent = parent[key];
        } else {
            // 路径中有和store内部不同的键，肯定是bug
            // tslint:disable-next-line:prefer-template
            throw new Error('setStore Failed, path = ' + path);
        }
    }
    parent[lastKey] = deepCopy(data);

    if (notified) {
        for (let i = notifyPath.length - 1; i >= 0; i--) {
            handlerMap.notify(notifyPath[i], getStore(notifyPath[i]));
        }
    }
};

/**
 * 注册消息处理器
 */
export const register = (keyName: string, cb: Function): void => {
    handlerMap.add(keyName, <any>cb);
};

/**
 * 取消注册消息处理器
 */
export const unregister = (keyName: string, cb: Function): void => {
    handlerMap.remove(keyName, <any>cb);
};

/**
 * 消息处理列表
 */
const handlerMap: HandlerMap = new HandlerMap();

// tslint:disable-next-line:no-single-line-block-comment
/******************************store初始化**********************************/

// 海龟一号store
interface Store {
    appList:ListItem[];// 全部游戏
    hotApp:ListItem[];// 热门游戏
    recommendApp:ListItem[];// 推荐游戏
    flags:any;
    draft:ListItem[];
    uid: Number;
}
// 全局内存数据库
const store:Store = {
    appList:[],
    hotApp:[],
    recommendApp:[],
    flags:{},
    draft: [],
    uid:-1
};

const registerDataChange = () => {
    register('draft',(res) => {
        saveDraft(res); // 登陆成功后更新当前用户的历史数据
    });
    register('uid',() => {
        getDraft(); // 登陆成功后更新当前用户的历史数据
    });
};
registerDataChange();

// 保存草稿
const saveDraft = (res) => {
    const id = getStore('uid');
    writeFile(`${id}-draft`,res, () => {
        console.log('写入成功');
    });
};

// 获取存入的草稿
const getDraft = () => {
    const sid = getStore('uid');
    initFileStore().then(() => {
        if (!sid) return;
        // 获取草稿内容
        getFile(`${sid}-draft`, (value) => {
            console.log(value);
            setStore('draft',value);
        },() => {
            console.log('read lastChat error');
        });
    };
};