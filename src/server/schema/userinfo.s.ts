
import { BonBuffer } from "../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../pi/struct/sinfo";

export class UserInfo extends Struct {

    uid: number;
    phone: string;
    ethAddr: string;
    note: string;
    bio: string;
	static _$info =  new StructInfo("server/schema/userinfo.UserInfo",3731285749,  new Map( [["primary","uid"]]), [new FieldInfo("uid", 
new EnumType( Type.Usize ), null), new FieldInfo("phone", 
new EnumType( Type.Str ), null), new FieldInfo("ethAddr", 
new EnumType( Type.Str ), null), new FieldInfo("note", 
new EnumType( Type.Str ), null), new FieldInfo("bio", 
new EnumType( Type.Str ), null) ]);


	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		addToMeta(mgr, this);
	}

	removeMeta(){
		removeFromMeta(this);
        }



	bonDecode(bb:BonBuffer) {
		this.uid = bb.readInt();
		this.phone = bb.readUtf8();
		this.ethAddr = bb.readUtf8();
		this.note = bb.readUtf8();
		this.bio = bb.readUtf8();
        }

	bonEncode(bb:BonBuffer) {        
        bb.writeInt(this.uid);
                
        bb.writeUtf8(this.phone);
                
        bb.writeUtf8(this.ethAddr);
                
        bb.writeUtf8(this.note);
                
        bb.writeUtf8(this.bio);
        
	}
}

