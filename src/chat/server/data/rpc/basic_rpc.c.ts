
import {cfgMgr} from "../../../../pi/util/cfg";
import {Entrance} from "../../../../pi_pt/entrance.s";

let _$c = (path, notes):Entrance => {return new Entrance(path, notes)};
let arr = [[0, _$c("chat/server/data/rpc/basic.registerUser", new Map<string,string>([["rpc","rpcServer"]]))],[1, _$c("chat/server/data/rpc/basic.login", new Map<string,string>([["rpc","rpcServer"]]))],[2, _$c("chat/server/data/rpc/basic.getUsersInfo", new Map<string,string>([["rpc","rpcServer"]]))],[3, _$c("chat/server/data/rpc/basic.getGroupsInfo", new Map<string,string>([["rpc","rpcServer"]]))],[4, _$c("chat/server/data/rpc/basic.getContact", new Map<string,string>([["rpc","rpcServer"]]))],[5, _$c("chat/server/data/rpc/basic.getFriendLinks", new Map<string,string>([["rpc","rpcServer"]]))],[6, _$c("chat/server/data/rpc/basic.getGroupHistory", new Map<string,string>([["rpc","rpcServer"]]))],[7, _$c("chat/server/data/rpc/basic.getUserHistory", new Map<string,string>([["rpc","rpcServer"]]))],[8, _$c("chat/server/data/rpc/basic.getAnnoucement", new Map<string,string>([["rpc","rpcServer"]]))],[9, _$c("chat/server/data/rpc/basic.getAnnoucements", new Map<string,string>([["rpc","rpcServer"]]))],[10, _$c("chat/server/data/rpc/basic.setData", new Map<string,string>([["rpc","rpcServer"]]))],[11, _$c("chat/server/data/rpc/basic.getData", new Map<string,string>([["rpc","rpcServer"]]))]] as any;
cfgMgr.update(Entrance._$info.name, new Map<number,any>(arr));