/**
 * 登录 登出
 */
import { logoutWallet } from '../../../../app/net/login';
import { getOpenId } from '../../../../app/net/pull';
import * as store from '../data/store';
import { disconnect, initClient } from './init';

// // 登录
// loginWallet('10',(openId:number) => {
//     console.log('获取到openId ====',openId);
//     initClient(openId);
// });

export const chatLogin = (cb?) => {
    getOpenId('10').then(r => {
        console.log('聊天注册成功',r);
        initClient(r.openId);
    });
    // (<any>window).pi_sdk.api.authorize({ appId:'10' },(err, result) => {
    //     console.log('authorize',err,JSON.stringify(result));
    //     if (err === 0) { // 网络未连接
    //         console.log('网络未连接');
    //     } else {
    //         console.log('聊天注册成功',result);
           
    //     }
    //     cb && cb();
    // });
};

// 登出
logoutWallet(() => {
    disconnect();
    store.initStore();
    store.setStore('flags/logout',true);
});