import { callRemoteRpc, subscribeChannel } from './client_stub';
import { sendMessage as Message, messageReceivedAck } from '../../server/rpc/send_message.s';
import { userLogin, userLoginResponse } from '../../server/rpc/user_login.s';
// import { BonBuffer } from "../../pi/util/bon";  what happend when import this file ?

const sendMessage = (uid: string, message: string) => {
    let msg = new Message();
    msg.src = "uid-123";
    msg.dst = uid;
    msg.msgType = 1;
    msg.msgId = 1;
    msg.payload = message;

    callRemoteRpc(msg, messageReceivedAck, (r) => {
        console.log(r);
    })
}

const login = (uid: string) => {
    let user = new userLogin();
    user.uid = uid;
    user.passwdHash = '0xFFFFFFFFFF';

    callRemoteRpc(user, userLoginResponse, (r) => {
        console.log(r);
    });
}

// ---------------------------  console test purpose -------------------------

(<any>self).sendMessage = (channleId: string, msg: string) => {
    sendMessage(channleId, msg);
}

(<any>self).login = (userId: string) => {
    login(userId);
}

(<any>self).subscribe = (channleId: string) => {
    subscribeChannel(channleId);
}