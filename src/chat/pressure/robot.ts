import { randomInt } from '../../pi/util/math';
import * as store from '../client/app/data/store';
import { UserType } from '../client/app/logic/autologin';
import { MSG_TYPE } from '../server/data/db/message.s';
import { UserInfo } from '../server/data/db/user.s';
import { Test } from './test';
import { RandomSeedMgr } from './util/randomSeedMgr';
import { getTask } from './util/util';

declare var pi_modules;
// 机器人状态
enum RobotState {
    RUN,
    STOP
}
/**
 * 机器人模块
 */

let test: Test;
// 状态
let state: RobotState;
// 定时器
let timer: any;
// 用户信息
let userInfo: UserInfo;

// 启动
export const start = (userType: UserType, user: string, pwd: string) => {
    test = new Test();
    store.initStore();
    if (state !== RobotState.RUN) {
        // 登录
        test.login(userType, user, pwd, (r: UserInfo) => {
            userInfo = r;
            // 启动任务
            task();
        });
        console.log('robot start!!!');
    }
    state = RobotState.RUN;
};
// 停止
export const stop = () => {
    state = RobotState.STOP;
    // 清理当前定时器
    clearTimeout(timer);
};

// 加好友
export const addFind = () => {
    // 随机添加好友
    const addUser = randomInt(10001, userInfo.uid - 1).toString();
    // 判断是否是好友，不是则添加
    const friends = (store.getStore(`contactMap/${userInfo.uid}`) || { friends: [] }).friends;
    if (friends.findIndex(item => item.toString() === addUser) === -1) {
        test.addFind(addUser);
    }

};
// 邀请入群
export const inviteGroup = () => {
    // 获取当前的群
    const oldGroup = (store.getStore(`contactMap/${userInfo.uid}`) || { group: [] }).group;
    if (oldGroup.length === 0) {
        // 创建群
        test.createGroup('test');
    }
    // 判断是否超过上限
    for (const gid of oldGroup) {
        const memberids = (store.getStore(`groupInfoMap/${gid}`) || { memberids: [] }).memberids;
        if (memberids.length <= 100) {
            const friends = (store.getStore(`contactMap/${userInfo.uid}`) || { friends: [] }).friends;
            for (const find of friends) {
                if (memberids.findIndex(item => item === find) === -1) {
                    test.inviteGroup(gid, find);

                    return;
                }
            }
        }
    }
};
// 单聊
export const chat = () => {
    const friends = (store.getStore(`contactMap/${userInfo.uid}`) || { friends: [] }).friends;
    if (friends.length === 0) return;
    // 随机选择好友
    const find = friends[randomInt(0, friends.length - 1)];
    // 随机选择发送的内容 TODO
    test.chat(find, MSG_TYPE.TXT, `${userInfo.uid}:发送单聊测试`);

};
// 群聊
export const groupchat = () => {
    const groups = (store.getStore(`contactMap/${userInfo.uid}`) || { group: [] }).group;
    if (groups.length === 0) return;
    // 随机选择群
    const gid = groups[randomInt(0, groups.length - 1)];
    // 随机选择发送内容 TODO
    test.groupchat(gid, MSG_TYPE.TXT, `${gid}:群消息测试`);

};

// 任务池
export const task = () => {
    const seedMgr = new RandomSeedMgr(randomInt(1, 10000));
    // 获取任务ID
    const r = getTask(300101, seedMgr);
    console.log('获取任务ID r:', r);
    pi_modules[r.module].exports[r.func].apply(undefined, JSON.parse(r.arg));
    const sleep = 1000;
    if (state === RobotState.RUN) {
        timer = setTimeout(() => { task(); }, sleep);
    }

};
