import { callRemoteRpc, subscribeChannel } from './client_stub';
import { sendMessage as sendMessageRequest, messageReceivedAck } from '../../server/rpc/send_message.s';
import { sendMessage as sMessage } from '../../server/rpc/send_message.p';
import { UserRegister, GetUserInfoReq, UserArray, LoginReq, LoginReply } from '../../server/data/rpc/basic.s';
import { registerUser, getUsersInfo, login as userLogin } from '../../server/data/rpc/basic.p';
import { UserInfo } from '../../server/data/db/user.s'


const sendMessage = (uid: string, message: string) => {
    let msg = new sendMessageRequest();
    msg.src = "uid-123";
    msg.dst = uid;
    msg.msgType = 1;
    msg.msgId = 1;
    msg.payload = message;

    callRemoteRpc(sMessage, msg, messageReceivedAck, (r) => {
        console.log(r);
    })
}

const login = (uid: number, passwd: string) => {
    let loginReq = new LoginReq();
    loginReq.uid = uid;
    loginReq.passwdHash = '0xacef123';

    callRemoteRpc(userLogin, loginReq, LoginReply, (r) => {
        console.log(r);
    })
}


const registry = (userName: string) => {
    let u = new UserRegister();
    u.name = userName;
    u.passwdHash = '0xacef123';

    callRemoteRpc(registerUser, u, UserInfo, (r) => {
        console.log(r);
    })
}

const getUserInfo = (uid: number) => {
    let info = new GetUserInfoReq();
    info.uids = [uid];

    callRemoteRpc(getUsersInfo, info, UserArray, (r) => {
        console.log(r);
    })
}

// ---------------------------  console test purpose -------------------------

(<any>self).sendMessage = (channleId: string, msg: string) => {
    sendMessage(channleId, msg);
}

(<any>self).login = (uid: number, passwd: string) => {
    login(uid, passwd);
}

(<any>self).subscribe = (channleId: string) => {
    subscribeChannel(channleId);
}

(<any>self).registry = (userName: string) => {
    registry(userName);
}

(<any>self).getUserInfo = (uid: number) => {
    getUserInfo(uid);
}