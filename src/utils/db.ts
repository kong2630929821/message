/**
 * wrappers for db operations (CRUD)
 */

import { read, write, query, alter, modify, iterDb } from "../pi_pt/db";
import { getNativeObj, getEnv } from "../pi_pt/init/init";
import {Tr} from "../pi_pt/rust/pi_db/mgr";
import { TabMeta, EnumType, Type } from "../pi/struct/sinfo";

type DbType = "memory" | "file";

export type KeyType = Type;
export type ValueType = Type;

export const createPersistBucket = (bucketName: string, keyType: KeyType, valueType: ValueType): Bucket => {
    const dbMgr = getEnv().getDbMgr();

    try {
        write(dbMgr, (tr: Tr) => {
            alter(tr, "file", bucketName, new TabMeta(new EnumType(keyType), new EnumType(valueType)));
        });

    } catch(e) {
        console.log("create persist bucket failed with error: ", e);
        throw new Error("Create persist bucket");
    }

    return new Bucket("file", bucketName, keyType, valueType);
}

export const createMemoryBucket = (bucketName: string, keyType: KeyType, valueType: ValueType): Bucket => {
    const dbMgr = getEnv().getDbMgr();

    try {
        write(dbMgr, (tr: Tr) => {
            alter(tr, "memory", bucketName, new TabMeta(new EnumType(keyType), new EnumType(valueType)));
        });

    } catch(e) {
        console.log("create memory bucket failed with error: ", e);
        throw new Error("Create persist bucket");
    }

    return new Bucket("memory", bucketName, keyType, valueType);
}

// export const getPersistBucket = (bucketName: string): Bucket => {

// }

// export const getMemoryBucket = (buckName: string): Bucket => {

// }

class Bucket {

    private bucketName: string;
    private dbType: DbType;
    private keyType: KeyType;
    private valueType: ValueType;
    private dbManager: any;

    constructor(dbType: DbType, bucketName: string, keyType: KeyType, valueType: ValueType) {
        this.bucketName = bucketName;
        this.dbType = dbType;
        this.keyType = keyType;
        this.valueType = valueType;
        this.dbManager = getEnv().getDbMgr();
    }

    get(key: KeyType, timeout: number = 100): any {
        let value: any;

        try {
            read(this.dbManager, (tr: Tr) => {
                value = query(tr, [{ware: this.dbType, tab: this.bucketName, key: key}], timeout, false);
            });

            return value;
        } catch(e) {
            console.log("create memory bucket failed with error: ", e);
        }

        return null;
    }

    put(key: KeyType, value: ValueType, timeout: number = 100): boolean {
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

    update(key: KeyType, value: ValueType, timeout: number = 100): boolean {
        return this.put(key, value, timeout);
    }

    delete(key: KeyType, timeout: number = 100): boolean {
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