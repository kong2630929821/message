
import { BonBuffer } from "../../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../../pi/struct/sinfo";

export class MemberIdArray extends Struct {

    arr: Array<number>;
	static _$info =  new StructInfo("chat/server/data/rpc/group.MemberIdArray",2609681020, null, [new FieldInfo("arr", 
new EnumType( Type.Arr, 
new EnumType( Type.U32 ) ), null) ]);






	bonDecode(bb:BonBuffer) {
		(<any>this).arr = bb.readArray(() => {
	return     bb.readInt();
})
;
	}


	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.arr, (el) => {    
            bb.writeInt(el);
            
        });
        
	}
}


export class GroupCreate extends Struct {

    name: string;
    note: string;
	static _$info =  new StructInfo("chat/server/data/rpc/group.GroupCreate",1051423718, null, [new FieldInfo("name", 
new EnumType( Type.Str ), null), new FieldInfo("note", 
new EnumType( Type.Str ), null) ]);






	bonDecode(bb:BonBuffer) {
		(<any>this).name = bb.readUtf8();
		(<any>this).note = bb.readUtf8();
	}


	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.name);
                
        bb.writeUtf8(this.note);
        
	}
}


export class GroupAgree extends Struct {

    gid: number;
    uid: number;
    agree: boolean;
	static _$info =  new StructInfo("chat/server/data/rpc/group.GroupAgree",3905904030, null, [new FieldInfo("gid", 
new EnumType( Type.U32 ), null), new FieldInfo("uid", 
new EnumType( Type.U32 ), null), new FieldInfo("agree", 
new EnumType( Type.Bool ), null) ]);






	bonDecode(bb:BonBuffer) {
		(<any>this).gid = bb.readInt();
		(<any>this).uid = bb.readInt();
		(<any>this).agree = bb.readBool();
	}


	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.gid);
                
        bb.writeInt(this.uid);
                
        bb.writeBool(this.agree);
        
	}
}


export class Invite extends Struct {

    gid: number;
    rid: number;
	static _$info =  new StructInfo("chat/server/data/rpc/group.Invite",2413783933, null, [new FieldInfo("gid", 
new EnumType( Type.U32 ), null), new FieldInfo("rid", 
new EnumType( Type.U32 ), null) ]);






	bonDecode(bb:BonBuffer) {
		(<any>this).gid = bb.readInt();
		(<any>this).rid = bb.readInt();
	}


	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.gid);
                
        bb.writeInt(this.rid);
        
	}
}


export class InviteArray extends Struct {

    arr: Array<Invite>;
	static _$info =  new StructInfo("chat/server/data/rpc/group.InviteArray",2142149180, null, [new FieldInfo("arr", 
new EnumType( Type.Arr, 
new EnumType(Type.Struct, Invite._$info ) ), null) ]);






	bonDecode(bb:BonBuffer) {
		(<any>this).arr = bb.readArray(() => {
	return      bb.readBonCode((<any>this)._$EnumTypeMap?(<any>this)._$EnumTypeMap(this.arr):Invite);
})
;
	}


	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.arr, (el) => {    
            bb.writeBonCode(el);
            
        });
        
	}
}


export class NotifyAdmin extends Struct {

    uid: number;
	static _$info =  new StructInfo("chat/server/data/rpc/group.NotifyAdmin",671892964, null, [new FieldInfo("uid", 
new EnumType( Type.U32 ), null) ]);






	bonDecode(bb:BonBuffer) {
		(<any>this).uid = bb.readInt();
	}


	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.uid);
        
	}
}


export class GroupMembers extends Struct {

    members: Array<number>;
	static _$info =  new StructInfo("chat/server/data/rpc/group.GroupMembers",1064650443, null, [new FieldInfo("members", 
new EnumType( Type.Arr, 
new EnumType( Type.U32 ) ), null) ]);






	bonDecode(bb:BonBuffer) {
		(<any>this).members = bb.readArray(() => {
	return     bb.readInt();
})
;
	}


	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.members, (el) => {    
            bb.writeInt(el);
            
        });
        
	}
}


export class GuidsAdminArray extends Struct {

    guids: Array<string>;
	static _$info =  new StructInfo("chat/server/data/rpc/group.GuidsAdminArray",372317141, null, [new FieldInfo("guids", 
new EnumType( Type.Arr, 
new EnumType( Type.Str ) ), null) ]);






	bonDecode(bb:BonBuffer) {
		(<any>this).guids = bb.readArray(() => {
	return     bb.readUtf8();
})
;
	}


	bonEncode(bb:BonBuffer) {        
        bb.writeArray(this.guids, (el) => {    
            bb.writeUtf8(el);
            
        });
        
	}
}


export class GroupAlias extends Struct {

    gid: number;
    groupAlias: string;
	static _$info =  new StructInfo("chat/server/data/rpc/group.GroupAlias",830272070, null, [new FieldInfo("gid", 
new EnumType( Type.U32 ), null), new FieldInfo("groupAlias", 
new EnumType( Type.Str ), null) ]);






	bonDecode(bb:BonBuffer) {
		(<any>this).gid = bb.readInt();
		(<any>this).groupAlias = bb.readUtf8();
	}


	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.gid);
                
        bb.writeUtf8(this.groupAlias);
        
	}
}

