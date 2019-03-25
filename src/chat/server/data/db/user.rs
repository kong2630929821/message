/**
 * 用户信息表
 */

/**
*性别
*/
enum SEXY {
    FAMALE = 0, //女性
    MALE = 1,   //男性
}

enum GENERATOR_TYPE {
    USER = "user",   //个人
    GROUP = "group", //群组
}

enum VIP_LEVEL {
    VIP0 = 0, // 普通用户
    VIP1 = 1,
    VIP2 = 2, 
    VIP3 = 3,
    VIP4 = 4,
    VIP5 = 5, // 官方账号
}

/**
*用户本人的基本信息
*/
#[primary=uid,db=file,dbMonitor=true]
struct UserInfo {
    uid: u32,            //用户id,自增,-1代表不存在
    name: String,        //用户自己设置的用户名
    avatar: String,      //头像
    sex: u32,            //性别
    tel: String,         //电话
    note: String,        //用户自己的备注信息
    wallet_addr: String, //钱包地址
    acc_id:String        // 钱包账户ID
}

/**
 * User credential table
 */
#[primary=uid,db=file,dbMonitor=true]
struct UserCredential {
    uid: u32, //-1代表不存在
    passwdHash: String,
}

/**
 * 用户账户信息
 */
#[primary=user,db=file,dbMonitor=true]
struct UserAccount {
    user: String,
    uid: u32,
}

/**
 * 用户查询表
 */
#[primary=user,db=file,dbMonitor=true]
struct UserFind {
    user: String, //p:手机、w:钱包地址、u:uid
    uid: u32,
}

/**
 * User account generator
 */
#[primary=index,db=file,dbMonitor=true,hasmgr=false]
struct AccountGenerator {
    index: String, //本质上是GENERATOR_TYPE
    currentIndex: u32,
}

/**
*好友链接信息
*/
#[primary=uuid,db=file,dbMonitor=true]
struct FriendLink {
    uuid: String, //两个用户的id"-1"代表不存在,"10001:10002",前面代表uid1后面代表uid2
    alias: String, //别名,如果没有别名则为空字符串
    hid: String,  //历史记录id 53位，直接使用底层接口
}

/**
*联系人信息
*/
#[primary=uid,db=file,dbMonitor=true]
struct Contact {
    uid: u32,              //用户id,-1代表不存在
    friends: &[u32],       //好友id
    temp_chat: &[u32],     //临时用户id
    group: &[u32],         //群组id
    myGroup: &[u32],       //用户创建的群组id
    applyUser: &[u32],     //其他用户申请添加当前用户为好友
    applyGroup: &[String], //guid 其他群组的某个成员邀请当前用户加入
    blackList: &[u32],
}

#[primary=uid,db=memory]
struct OnlineUsers {
    uid: u32,
    sessionId: u32, // 若用户在线，seessionId > -1
}

#[primary=sessionId,db=memory]
struct OnlineUsersReverseIndex {
    sessionId: u32,
    uid: u32,
}

/**
*前端需要存储的数据
*/
#[primary=uid,db=file]
struct FrontStoreData {
    uid:u32,
    value:String,
}

#[primary=uid,db=file]
struct UserLevel {
    uid: u32,
    level: u8 // 权限等级 用户好友上限和群上限
}