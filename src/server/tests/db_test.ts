import { createPersistBucket, createMemoryBucket, Bucket } from '../../utils/db';
import { Type, EnumType, TabMeta } from "../../pi/struct/sinfo";
import { UserInfo } from './foo.s';
import { getEnv } from '../../pi_pt/init/init';

const dbMgr = getEnv().getDbMgr();

const test_basic_db_operation = () => {

    let m = new TabMeta(new EnumType(Type.Str), new EnumType(Type.Str));

    // memory db
    let memBucket = createPersistBucket("hello", m, dbMgr);
    memBucket.put<string, string>("hi", "Hello");
    //write different key type and value type
    memBucket.put<number, number>(1, 100);
    // memBucket.get(1);   // should panic
    console.log( memBucket.get<string, string>("hi"));
    if(memBucket.delete<string>("hi")) {
        console.log("delete exist key success");
    } else {
        console.log("delete exist key failed");
    }

    // delete not exist key
    if(memBucket.delete<string>("wtf")) {
        console.log("delete non-exist key success");
    } else {
        console.log("delete non-exist key failed");
    }

    // file db
    let persistBucket = createMemoryBucket("hello", m, dbMgr);
    persistBucket.put<string, string>("11", "22");
    console.log(persistBucket.get<string, string>("11"));
}

const test_write_structInfo = () => {
    let meta = new TabMeta(new EnumType(Type.U32), new EnumType(Type.Struct, UserInfo._$info))
    let m = createMemoryBucket("TEST", meta, dbMgr);

    let v = new UserInfo()
    v.uid = 99202;
    v.phone = "你是谁";

    m.put<Type.Struct, any>(123, v);
    console.log(m.get(123));
}

const test_iterdb = () => {
    let m = new TabMeta(new EnumType(Type.Str), new EnumType(Type.Str));

    // memory db
    let memBucket = createPersistBucket("foo", m, dbMgr);
    memBucket.put<string, string>("hi1", "world1");
    memBucket.put<string, string>('hi2', 'world2');
    memBucket.put<string, string>('hi3', 'world3');

    let it = memBucket.iter<string>("hi");

    let item1 = it.nextElem();
    let item2 = it.nextElem();
    let item3 = it.nextElem();

    if (item1[1] != "world1" && item2[1] != "world2" && item3[1] != "world3") {
        throw new Error("Test iterdb failed");
    } else {
        console.log("Test iterDb successed");
    }
}

const test_read_from_exist_bucket = () => {
    let bkt = new Bucket("file", "foo", dbMgr);

    console.log('read_from_exist_bucket', bkt.get("hi1"));
}

const test_batch_read = () => {
    let bkt = new Bucket("file", "foo", dbMgr);

    let v = bkt.get(["hi1", "hi2", "hi3"]);

    console.log('test_batch_read', v)
}

const test_batch_write_then_read = () => {
    let bkt = new Bucket("file", "foo", dbMgr);

    let keys = ["batch1", "batch2", "batch3"];
    let vals = ["batch_value1", "batch_value2", "batch_value3"];

    bkt.put(keys, vals);

    let v = bkt.get(keys);

    console.log("batch_write_then_read:", v);

    if (v[0] === vals[0] && v[1] === vals[1] && v[2] === vals[2]) {
        console.log("test batch write then read success");
    } else {
        console.log("test batch write then read failed")
    }
}

export const test_db = () => {
    test_basic_db_operation();
    test_write_structInfo();
    test_iterdb()
    test_read_from_exist_bucket();
    test_batch_read();
    test_batch_write_then_read();
}
