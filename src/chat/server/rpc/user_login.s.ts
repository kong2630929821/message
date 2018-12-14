
import { BonBuffer } from "../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../pi/struct/sinfo";

export class userLogin extends Struct {

    uid: string;
    passwdHash: string;
	static _$info =  new StructInfo("chat/server/rpc/user_login.userLogin",229632246, null, [new FieldInfo("uid", 
new EnumType( Type.Str ), null), new FieldInfo("passwdHash", 
new EnumType( Type.Str ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.uid = bb.readUtf8();
		this.passwdHash = bb.readUtf8();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.uid);
                
        bb.writeUtf8(this.passwdHash);
        
	}
}


export class userLoginResponse extends Struct {

    ack: boolean;
	static _$info =  new StructInfo("chat/server/rpc/user_login.userLoginResponse",2481310891, null, [new FieldInfo("ack", 
new EnumType( Type.Bool ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.ack = bb.readBool();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeBool(this.ack);
        
	}
}

