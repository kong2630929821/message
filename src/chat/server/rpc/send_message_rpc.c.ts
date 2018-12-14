
import {cfgMgr} from "../../../pi/util/cfg";
import {Entrance} from "../../../pi_pt/entrance.s";

let _$c = (path, notes):Entrance => {return new Entrance(path, notes)};
let arr = [[0, _$c("chat/server/rpc/send_message.sendMessage", new Map<string,string>([["rpc","true"]]))],[1, _$c("chat/server/rpc/send_message.messageDeliveredAck", new Map<string,string>([["rpc","true"]]))]] as any;
cfgMgr.update(Entrance._$info.name, new Map<number,any>(arr));