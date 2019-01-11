/**
 * RPC， 远程方法调用
 * 采用 mqtt上定义的每会话的$req和$resp主题，来发送请求和接受响应
 * 建立网络响应客户端的
 */

// ================================================ 导入
import { getOpenId } from '../../../../../app/api/JSAPI';
import * as walletStore from '../../../../../app/store/memstore';
import { UserInfo } from '../../../server/data/db/user.s';
import { SendMsg } from '../../../server/data/rpc/message.s';
import { changeUserInfo } from '../../../server/data/rpc/user.p';
import { getFriendHistory } from '../data/initStore';
import * as store from '../data/store';
import { UserType } from '../logic/autologin';
import { bottomNotice } from '../logic/logic';
import * as init2 from './init';

// ================================================ 导出

/**
 * 客户端初始化
 */
export const initClient = (server?: string, port?: number) => {
    init2.initClient(server, port);
};

// ===================================登陆相关

/**
 * 钱包 登陆或注册聊天
 */
export const walletSignIn = () => {
    if (!loginChatFg) {
        getOpenId('101', (r) => {
            const openId = String(r.openid);
            if (openId) {
                init2.login(UserType.WALLET, openId, 'sign', (r: UserInfo) => {
                    console.log('聊天登陆成功！！！！！！！！！！！！！！');
                    loginChatFg = false;

                    if (r && r.uid > 0) {
                        store.setStore(`uid`, r.uid);
                        store.setStore(`userInfoMap/${r.uid}`, r);
                        init2.init(r.uid);
                        init2.subscribe(r.uid.toString(), SendMsg, (v: SendMsg) => {
                            if (v.code === 1) {
                                getFriendHistory(v.rid);
                            }
                            // updateUserMessage(v.msg.sid, v);
                        });

                        const user = walletStore.getStore('user/info');
                        const walletAddr = walletStore.getStore('user/id');
                        if (r.name !== user.nickName || r.avatar !== user.avatar) {
                            r.name = user.nickName;
                            r.avatar = user.avatar;
                            r.tel = user.phoneNumber;
                            r.wallet_addr = walletAddr;
                            init2.clientRpcFunc(changeUserInfo, r, (res) => {
                                if (res && res.uid > 0) {
                                    store.setStore(`userInfoMap/${r.uid}`, r);

                                }
                            });
                        }
                    } else {
                        bottomNotice('钱包登陆失败');
                    }
                });
            }
        });
    }
    loginChatFg = true;

};

// 登陆聊天方法执行标记
let loginChatFg: boolean;

walletStore.register('user/isLogin', (r) => {
    if (r) {  // 如果钱包登陆成功，登陆聊天
        walletSignIn();
    }
});