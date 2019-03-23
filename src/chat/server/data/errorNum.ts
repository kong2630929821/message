/**
 * 错误编码
 */
// 与当前用户不是好友
export const NOT_FRIEND_CANT_TALK = 1001;
// 群内临时聊天时只有一方是群主才可以聊天
export const NOT_GROUP_OWNNER = 1002;
// 不在一个群无法发起临时聊天
export const NOTIN_SAME_GROUP = 1003;

// 用户创建群组到达上限
export const USER_GREATE_GROUP_OVERLIMIT = 2001;
// 群成员数量到达上限
export const GROUP_MEMBERS_OVERLIMIT = 2002;
// 好友数量到达上限
export const FRIENDS_NUM_OVERLIMIT = 2003;
// 申请添加好友的好友数量到达上限
export const APPLY_FRIENDS_OVERLIMIT = 2004;
// 当前用户没有相应操作权限
export const OPERAT_WITHOUT_AUOTH = 2005;