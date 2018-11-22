/**
 * wrappers for db operations (CRUD)
 */

import { TabMeta } from '../pi/struct/sinfo';
import { alter, iterDb, modify, query, read, write } from '../pi_pt/db';
import { Mgr, Tr } from '../pi_pt/rust/pi_db/mgr';

import { Logger } from './logger';

const logger = new Logger('DB');

type DbType = 'memory' | 'file';

const createBucket = (dbType: DbType, bucketName: string, bucketMetaInfo: TabMeta, dbMgr: Mgr): Bucket => {
    try {
        write(dbMgr, (tr: Tr) => {
            alter(tr, dbType, bucketName, bucketMetaInfo);
        });

    } catch (e) {
        console.log('create bucket failed with error: ', e);
        throw new Error('Create bucket failed');
    }

    return new Bucket(dbType, bucketName, dbMgr);
};

export const createPersistBucket = (bucketName: string, bucketMetaInfo: TabMeta, dbMgr: Mgr): Bucket => {
    return createBucket('file', bucketName, bucketMetaInfo, dbMgr);
};

export const createMemoryBucket = (bucketName: string, bucketMetaInfo: TabMeta, dbMgr: Mgr): Bucket => {
    return createBucket('memory', bucketName, bucketMetaInfo, dbMgr);
};

export class Bucket {

    private bucketName: string;
    private dbType: DbType;
    private dbManager: any;

    constructor(dbType: DbType, bucketName: string, dbMgr: Mgr) {
        this.bucketName = bucketName;
        this.dbType = dbType;
        this.dbManager = dbMgr;
    }

    // tslint:disable-next-line:no-reserved-keywords
    public get<K, V>(key: K, timeout: number = 1000): V {
        let value: any;
        const items = [];

        try {

            if (Array.isArray(key)) {
                for (let i = 0; i < key.length; i++) {
                    items.push({ ware: this.dbType, tab: this.bucketName, key: key[i] });
                }
            } else {
                items.push({ ware: this.dbType, tab: this.bucketName, key: key });
            }
            read(this.dbManager, (tr: Tr) => {
                value = query(tr, items, timeout, false);
            });

        } catch (e) {
            logger.error('read key from bucket failed with error: ', e);
        }

        if (Array.isArray(value)) {
            value = value.map(v => v.value);
        }

        return value;
    }

    public put<K, V>(key: K, value: V, timeout: number = 1000): boolean {
        const items = [];

        try {
            if (Array.isArray(key) && Array.isArray(value) && key.length === value.length) {
                for (let i = 0; i < key.length; i++) {
                    items.push({ ware: this.dbType, tab: this.bucketName, key: key[i], value: value[i] });
                }
            } else {
                items.push({ ware: this.dbType, tab: this.bucketName, key: key, value: value });
            }
            write(this.dbManager, (tr: Tr) => {
                modify(tr, items, timeout, false);
            });

            return true;
        } catch (e) {
            logger.error('failed to write key with error: ', e);
        }

        return false;
    }

    public update<K, V>(key: K, value: V, timeout: number = 1000): boolean {
        if (this.get<K, V>(key) === undefined) {
            return false;
        }

        return this.put<K, V>(key, value, timeout);
    }

    // tslint:disable-next-line:no-reserved-keywords
    public delete<K>(key: K, timeout: number = 1000): boolean {
        if (this.get<K, any>(key) === undefined) {
            return false;
        }
        try {
            write(this.dbManager, (tr: Tr) => {
                modify(tr, [{ ware: this.dbType, tab: this.bucketName, key: key }], timeout, false);
            });

            return true;
        } catch (e) {
            logger.error('failed to delete key with error: ', e);
        }

        return false;
    }

    public iter<K>(key: K, desc: boolean = false, filter: string = ''): any {
        let iter;
        try {
            read(this.dbManager, (tr: Tr) => {
                iter = iterDb(tr, this.dbType, this.bucketName, key, desc, filter);
            });
        } catch (e) {
            logger.error('failed to iter db with error: ', e);
        }

        return iter;
    }
}