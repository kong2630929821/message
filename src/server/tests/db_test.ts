import { createPersistBucket,createMemoryBucket } from '../../utils/db';
import { Type, EnumType, TabMeta } from "../../pi/struct/sinfo";

export const test_db = () => {
    let m = new TabMeta(new EnumType(Type.Str), new EnumType(Type.Str));

    // memory db
    let memBucket = createPersistBucket("hello", m);
    memBucket.put("hi", "Hello");

    //write different key type and value type
    memBucket.put(1, 100);
    // panic as expected
    // memBucket.get(1);
    console.log(memBucket.get("hi"));
    // console.assert(memBucket.delete(1) === true, "delete failed");

    if(memBucket.delete("hi")) {
        console.log("delete success");
    } else {
        console.log("delete failed");
    }

    // delete not exist key
    if(memBucket.delete("wtf")) {
        console.log("delete success");
    } else {
        console.log("delete failed");
    }

    // file db
    let persistBucket = createMemoryBucket("hello", m);
    persistBucket.put("11", "22");
    console.log(persistBucket.get("11"));
    // console.assert(persistBucket.delete(1) === true, "delete failed");
}
