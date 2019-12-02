/**
 * RPC， 远程方法调用
 * 采用 mqtt上定义的每会话的$req和$resp主题，来发送请求和接受响应
 * 建立网络响应客户端的
 */

// ================================================ 导入
import { getStoreData } from '../../../../app/api/walletApi';
import { sourceIp } from '../../../../app/public/config';
import { getStore } from '../../../../app/store/memstore';
import { piFetch } from '../../../../app/utils/pureUtils';
// tslint:disable-next-line:no-duplicate-imports
import { popNewMessage } from '../../../../app/utils/pureUtils';
import { deepCopy } from '../../../../pi/util/util';
import { UserInfo } from '../../../server/data/db/user.s';
import { SendMsg } from '../../../server/data/rpc/message.s';
import { changeUserInfo } from '../../../server/data/rpc/user.p';
import { UserChangeInfo } from '../../../server/data/rpc/user.s';
import { setLocalStorage } from '../data/lcstore';
import * as store from '../data/store';
import { UserType } from '../logic/autologin';
import { deelNotice } from '../logic/logic';
import * as init2 from './init';
import { getAllGameInfo, getAllGameList, getChatUid, getFriendHistory, getLaudPost, getMyPublicNum, getSetting, showPost } from './rpc';

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
        init2.login(UserType.WALLET, openId, 'sign', async (r: UserInfo) => {

            if (r && r.uid > 0) {
                console.log('聊天登陆成功！！！！！！！！！！！！！！',r);
                store.setStore(`uid`, r.uid);
                const user = await getStoreData('user');
                r.acc_id = user.acc_id;
                store.setStore(`userInfoMap/${r.uid}`, r);
                store.setStore('isLogin',true);
                getSetting();   // 获取设置信息
                getLaudPost();  // 获取赞过帖子列表

                const square = getStore('flags',{}).nowSquareType || { squareType:1,label:'' };
                showPost(square.squareType, square.label); // 获取最新帖子
                init2.init(r.uid,r.comm_num);
                
                init2.subscribe(`${r.uid}_sendMsg`, SendMsg, (v: SendMsg) => {
                    if (v.code === 1) {
                        getFriendHistory(v.rid, v.gid);
                    }
                });
                getMyPublicNum().then((r:string) => {
                    store.setStore('pubNum',r);
                });
                // 设置用户信息
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
                // 获取邀请人数 被邀请
                const invite = getStore('inviteUsers/invite_success',[]);
                const beInvited = getStore('inviteUsers/convert_invite',[]);
                invite.length && deelNotice(invite,store.GENERATORTYPE.NOTICE_1);
                beInvited.length && deelNotice([beInvited],store.GENERATORTYPE.NOTICE_2);
                // // 获取全部游戏
                getAllGameList().then(r => {
                    if (r.length) {
                        const appId = JSON.stringify(r);
                        getAllGameInfo(appId).then(r => {
                            console.log('获取全部游戏',r);
                            store.setStore('gameList',r);
                            const tagList = deepCopy(store.tagListStore);
                            r.forEach(v => {
                                tagList.push(v.title);
                            });
                            store.setStore('tagList',tagList);
                        });
                    }
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
export const  setUserInfo = async () => {
    const user = await getStoreData('user',{ info:{} });
    const r = new UserChangeInfo();
    r.note = user.info.note || '';
    r.sex = user.info.sex || 2;
    r.name = user.info.nickName || '';
    r.avatar = user.info.avatar || '';
    r.tel = user.info.phoneNumber || '';
    r.acc_id = user.acc_id || '';
    r.wallet_addr = '';
    const uid = store.getStore('uid');
    if (!uid) {
        return;
    }
    init2.clientRpcFunc(changeUserInfo, r, async (res) => {
        console.log('setUserInfo ',res);

        if (res && res.uid > 0) {
            const user = await getStoreData('user');
            res.acc_id = user.acc_id;
            store.setStore(`userInfoMap/${uid}`, res);
        } else if (res.uid === 0) {  // 普通用户 钱包名称中含有 “好嗨客服”
            const chatUser = store.getStore(`userInfoMap/${uid}`,{ name:'' });
            if (chatUser.name) {  // 有曾用名，直接改为曾用名
                // changeWalletName(chatUser.name);

            } else { // 新创建的钱包
                // changeWalletName(playerName()); // 随机设置一个新名字
                setUserInfo(); // 重新注册一次聊天
            }
        } else {
            popNewMessage('修改个人信息失败');
            
        }
    });
};

/**
 * 获取官方客服等配置信息
 */
export const getOfficial = () => {
    const url = `http://${sourceIp}/appversion/official_service.json?${Math.random()}`;

    return piFetch(url).catch();
};