/**
 * 会话关闭
 */
import { Env } from '../../../../pi/lang/env';
import { NetEvent } from '../../../../pi_pt/event/event_server';
import { Bucket } from '../../../utils/db';
import { Logger } from '../../../utils/logger';
import * as CONSTANT from '../constant';
import { OnlineUsersReverseIndex } from '../db/user.s';

declare var env: Env;

const logger = new Logger('NET_CLOSE');

// #[event=net_connect_close]
export const close_connect = (e: NetEvent) => {
    const sessionId = e.connect_id;

    const reverseBucket = new Bucket('memory', CONSTANT.ONLINE_USERS_REVERSE_INDEX_TABLE);
    const bucket = new Bucket('memory', CONSTANT.ONLINE_USERS_TABLE);
    const reverseIndex = reverseBucket.get<number, [OnlineUsersReverseIndex]>(sessionId)[0];
    if (reverseIndex) {
        reverseBucket.delete(reverseIndex.sessionId);
        const onlineUser = bucket.get(reverseIndex.uid)[0];
        if (onlineUser) {
            bucket.delete(reverseIndex.uid);
        }
        
        logger.debug('Unbind uid: ', reverseIndex.uid, 'with sessionId: ', reverseIndex.sessionId);
    }
};