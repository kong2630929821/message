import { createPersistBucket,createMemoryBucket } from '../../utils/db';
import { Type } from "../../pi/struct/sinfo";

export const test_db = () => {
    let memBucket = createPersistBucket("hello", Type.I32, Type.I32);
    memBucket.put(1, 2);
    console.assert(memBucket.delete(1) === true, "delete failed");
    memBucket.update(1, 11);

    let persistBucket = createMemoryBucket("hello", Type.I32, Type.I32);
    persistBucket.put(1, 2);
    console.assert(persistBucket.delete(1) === true, "delete failed");
}

