/**
 * Server configuration
 */
import { cfgMgr } from '../../../pi/util/cfg';
import { HttpsCfg, MqttCfg, NetCfg, RpcCfg, RawNetMgr, NetCfg_Enum, AsyncCfg, RawNetCfg } from '../../../pi_pt/init/server_cfg.s';

// const netMgr = new NetMgr('netMgr', []);
// const netCfg = new NetCfg('0.0.0.0:9080', 'tcp', true, netMgr, []);
// const mqttCfg = new MqttCfg(netCfg, 1024 * 1024, 500 * 1000, 'mqttServer', []);
// const rpcCfg = new RpcCfg(mqttCfg, 'rpcServer', ['mqttServer']);
// // const httpsCfg = new HttpsCfg('0.0.0.0', 82, 5000, 10000, '../dst/');

// cfgMgr.set(NetMgr._$info.name, new Map<number, any>([[0, netMgr]]));
// cfgMgr.set(NetCfg._$info.name, new Map<number, any>([[0, netCfg]]));
// cfgMgr.set(MqttCfg._$info.name, new Map<number, any>([[0, mqttCfg]]));
// cfgMgr.set(RpcCfg._$info.name, new Map<number, any>([[0, rpcCfg]]));
// cfgMgr.set(HttpsCfg._$info.name, new Map<number,any>([[0, httpsCfg]]));

// 启动http与ws
let rawNetMgr = new RawNetMgr('rawNetMgr', []);
let rawNetCfg = new NetCfg(NetCfg_Enum.Raw, new RawNetCfg('0.0.0.0:9080', 'tcp', true, rawNetMgr, []));
let mqttCfg = new MqttCfg(rawNetCfg, 1024*1024, 500 * 1000, "mqttServer", []);
let rpcCfg = new RpcCfg(mqttCfg, 'rpcServer', ['mqttServer']);
let asyncCfg = new AsyncCfg([]);
let httpsCfg = new HttpsCfg('0.0.0.0', 82, 5000, 10000, '../dst/');

cfgMgr.set(RawNetMgr._$info.name, new Map<number,any>([[0, rawNetMgr]]));
cfgMgr.set(NetCfg._$info.name, new Map<number,any>([[0, rawNetCfg]]));
cfgMgr.set(MqttCfg._$info.name, new Map<number, any>([[0, mqttCfg]]));
cfgMgr.set(RpcCfg._$info.name, new Map<number, any>([[0, rpcCfg]]));
cfgMgr.set(AsyncCfg._$info.name, new Map<number,any>([[0, asyncCfg]]));
cfgMgr.set(HttpsCfg._$info.name, new Map<number,any>([[0, httpsCfg]]));