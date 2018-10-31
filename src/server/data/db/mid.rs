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