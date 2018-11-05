import { NetEvent, getEnv } from "../../../pi_pt/event/event_server";
import { Bucket } from "../../../utils/db";
import * as CONSTANT from '../constant';
import { OnlineUsers, OnlineUsersReverseIndex } from "../db/user.s";
import { Logger } from "../../../utils/logger";

const logger = new Logger('NET_CLOSE');

//#[event=net_connect_close]
export const close_connect = (e: NetEvent) => {
    let sessionId = e.connect_id;
    let dbMgr = getEnv().getDbMgr();

    let reverseBucket = new Bucket("memory", CONSTANT.ONLINE_USERS_REVERSE_INDEX_TABLE, dbMgr);
    let bucket = new Bucket("memory", CONSTANT.ONLINE_USERS_TABLE, dbMgr);
    let reverseIndex = reverseBucket.get<number, [OnlineUsersReverseIndex]>(sessionId)[0];
    if (reverseIndex.uid !== -1) {
        logger.debug("to be closed connection session: ", reverseIndex);
        let onlineUser = new OnlineUsers();
        onlineUser.uid = reverseIndex.uid;
        onlineUser.sessionId = -1; // this uid is no longer bind to this seesinoId
        bucket.put(onlineUser.uid, onlineUser);

        logger.debug("Unbind uid: ", reverseIndex.uid, "with sessionId: ", reverseIndex.sessionId)

        let onlineUserReverse = new OnlineUsersReverseIndex();
        onlineUserReverse.sessionId = sessionId;
        onlineUserReverse.uid = -1; // this seesinoId is no longer bind to this uid
        reverseBucket.put(onlineUserReverse.sessionId, onlineUserReverse);

        logger.debug("Unbind sessionId: ", reverseIndex.sessionId, "with uid: ", reverseIndex.uid);
    }
}