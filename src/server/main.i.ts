import { AccountGenerator } from './data/db/user.s';

import { Bucket } from '../utils/db';
import { getEnv } from '../pi_pt/init/init';

const ACCOUNT_START = 10000;
const dbMgr = getEnv().getDbMgr();

const initAccountGenerator = () => {
    let accountGenerator = new AccountGenerator();
    accountGenerator.index = "index";
    accountGenerator.nextIndex = ACCOUNT_START;

    const bkt = new Bucket("file", "server/data/db/user.AccountGenerator", dbMgr);
    bkt.put("index", accountGenerator);
}

initAccountGenerator();
