import { getFriendHistory } from '../client/app/data/initStore';
import * as store from '../client/app/data/store';
import { AutoLoginMgr, UserType } from '../client/app/logic/autologin';
import * as net_init from '../client/app/net/init';
import { acceptFriend, applyFriend } from '../client/app/net/rpc';
import { DEFAULT_ERROR_STR } from '../server/data/constant';
import { GroupInfo } from '../server/data/db/group.s';
import { GroupHistory, MSG_TYPE, UserHistory } from '../server/data/db/message.s';
import { Contact, UserInfo } from '../server/data/db/user.s';
import { login } from '../server/data/rpc/basic.p';
import { Result } from '../server/data/rpc/basic.s';
import { agreeJoinGroup, createGroup, inviteUsers } from '../server/data/rpc/group.p';
import { GroupAgree, GroupCreate, Invite, InviteArray } from '../server/data/rpc/group.s';
import { sendGroupMessage, sendUserMessage } from '../server/data/rpc/message.p';
import { GroupSend, SendMsg, UserSend } from '../server/data/rpc/message.s';
import { changeUserInfo } from '../server/data/rpc/user.p';
// import * as pre_init from './robot_init';

/**
 * 测试用例
 */
export class Test {
    // 接口调用相应时间
    public response: Map<string, number[]>;
    constructor() {
        this.response = new Map();
    }

    // 登录
    public login(userType: UserType, user: string, pwd: string, cb: (r: UserInfo) => void) {
        const nowTime = (new Date()).getDate();
        net_init.login(userType, user, pwd, (r: UserInfo) => {
            if (r && r.uid > 0) {
                const time = (new Date()).getDate() - nowTime;
                // 记录调用时间
                responseTime(this, login, time);
                store.setStore(`uid`, r.uid);
                store.setStore(`userInfoMap/${r.uid}`, r);
                net_init.init(r.uid);
                net_init.subscribe(r.uid.toString(), SendMsg, (v: SendMsg) => {
                    if (v.code === 1) {
                        getFriendHistory(v.rid);
                    }
                });
                // 设置用户基础信息
                if (r.name === '') {
                    r.name = user;
                    r.tel = r.uid.toString();
                    net_init.clientRpcFunc(changeUserInfo, r, (res) => {
                        if (res && res.uid > 0) {
                            store.setStore(`userInfoMap/${r.uid}`, r);

                        }
                    });
                }

                // 自动接受好友申请
                this.accept();
                cb(r);
            }

        });
    }

    // 添加好友
    public addFind(user: string) {
        applyFriend(user, (r: Result) => {
            if (r.r === 0) {
                console.log('error!!!!!!!!!!!!已经是好友');

                return;
            } else if (r.r === -2) {
                console.log('error!!!!!!!!!!!添加的好友不存在');

                return;
            }
        });
    }
    // 自动接受对方为好友和入群
    public accept() {
        store.register('contactMap', (r: Map<number, Contact>) => {
            const uid = store.getStore(`uid`);
            for (const value of r.values()) {
                for (const rid of value.applyUser) {
                    acceptFriend(rid, true, (r: Result) => {
                        if (r.r === 1) {
                            console.log('同意添加好友成功');
                        } else {
                            console.log('同意添加好友失败', r.r);
                        }
                    });
                }
                for (const guid of value.applyGroup) {
                    const agree = new GroupAgree();
                    agree.agree = true;
                    const gid = parseInt(guid.split(':')[0], 10);
                    agree.gid = gid;
                    agree.uid = uid;
                    net_init.clientRpcFunc(agreeJoinGroup, agree, (gInfo: GroupInfo) => {
                        if (gInfo.gid < 0) {

                            return;
                        }
                        console.log('同意加群！！！！！', gid);
                        store.setStore(`groupInfoMap/${gInfo.gid}`, gInfo);
                    });
                }

            }
        });
    }
    // 单聊
    public chat(rid: number, mtype: MSG_TYPE, msg: string) {
        const info = new UserSend();
        info.msg = msg;
        info.mtype = mtype;
        info.rid = rid;
        info.time = (new Date()).getTime();
        net_init.clientRpcFunc(sendUserMessage, info, (r: UserHistory) => {
            if (r.hIncId === DEFAULT_ERROR_STR) {
                console.log('对方不是你的好友！');

                return;
            }
        });
    }

    // 邀请加入群聊
    public inviteGroup(gid: number, rid: number) {
        const invites = new InviteArray();
        invites.arr = [];
        const invite = new Invite();
        invite.gid = gid;
        invite.rid = rid;
        invites.arr.push(invite);
        net_init.clientRpcFunc(inviteUsers, invites, (r: Result) => {
            if (r.r !== 1) {
                console.log('邀请好友失败');
            }
            console.log('邀请好友成功');
        });
    }

    // 创建群聊
    public createGroup(name: string) {
        const groupInfo = new GroupCreate();
        groupInfo.name = name;
        groupInfo.note = '';
        net_init.clientRpcFunc(createGroup, groupInfo, (r: GroupInfo) => {
            if (r.gid === -1) {
                console.log('创建群组失败 r:', r);

                return;
            }
            console.log('创建群组成功r:', r);
            store.setStore(`groupInfoMap/${r.gid}`, r);
        });
    }

    // 群聊
    public groupchat(gid: number, mtype: MSG_TYPE, msg: string) {
        const message = new GroupSend();
        message.gid = gid;
        message.msg = msg;
        message.mtype = mtype;
        message.time = (new Date()).getTime();
        net_init.clientRpcFunc(sendGroupMessage, message, (r: GroupHistory) => {

            if (r.hIncId === DEFAULT_ERROR_STR) {
                console.log('群聊发送失败r:', r);

                return;
            }
        });
    }
}

const responseTime = (test: Test, cmd: string, time: number) => {
    const response = test.response.get(cmd);
    if (!response) {
        test.response.set(cmd, [time]);
    } else {
        response.push(time);
        test.response.set(cmd, response);
    }
};
