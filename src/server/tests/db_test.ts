import { createPersistBucket,createMemoryBucket } from '../../utils/db';
import { Type, EnumType, TabMeta } from "../../pi/struct/sinfo";

export const test_db = () => {
    let m = new TabMeta(new EnumType(Type.I32), new EnumType(Type.I64));

    let memBucket = createPersistBucket("hello", m);
    memBucket.put(1000, 2);
    console.log(memBucket.get(1000));
    // console.assert(memBucket.delete(1) === true, "delete failed");

    memBucket.update(1, 11);

    let persistBucket = createMemoryBucket("hello", m);
    persistBucket.put(11, 22);
    // console.log(persistBucket.get(11));
    // console.assert(persistBucket.delete(1) === true, "delete failed");
}
