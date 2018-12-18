/**
 * Server configuration
 */
import { cfgMgr } from '../../../pi/util/cfg';
import { HttpsCfg, MqttCfg, NetCfg, NetMgr, RpcCfg } from '../../../pi_pt/init/server_cfg.s';

const netMgr = new NetMgr('netMgr', []);
const netCfg = new NetCfg('0.0.0.0:1234', 'tcp', true, netMgr, []);
const mqttCfg = new MqttCfg(netCfg, 1024 * 1024, 500 * 1000, 'mqttServer', []);
const rpcCfg = new RpcCfg(mqttCfg, 'rpcServer', ['mqttServer']);
const httpsCfg = new HttpsCfg('0.0.0.0', 82, 5000, 10000, '../dst/');

cfgMgr.set(NetMgr._$info.name, new Map<number,any>([[0, netMgr]]));
cfgMgr.set(NetCfg._$info.name, new Map<number,any>([[0, netCfg]]));
cfgMgr.set(MqttCfg._$info.name, new Map<number,any>([[0, mqttCfg]]));
cfgMgr.set(RpcCfg._$info.name, new Map<number,any>([[0, rpcCfg]]));
cfgMgr.set(HttpsCfg._$info.name, new Map<number,any>([[0, httpsCfg]]));