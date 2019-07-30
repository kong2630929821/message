/**
 * 登录 登出
 */
import { loginWallet, logoutWallet } from '../../../../app/viewLogic/login';
import * as store from '../data/store';
import { disconnect, initClient } from './init';

// 登录
loginWallet('10',(openId:number) => {
    console.log('获取到openId ====',openId);
    initClient(openId);
});

// 登出
logoutWallet(() => {
    disconnect();
    store.initStore();
    store.setStore('flags/logout',true);
});