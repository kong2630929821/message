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
export const CHAT_APPID = '10';  // 聊天的APP ID

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
export const SEND_POST_LAUD = 'post_laud'; // 帖子点赞
export const SEND_COMMENT_LAUD = 'comment_laud'; // 评论点赞
export const SEND_COMMENT = 'comment'; // 评论推送
export const SEND_COMMENT_TO_COMMENT = 'comment_to_comment'; // 评论帖子的评论
export const SEND_PUNISH = 'punish'; // 惩罚推送
export const SEND_ARTICLE_REVIEW = 'article_review'; // 文章审核结果通知
export const SEND_PUBLIC_APPLY = 'public_apply'; // 公众号审核结果通知

// --------------------------自增ID源----------------
// 创建社区num
export const COMMUNITY_INDEX = 'community_index';
export const POST_INDEX = 'post_index';     // 帖子ID
export const COMMENT_INDEX = 'comment_index';     // 评论ID

// 社区类型
export const COMMUNITY_TYPE_PERSON = 0;    // 个人
export const COMMUNITY_TYPE_OFFICIAL = 1;    // 官方账号
export const COMMUNITY_TYPE_PUBLIC = 2;    // 公众号

// 社区权限
export const COMMUNITY_AUTH_DEF = 0;    // 默认权限

// 广场分类
export const SQUARE_ALL = 1; // 所有
export const SQUARE_FOLLOW = 2; // 关注
export const SQUARE_PUBLIC = 3; // 公众号
export const SQUARE_HOT = 4; // 热门
export const SQUARE_LABEL = 5; // 标签

// 帖子状态
export const NORMAL_STATE = 1;  // 正常状态
export const DELETE_STATE = 0; // 标记删除
export const NOT_REVIEW_STATE = 2; // 待审核
export const REVIEW_PASS = 3;      // 审核通过
export const REVIEW_REFUSE = 4;    // 审核驳回

// 钱包服务器地址
export const WALLET_SERVER_URL = 'http://127.0.0.1:8099';
// appid
export const WALLET_APPID = '10';
// 私钥
export const WALLET_SERVER_KEY = '0a15c4dbca88fa93ccf43a49b3496208edff35a4185ac967389ffd9878d5c405';
// 创建应用
export const WALLET_API_ADD_APP = '/oAuth/add_app';
// 编辑推荐应用
export const WALLET_API_SET_APP_CONFIG = '/oAuth/set_app_config';

// 爬虫服务地址
export const WEIBO_SPIDER_HOST = 'http://39.98.48.66:9999/'; // 爬虫服务器地址
export const SPIDER_USER_INFO = 'user_spider.py'; // 爬取用户信息
export const SPIDER_WEIBO_INFO = 'weibo_spider.py'; // 爬取微博信息
export const SPIDER_WEIBO_IMG = 'weibo/img/';  // 微博图片

// 虚拟用户行为类型
export const ROBOT_ACTIVE_POST = 'robot_post'; // 发帖
export const ROBOT_ACTIVE_LAUD = 'robot_laud'; // 点赞
export const ROBOT_ACTIVE_COMMENT = 'robot_comment'; // 评论
export const ROBOT_ACTIVE_ALL = 'robot_active'; // 全部行为

// 虚拟用户行为配置
export const LAST_POST_NUM = 10; // 处理最新帖子的数量
export const MAX_POST_ROBOTS = 10; // 一条帖子下最大的虚拟用户人数

// 举报类型
export const REPORT_PERSON = 1;  // 举报个人
export const REPORT_PUBLIC = 2;  // 举报公众号
export const REPORT_POST = 3;    // 举报动态
export const REPORT_ARTICLE = 4; // 举报文章
export const REPORT_COMMENT = 5; // 举报评论

// 惩罚类型
export const DELETE_CONTENT = 1;    // 删除内容
export const BAN_MESAAGE = 2;       // 禁言
export const BAN_POST = 3;          // 禁止发动态
export const FREEZE = 4;            // 冻结
export const BAN_ACCOUNT = 5;         // 封禁(无法登录)

// 惩罚状态
export const PUNISH_LAST = 0; // 惩罚中
export const PUNISH_END = 1; // 惩罚结束

// 公众号申请状态
export const PUBLIC_APPLYING = 0;    // 申请中
export const PUBLIC_APPLY_SUCCESS = 1; // 申请成功
export const PUBLIC_APPLY_REFUSED = 2; // 申请驳回