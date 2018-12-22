/**
 * 入口文件
 */
import { Struct } from '../../pi/struct/struct_mgr';
import { BonBuffer } from '../../pi/util/bon';
import { getEnv, getNativeObj } from '../../pi_pt/init/init';
import { ServerNode } from '../../pi_pt/rust/mqtt/server';
import { DBToMqttMonitor, registerDbToMqttMonitor } from '../../pi_pt/rust/pi_serv/js_db';
import { cloneServerNode, setMqttTopic } from '../../pi_pt/rust/pi_serv/js_net';
import { Bucket } from '../utils/db';
import { ACCOUNT_GENERATOR_TABLE, GROUP_INFO_TABLE, USER_INFO_TABLE, WARE_NAME } from './data/constant';
import { GROUP_STATE } from './data/db/group.s';
import { AccountGenerator, GENERATOR_TYPE } from './data/db/user.s';

declare var pi_modules;

const ACCOUNT_START = 10000;
const dbMgr = getEnv().getDbMgr();

const init = () => {
    initAccountGenerator();
    addDbMonitor();
    initMqttTopic();
};

const initAccountGenerator = () => {
    const bkt = new Bucket('file', ACCOUNT_GENERATOR_TABLE, dbMgr);
    if (bkt.get(GENERATOR_TYPE.USER)[0] === undefined) {
        const userAccountGenerator = new AccountGenerator();
        userAccountGenerator.index = GENERATOR_TYPE.USER;
        userAccountGenerator.currentIndex = ACCOUNT_START;
        bkt.put(GENERATOR_TYPE.USER, userAccountGenerator);
    }
    if (bkt.get(GENERATOR_TYPE.GROUP)[0] === undefined) {
        const groupAccountGenerator = new AccountGenerator();
        groupAccountGenerator.index = GENERATOR_TYPE.GROUP;
        groupAccountGenerator.currentIndex = ACCOUNT_START;
        bkt.put(GENERATOR_TYPE.GROUP, groupAccountGenerator);
    }
};

// 数据库监听器， 需要初始化配置， 启动mqtt服务， rpc服务
const addDbMonitor = () => {
    const mqttServer = cloneServerNode(getNativeObj('mqttServer'));
    const buf = new BonBuffer();
    const roster = createRoster();
    console.log(roster);
    buf.writeMap(roster, (ware, value) => {
        buf.writeUtf8(ware);
        buf.writeMap(value, (tab, flag) => {
            buf.writeUtf8(tab);
            buf.writeBool(flag);
        });
    });
    const monitor = DBToMqttMonitor.new(cloneServerNode(mqttServer), buf.getBuffer());
    registerDbToMqttMonitor(dbMgr, monitor);
};

// 创建一个监听名单
const createRoster = (): Map<string, Map<string, boolean>> => {
    const map = new Map();
    for (const id in pi_modules) {
        if (pi_modules.hasOwnProperty(id) && pi_modules[id].exports) {
            for (const kk in pi_modules[id].exports) {
                const c = pi_modules[id].exports[kk];
                if (Struct.isPrototypeOf(c) && c._$info) {
                    if (c._$info.notes && c._$info.notes.get('dbMonitor')) {
                        let m = map.get(WARE_NAME);
                        if (!m) {
                            m = new Map();
                            map.set(WARE_NAME, m);
                        }
                        m.set(c._$info.name, true);
                    }
                }
            }
        }
    }

    return map;
};

const initMqttTopic = () => {
    // 注册群组主题
    const gInfoBucket = new Bucket('file', GROUP_INFO_TABLE, dbMgr);
    const gItr = gInfoBucket.iter(undefined);
    let gInfo = gItr.nextElem();
    const mqttServer = getEnv().getNativeObject<ServerNode>('mqttServer');
    while (gInfo) {
        if (gInfo[1].state === GROUP_STATE.CREATED) {
            const groupTopic = `ims/group/msg/${gInfo[1].gid}`;
            setMqttTopic(mqttServer, groupTopic, true, true);
        }
        gInfo = gItr.nextElem();
    }
};

init();
