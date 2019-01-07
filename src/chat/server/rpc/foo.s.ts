
import { BonBuffer } from "../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../pi/struct/sinfo";

export class FooRpc extends Struct {

    name: string;
    age: number;
	static _$info =  new StructInfo("chat/server/rpc/foo.FooRpc",3483197322, null, [new FieldInfo("name", 
new EnumType( Type.Str ), null), new FieldInfo("age", 
new EnumType( Type.U8 ), null) ]);






	bonDecode(bb:BonBuffer) {
		(<any>this).name = bb.readUtf8();
		(<any>this).age = bb.readInt();
	}


	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.name);
                
        bb.writeInt(this.age);
        
	}
}


export class FooRpcResp extends Struct {

    name: string;
    age: number;
	static _$info =  new StructInfo("chat/server/rpc/foo.FooRpcResp",1926854070, null, [new FieldInfo("name", 
new EnumType( Type.Str ), null), new FieldInfo("age", 
new EnumType( Type.U8 ), null) ]);






	bonDecode(bb:BonBuffer) {
		(<any>this).name = bb.readUtf8();
		(<any>this).age = bb.readInt();
	}


	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.name);
                
        bb.writeInt(this.age);
        
	}
}

