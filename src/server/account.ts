import { createPersistBucket, Bucket } from '../utils/db';
import { Type, EnumType, TabMeta } from "../pi/struct/sinfo";
import { getEnv } from '../pi_pt/init/init';

const ACCOUNT_START = 10000;
const dbMgr = getEnv().getDbMgr();

export const initAccountGenerator = () => {
    // FIXME: `AccountGenerator` will be overwriten even if it exists
    let meta = new TabMeta(new EnumType(Type.Str), new EnumType(Type.U32));
    let accountGeneratorBucket = createPersistBucket("AccountGenerator", meta, dbMgr);
    accountGeneratorBucket.put("lastUsedIndex", ACCOUNT_START);
}

export const getNextAccount = (): number => {
    let bkt = new Bucket("file", "AccountGenerator", dbMgr);
    let v = bkt.get("lastUsedIndex");
    v[0] = v[0] + 1;
    bkt.put("lastUsedIndex", v[0]);

    return v[0];
}


