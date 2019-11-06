/**
 * 登录 登出
 */
import { getOpenId } from '../../../../app/net/pull';
import { logoutWallet } from '../../../../app/utils/tools';
import * as store from '../data/store';
import { disconnect, initClient } from './init';

// // 登录
// loginWallet('10',(openId:number) => {
//     console.log('获取到openId ====',openId);
//     initClient(openId);
// });

export const chatLogin = (cb?:Function) => {
    getOpenId('10').then(r => {
        console.log('聊天注册成功',r);
        initClient(r.openId);
        cb && cb();

    }).catch(err => {
        console.log('聊天注册失败',err);
    });
};

// 登出
logoutWallet(() => {
    disconnect();
    store.initStore();
    store.setStore('flags/logout',true);
});