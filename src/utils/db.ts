/**
 * wrappers for db operations (CRUD)
 */

import { read, write, query, alter, modify, iterDb } from "../pi_pt/db";
import { getNativeObj, getEnv } from "../pi_pt/init/init";
import {Tr} from "../pi_pt/rust/pi_db/mgr";
import { TabMeta, EnumType, Type } from "../pi/struct/sinfo";

type DbType = "memory" | "file";

export type KeyType = any;
export type ValueType = any;

const createBucket = (dbType: DbType, bucketName: string, bucketMetaInfo: TabMeta): Bucket => {
    const dbMgr = getEnv().getDbMgr();

    try {
        write(dbMgr, (tr: Tr) => {
            alter(tr, dbType, bucketName, bucketMetaInfo);
        });

    } catch(e) {
        console.log("create bucket failed with error: ", e);
        throw new Error("Create bucket failed");
    }

    return new Bucket(dbType, bucketName, bucketMetaInfo);
}

export const createPersistBucket = (bucketName: string, bucketMetaInfo: TabMeta): Bucket => {
    return createBucket("file", bucketName, bucketMetaInfo);
}

export const createMemoryBucket = (bucketName: string, bucketMetaInfo: TabMeta): Bucket => {
    return createBucket("memory", bucketName, bucketMetaInfo);
}

class Bucket {

    private bucketName: string;
    private dbType: DbType;
    private dbManager: any;
    private tabMeta: TabMeta;

    constructor(dbType: DbType, bucketName: string, bucketMetaInfo: TabMeta) {
        this.bucketName = bucketName;
        this.dbType = dbType;
        this.tabMeta = bucketMetaInfo;
        this.dbManager = getEnv().getDbMgr();
    }

    get(key: KeyType, timeout: number = 1000): ValueType {
        let value: any;

        try {
            read(this.dbManager, (tr: Tr) => {
                value = query(tr, [{ware: this.dbType, tab: this.bucketName, key: key}], timeout, false);
            });
        } catch(e) {
            console.log("create memory bucket failed with error: ", e);
        }

        return value[0].value ? value[0].value : undefined;
    }

    put(key: KeyType, value: ValueType, timeout: number = 1000): boolean {
        try {
            write(this.dbManager, (tr: Tr) => {
                modify(tr, [{ware: this.dbType, tab: this.bucketName, key: key, value: value}], timeout, false);
            });

            return true;
        } catch(e) {
            console.log("failed to write key with error: ", e);
        }

        return false;
    }

    update(key: KeyType, value: ValueType, timeout: number = 1000): boolean {
        if(this.get(key) === undefined) {
            return false;
        }

        return this.put(key, value, timeout);
    }

    delete(key: KeyType, timeout: number = 1000): boolean {
        if(this.get(key) === undefined) {
            return false;
        }
        try {
            write(this.dbManager, (tr: Tr) => {
                modify(tr, [{ware: this.dbType, tab: this.bucketName, key: key}], timeout, false);
            });

            return true;
        } catch(e) {
            console.log("failed to delete key with error: ", e);
        }

        return false;
    }
}