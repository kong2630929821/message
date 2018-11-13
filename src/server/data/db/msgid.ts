import { Bucket } from '../../../utils/db';
import { Mgr } from "../../../pi_pt/rust/pi_db/mgr";

import { GroupMsgIdBucket, P2PMsgIdBucket, AnounceMsgIdBucket, AccountBucket } from '../db/mid.s';

export class P2PMsgId {
    private uid: number;
    private dbManager: Mgr;

    constructor(uid: number, dbMgr: Mgr) {
        this.uid = uid;
        this.dbManager = dbMgr;
    }

    nextId() {
        let m = new P2PMsgIdBucket();
        let gbkt = new Bucket("file","server/data/db/mid.P2PMsgIdBucket", this.dbManager);
        if (gbkt.get(this.uid)[0] === undefined) {
            m.uid = this.uid;
            m.mid = 1;
            gbkt.put(this.uid, m);

            return 1;
        } else {
            let cur = gbkt.get<number, [P2PMsgIdBucket]>(this.uid)[0];
            let nextId = cur.mid + 1;
            m.uid = this.uid;
            m.mid = nextId;
            gbkt.put(this.uid, m);

            return nextId;
        }
    }
}

export class GroupMsgId {
    private gid: number;
    private dbManager: Mgr;

    constructor(gid: number, dbMgr: Mgr) {
        this.gid = gid;
        this.dbManager = dbMgr;
    }

    nextId() {
        let m = new GroupMsgIdBucket();
        let gbkt = new Bucket("file","server/data/db/mid.GroupMsgIdBucket", this.dbManager);
        if (gbkt.get(this.gid)[0] === undefined) {
            m.gid = this.gid;
            m.mid = 1;
            gbkt.put(this.gid, m);

            return 1;
        } else {
            let cur = gbkt.get<number, [GroupMsgIdBucket]>(this.gid)[0];
            let nextId = cur.mid + 1;
            m.gid = this.gid;
            m.mid = nextId;
            gbkt.put(this.gid, m);

            return nextId;
        }
    }
}

export class AnounceMsgId {
    private gid: number;
    private dbManager: Mgr;

    constructor(gid: number, dbMgr: Mgr) {
        this.gid = gid;
        this.dbManager = dbMgr;
    }

    nextId() {
        let m = new AnounceMsgIdBucket();
        let gbkt = new Bucket("file","server/data/db/mid.AnounceMsgIdBucket", this.dbManager);
        if (gbkt.get(this.gid)[0] === undefined) {
            m.gid = this.gid;
            m.aid = 1;
            gbkt.put(this.gid, m);

            return 1;
        } else {
            let cur = gbkt.get<number, [AnounceMsgIdBucket]>(this.gid)[0];
            let nextId = cur.aid + 1;
            m.gid = this.gid;
            m.aid = nextId;
            gbkt.put(this.gid, m);

            return nextId;
        }
    }
}

export class AccountId {
    private dbManager: Mgr;

    constructor(dbMgr: Mgr) {
        this.dbManager = dbMgr;
    }

    nextPersonalId() {
        let m = new AccountBucket();
        let gbkt = new Bucket("file","server/data/db/mid.AccountBucket", this.dbManager);
        if (gbkt.get(0)[0] === undefined) {
            m.atype = 0;
            m.accid = 1;
            gbkt.put(m.atype, m);

            return 1;
        } else if (gbkt.get(1)[0] === undefined) {
            m.atype = 1;
            m.accid = 1;
            gbkt.put(m.atype, m);

            return 1;
        } else {
            let cur = gbkt.get<number, [AccountBucket]>(0)[0];
            let nextId = cur.accid + 1;
            m.accid = nextId;
            m.atype = 0;
            gbkt.put(m.atype, m);

            return nextId;
        }
    }

    nextGroupId() {
        let m = new AccountBucket();
        let gbkt = new Bucket("file","server/data/db/mid.AccountBucket", this.dbManager);
        if (gbkt.get(0)[0] === undefined) {
            m.atype = 0;
            m.accid = 1;
            gbkt.put(m.atype, m);

            return 1;
        } else if(gbkt.get(1)[0] === undefined) {
            m.atype = 1;
            m.accid = 1;
            gbkt.put(m.atype, m);

            return 1;
        } else {
            let cur = gbkt.get<number, [AccountBucket]>(1)[0];
            let nextId = cur.accid + 1;
            m.accid = nextId;
            m.atype = 1;
            gbkt.put(m.atype, m);

            return nextId;
        }
    }
}