/**
 * 常量定义
 */

// 数据库名
export const WARE_NAME = 'file';
export const MEMORY_NAME = 'memory';

// 表名

// 群组
export const GROUP_INFO_TABLE = 'chat/server/data/db/group.GroupInfo';
export const GROUP_USER_LINK_TABLE = 'chat/server/data/db/group.GroupUserLink';

// 消息
export const USER_HISTORY_TABLE = 'chat/server/data/db/message.UserHistory';
export const GROUP_HISTORY_TABLE = 'chat/server/data/db/message.GroupHistory';
export const ANNOUNCE_HISTORY_TABLE = 'chat/server/data/db/message.AnnounceHistory';
export const MSG_LOCK_TABLE = 'chat/server/data/db/message.MsgLock';
export const USER_HISTORY_CURSOR_TABLE = 'chat/server/data/db/message.UserHistoryCursor';
export const GROUP_HISTORY_CURSOR_TABLE = 'chat/server/data/db/message.GroupHistoryCursor';

// 个人
export const USER_INFO_TABLE = 'chat/server/data/db/user.UserInfo';
export const USER_ACCOUNT_TABLE = 'chat/server/data/db/user.UserAccount';
export const USER_CREDENTIAL_TABLE = 'chat/server/data/db/user.UserCredential';
export const ACCOUNT_GENERATOR_TABLE = 'chat/server/data/db/user.AccountGenerator';
export const FRIEND_LINK_TABLE = 'chat/server/data/db/user.FriendLink';
export const CONTACT_TABLE = 'chat/server/data/db/user.Contact';
export const LAST_READ_MESSAGE_ID_TABLE = 'chat/server/data/db/user.LastReadMessageId';
export const ONLINE_USERS_TABLE = 'chat/server/data/db/user.OnlineUsers';
export const ONLINE_USERS_REVERSE_INDEX_TABLE = 'chat/server/data/db/user.OnlineUsersReverseIndex';
export const FRONT_STORE_DATA = 'chat/server/data/db/user.FrontStoreData';

// 其他
export const ADDRESS_INFO_TABLE = 'chat/server/data/db/extra.AddressInfo';
export const DEFAULT_ERROR_STR = '-1';
export const DEFAULT_ERROR_NUMBER = -1;
export const RESULT_SUCCESS = 1;
export const CUSTOMER_SERVICE = 10001;  // 客服账号
export const TURNTABLE_GROUP = 10001; // 大转盘官方群
export const OPENBOX_GROUP = 10002; // 开宝箱官方群
export const LOLGUESS_GROUP = 10003; // LOL竞猜官方群
export const FOMOSPORTS_GROUP = 10004; // fomosports官方群
export const  CRYPTOFISHING_GROUP = 10005; // crypto fishing官方群
export const HAOHAI_APPID = '101';  // 好嗨的appid

// ---------------------- 权限等级 ---------------------
// 普通用户 VIP0
export const VIP0_FRIENDS_LIMIT = 500; // 好友上限
export const VIP0_GROUPS_LIMIT = 5; // 群上限
export const VIP0_GROUP_MEMBERS_LIMIT = 500; // 普通群的成员上限
// 官方账号 VIP5
export const VIP5_FRIENDS_LIMIT = 2000; // 好友上限
export const VIP5_GROUPS_LIMIT = 100; // 群上限
export const VIP5_GROUP_MEMBERS_LIMIT = 1000; // 官方群的成员上限

// 推送cmd
export const SEND_REFUSED = 'refused_add'; // 拒绝好友