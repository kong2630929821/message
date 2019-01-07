
import { BonBuffer } from "../../../pi/util/bon";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr} from "../../../pi/struct/struct_mgr";
import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "../../../pi/struct/sinfo";

export class sendMessage extends Struct {

    src: string;
    dst: string;
    msgType: number;
    msgId: number;
    payload: string;
	static _$info =  new StructInfo("chat/server/rpc/send_message.sendMessage",2703175991, null, [new FieldInfo("src", 
new EnumType( Type.Str ), null), new FieldInfo("dst", 
new EnumType( Type.Str ), null), new FieldInfo("msgType", 
new EnumType( Type.U8 ), null), new FieldInfo("msgId", 
new EnumType( Type.Usize ), null), new FieldInfo("payload", 
new EnumType( Type.Str ), null) ]);






	bonDecode(bb:BonBuffer) {
		(<any>this).src = bb.readUtf8();
		(<any>this).dst = bb.readUtf8();
		(<any>this).msgType = bb.readInt();
		(<any>this).msgId = bb.readInt();
		(<any>this).payload = bb.readUtf8();
	}


	bonEncode(bb:BonBuffer) {        
        bb.writeUtf8(this.src);
                
        bb.writeUtf8(this.dst);
                
        bb.writeInt(this.msgType);
                
        bb.writeInt(this.msgId);
                
        bb.writeUtf8(this.payload);
        
	}
}


export class messageReceivedAck extends Struct {

    ack: boolean;
	static _$info =  new StructInfo("chat/server/rpc/send_message.messageReceivedAck",3720604776, null, [new FieldInfo("ack", 
new EnumType( Type.Bool ), null) ]);






	bonDecode(bb:BonBuffer) {
		(<any>this).ack = bb.readBool();
	}


	bonEncode(bb:BonBuffer) {        
        bb.writeBool(this.ack);
        
	}
}


export class messageDeliveredAck extends Struct {

    ack: boolean;
	static _$info =  new StructInfo("chat/server/rpc/send_message.messageDeliveredAck",55659149, null, [new FieldInfo("ack", 
new EnumType( Type.Bool ), null) ]);






	bonDecode(bb:BonBuffer) {
		(<any>this).ack = bb.readBool();
	}


	bonEncode(bb:BonBuffer) {        
        bb.writeBool(this.ack);
        
	}
}

