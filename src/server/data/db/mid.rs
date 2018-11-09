#[primary=gid,db=file,dbMonitor=true,hasmgr=false]
struct GroupMsgIdBucket {
    gid: usize,
    mid: usize
}

#[primary=uid,db=file,dbMonitor=true,hasmgr=false]
struct P2PMsgIdBucket {
    uid: usize,
    mid: usize
}

#[primary=gid,db=file,dbMonitor=true,hasmgr=false]
struct AnounceMsgIdBucket {
    gid: usize,
    aid: usize
}

#[primary=atype,db=file,dbMonitor=true,hasmgr=false]
struct AccountBucket {
    atype: usize, // account type: 0 -> personal account, 1 -> group account
    accid: usize
}