/**
 * data table schemas
 */
#[primary=uid]
struct UserInfo {
    uid: usize,
    phone: String,
    ethAddr: String,
    note: String,
    bio: String
}