/**
 * 登录 登出
 */
import { getStoreData } from '../../../../app/api/walletApi';
import { logoutWallet } from '../../../../app/utils/tools';
import * as store from '../data/store';
import { disconnect, initClient } from './init';

/**
 * 登录聊天
 */
export const chatLogin = (cb?:Function) => {
    (<any>window).pi_sdk.api.authorize({ appId:'10' },async (err, result) => {
        console.log('authorize',err,JSON.stringify(result));
        initClient(result.openId);
        cb && cb();

        if (err === 0) { // 网络未连接
            console.log('网络未连接');
        } else {
            console.log('聊天注册成功',result);
        }
    });
    // getOpenId('10').then(r => {
    //     console.log('聊天注册成功',r);
    //     initClient(r.openId);
    //     cb && cb();

    // }).catch(err => {
    //     console.log('聊天注册失败',err);
    // });
};

/**
 * 判断VM中是否已经有账号
 * 有账号则执行授权，无账号则等到触发事件时执行
 */
export const checkAccount = async (cb:Function) => {    
    const conUid = await getStoreData('user/conUid','');
    if (conUid) {  // 已有账号执行授权
        chatLogin(cb);
    }

    // // 获取全部游戏 无需账号也可以获取全部游戏列表
    // getAllGameList().then(r => {
    //     if (r.length) {
    //         const appId = JSON.stringify(r);
    //         getAllGameInfo(appId).then(r => {
    //             store.setStore('gameList',r);
    //             const tagList = store.tagListStore;
    //             r.forEach(v => {
    //                 tagList.push(v.title);
    //             });
    //             store.setStore('tagList',tagList);
    //         });
    //     }
    // });
};

/**
 * 登出
 */
logoutWallet(() => {
    disconnect();
    store.initStore();
    store.setStore('flags/logout',true);
});