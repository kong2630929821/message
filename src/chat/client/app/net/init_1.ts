/**
 * RPC， 远程方法调用
 * 采用 mqtt上定义的每会话的$req和$resp主题，来发送请求和接受响应
 * 建立网络响应客户端的
 */

// ================================================ 导入
import { getOfficial } from '../../../../app/net/pull3';
import * as walletStore from '../../../../app/store/memstore';
import { changeWalletName } from '../../../../app/utils/account';
import { popNewMessage } from '../../../../app/utils/tools';
import { UserInfo } from '../../../server/data/db/user.s';
import { SendMsg } from '../../../server/data/rpc/message.s';
import { changeUserInfo } from '../../../server/data/rpc/user.p';
import { setLocalStorage } from '../data/lcstore';
import * as store from '../data/store';
import { UserType } from '../logic/autologin';
import { playerName } from '../widget/randomName/randomName';
import * as init2 from './init';
import { getChatUid, getFriendHistory, getSetting } from './rpc';

// ================================================ 导出

/**
 * 注册了所有可以rpc调用的结构体
 * @param fileMap file map
 */
export const registerRpcStruct = (fileMap) => {
    init2.registerRpcStruct(fileMap);
};

// ===================================登陆相关

/**
 * 钱包 登陆或注册聊天
 */
export const walletSignIn = (openid) => {
    const openId = String(openid);
    if (openId) {
        init2.login(UserType.WALLET, openId, 'sign', (r: UserInfo) => {

            if (r && r.uid > 0) {
                console.log('聊天登陆成功！！！！！！！！！！！！！！');
                store.setStore(`uid`, r.uid);
                store.setStore(`userInfoMap/${r.uid}`, r);
                store.setStore('isLogin',true);
                getSetting();   // 获取设置信息
                init2.init(r.uid);
                
                init2.subscribe(`${r.uid}_sendMsg`, SendMsg, (v: SendMsg) => {
                    if (v.code === 1) {
                        getFriendHistory(v.rid, v.gid);
                    }
                });
                setUserInfo();

                // 从json文件中获取
                getOfficial().then(res => {
                    console.log('!!!!!!!!!!!!!!!!!!!!getOfficial',res);
                    setLocalStorage('officialService',res);  // 官方账号等配置信息
                    getChatUid(res.HAOHAI_SERVANT).then((r:number) => {
                        getFriendHistory(r);  // 获取好嗨客服发送的离线消息
                        store.setStore('flags/HAOHAI_UID',r);  // 好嗨客服的uid
                        
                    });

                });
                
            } else {
                popNewMessage('钱包登陆失败');
            }
        });
    }

};

/**
 * 改变用户信息
 */
export const setUserInfo = () => {
    const user = walletStore.getStore('user',{ info:{}, id:'' });
    const r = new UserInfo();
    r.uid = store.getStore('uid');
    r.sex = 0;
    r.note = '';
    r.level = 0;
    r.name = user.info.nickName;
    r.avatar = user.info.avatar;
    r.tel = user.info.phoneNumber;
    r.acc_id = user.info.acc_id;
    r.wallet_addr = user.id;
    
    if (!r.uid) {
        return;
    }
    init2.clientRpcFunc(changeUserInfo, r, (res) => {
        if (res && res.uid > 0) {
            store.setStore(`userInfoMap/${r.uid}`, res);
        } else if (res.uid === 0) {  // 普通用户 钱包名称中含有 “好嗨客服”
            const chatUser = store.getStore(`userInfoMap/${r.uid}`,{ name:'' });
            if (chatUser.name) {  // 有曾用名，直接改为曾用名
                changeWalletName(chatUser.name);

            } else { // 新创建的钱包
                changeWalletName(playerName()); // 随机设置一个新名字
                setUserInfo(); // 重新注册一次聊天
            }
        } else {
            popNewMessage('修改个人信息失败');
            
        }
    });
};
