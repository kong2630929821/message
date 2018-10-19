import { callRemoteRpc, subscribeChannel } from './client_stub';
import { sendMessage as sendMessageRequest, messageReceivedAck } from '../../server/rpc/send_message.s';
import { sendMessage as sMessage } from '../../server/rpc/send_message.p';
import { userLogin as userLoginRequest, userLoginResponse } from '../../server/rpc/user_login.s';
// import { BonBuffer } from "../../pi/util/bon";  what happend when import this file ?
import { userLogin } from '../../server/rpc/user_login.p';

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

const login = (uid: string) => {
    let user = new userLoginRequest();
    user.uid = uid;
    user.passwdHash = '0xFFFFFFFFFF';

    callRemoteRpc(userLogin, user, userLoginResponse, (r) => {
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