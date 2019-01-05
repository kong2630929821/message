
import { BonBuffer } from "../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../pi/struct/sinfo";

export class SendMsg extends Struct {

    cmd: string;
    msg: string;
	static _$info =  new StructInfo("chat/utils/send.SendMsg",2898385964, null, [new FieldInfo("cmd", 
new EnumType( Type.Str ), null), new FieldInfo("msg", 
new EnumType( Type.Str ), null) ]);





	bonDecode(bb:BonBuffer) {
		this.cmd = bb.readUtf8();
		this.msg = bb.readUtf8();
	}

	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.cmd);
                
        bb.writeUtf8(this.msg);
        
	}
}

