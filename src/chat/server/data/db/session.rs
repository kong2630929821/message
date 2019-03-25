struct Session2 {
    key: String,
    value: String,
}
//会话记录表
#[primary=id,db=memory]
struct SessionTab {
    id: String,
    sessions: &[Session2],
}
