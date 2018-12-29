/**
 * 会话管理
 */

// ================================================================= 导入
import { randomInt } from '../../../pi/util/math';
import { read, write } from '../../../pi_pt/db';
import { getEnv } from '../../../pi_pt/net/rpc_server';
import { Tr } from '../../../pi_pt/rust/pi_db/mgr';
import { Bucket } from '../../utils/db';
import { Logger } from '../../utils/logger';
import { Session, SessionTab } from '../data/db/session.s';
import { AutoLogin, AutoLoginResult, GetToken, Token } from './session.s';

const logger = new Logger('session');

// 自动登录
// #[rpc=rpcServer]
export const auto_login = (login: AutoLogin): AutoLoginResult => {
    const session = get_cache_session(login.uid, 'token')[0];
    const token = session ? session.value : undefined;
    const result = new AutoLoginResult();
    // tslint:disable-next-line:possible-timing-attack
    if (login.token !== token) {
        result.code = -1;

        return result;
    }
    // 更新会话状态
    replaceSession(login.uid);
    result.code = 1;

    return result;

};

// 获取token
// #[rpc=rpcServer]
export const getToken = (getToken: GetToken): Token => {
    const token2 = new Token();

    const uid = getToken.uid;
    if (!uid) {
        token2.code = -1;
        token2.token = '';

        return token2;
    }
    const token = randomInt(100000, 999999).toString();
    setSession('token', token, uid);

    token2.code = 1;
    token2.token = token;

    return token2;
};

// 设置会话属性
export const setSession = (key: string, value: string, uid?: string) => {
    const session = getEnv().getSession();
    const dbMgr = getEnv().getDbMgr();
    write(dbMgr, (tr: Tr) => {
        session.set(tr, key, value);
        logger.info('set session key:', key, 'value:', value);
    });
    if (!uid) {
        return;
    }
    // 写入会话缓存
    const session2 = new Session();
    session2.key = key;
    session2.value = value;
    const sessionTab = new Bucket('memory', SessionTab._$info.name, dbMgr);
    let sessions = sessionTab.get<string, [SessionTab]>(uid)[0];
    if (sessions) {
        for (let i = 0; i < sessions.sessions.length; i++) {
            if (sessions.sessions[i].key === key) {
                sessions.sessions[i] = session2;
                break;
            } else if (i === (sessions.sessions.length - 1)) {
                sessions.sessions.push(session2);
                break;
            }
        }
    } else {
        const sessions2 = new SessionTab();
        sessions2.id = uid;
        sessions2.sessions = [session2];
        sessions = sessions2;
    }
    sessionTab.put(uid, sessions);
};

// 获取会话属性
export const getSession = (key: string) => {
    const dbMgr = getEnv().getDbMgr();
    const session = getEnv().getSession();
    let value;
    read(dbMgr, (tr: Tr) => {
        value = session.get(tr, key);
    });

    return value;
};

// 替换会话
export const replaceSession = (uid: string) => {
    const dbMgr = getEnv().getDbMgr();
    const session = getEnv().getSession();
    const suid = get_cache_session(uid, 'uid')[0].value;
    // 验证uid
    if (uid !== suid) {
        throw new Error(`uid error uid:${uid}, suid:${suid}`);
    }
    const sessionTab = new Bucket('memory', SessionTab._$info.name, dbMgr);
    const oldSessions = sessionTab.get(uid)[0];
    if (oldSessions) {
        for (const session2 of oldSessions.sessions) {
            write(dbMgr, (tr: Tr) => {
                session.set(tr, session2.key, session2.value);
            });
        }
    }
    logger.info('replace_session set session:', oldSessions);
};

// 获取缓存中的会话
export const get_cache_session = (uid: string, key?: string): Session[] => {
    const dbMgr = getEnv().getDbMgr();
    const sessionTab = new Bucket('memory', SessionTab._$info.name, dbMgr);
    const sessions = sessionTab.get<string, [SessionTab]>(uid)[0];
    if (!sessions) {
        return [];
    }
    if (!key) {

        return sessions.sessions;
    }
    for (const s of sessions.sessions) {
        if (s.key === key) {

            return [s];
        }
    }

    return [];
};