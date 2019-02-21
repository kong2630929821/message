/**
 * 登录 登出
 */
import { loginWallet, logoutWallet } from '../../../../app/net/login';
import * as store from '../data/store';
import { disconnect, initClient } from './init';

// 登录
loginWallet('101',(openId:number) => {
    console.log('获取到openId ====',openId);
    initClient(openId);
});

// 登出
logoutWallet(() => {
    disconnect();
    store.initStore();
});