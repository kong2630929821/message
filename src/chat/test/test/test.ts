import { GroupInfo } from '../../../chat/server/data/db/group.s';
import { createGroup, searchGroup } from '../../../chat/server/data/rpc/group.p';
import { GroupCreate, GroupInfoList } from '../../../chat/server/data/rpc/group.s';
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { clientRpcFunc } from '../../client/app/net/init';
import { CommentKey, PostKey } from '../../server/data/db/community.s';
import { UserInfo } from '../../server/data/db/user.s';
import { login } from '../../server/data/rpc/basic.p';
import { UserType, UserType_Enum, WalletLoginReq } from '../../server/data/rpc/basic.s';
import { addCommentPost, addPostPort, commentLaudPost, createCommunityNum, delCommentPost, deletePost, getCommentLaud, getFansId, getFollowId, getPostInfoByIds, getSquarePost, getUserInfoByComm, getUserPost, getUserPublicAcc, postLaudPost, showCommentPort, showLaudLog, userFollow } from '../../server/data/rpc/community.p';
import { AddCommentArg, AddPostArg, CommentArr, CommunityNumList, CommUserInfoList, CreateCommunity, IterCommentArg, IterLaudArg, IterPostArg, IterSquarePostArg, LaudLogArr, PostArr, PostArrWithTotal, PostKeyList } from '../../server/data/rpc/community.s';
import { changeUserInfo, searchFriend, set_gmAccount } from '../../server/data/rpc/user.p';
import { UserChangeInfo, UserInfoList } from '../../server/data/rpc/user.s';

/**
 * 登录
 */

// ================================================ 导入

// 聊天登陆
export const chatLogin = () => {
    const walletLoginReq = new WalletLoginReq();
    walletLoginReq.openid = '1003';
    walletLoginReq.sign = 'test';
    const userType = new UserType();
    userType.enum_type = UserType_Enum.WALLET;
    userType.value = walletLoginReq;
    clientRpcFunc(login, userType, (r: UserInfo) => {
        console.log(r);
    });
    const userChange = new UserChangeInfo();
    userChange.acc_id = '123123';
    userChange.avatar = 'aaa';
    userChange.name = 'Stark';
    userChange.note = '...';
    userChange.sex = 1;
    userChange.tel = '13333333333';
    userChange.wallet_addr = 'asdasdasd';
    clientRpcFunc(changeUserInfo, userChange, (r: UserInfo) => {
        console.log(r);
    });
};

// 创建群
export const cGroupe = () => {
    const group = new GroupCreate();
    group.name = 'Avengers';
    group.avatar = 'BigHead';
    group.note = 'peace';
    group.need_agree = false;
    clientRpcFunc(createGroup, group, (r: GroupInfo) => {
        console.log(r);
    });
};

// 设置官方账号
export const setGM = () => {
    const uid = 10003;
    clientRpcFunc(set_gmAccount, uid, (r: UserInfo) => {
        console.log(r);
    });
};

// 写帖子
export const addPostPortTest = () => {
    const addPostArg = new AddPostArg();
    addPostArg.num = '2';
    addPostArg.post_type = 1;
    addPostArg.title = 'test1';
    addPostArg.body = 'test1';
    clientRpcFunc(addPostPort, addPostArg, (r: PostKey) => {
        console.log(r);
    });
};

// 帖子点赞
export const postLaudPostTest = () => {
    const arg = new PostKey();
    arg.num = '2';
    arg.id = 1;
    clientRpcFunc(postLaudPost, arg, (r: PostKey) => {
        console.log(r);
    });
};

// 评论帖子
export const addComment = () => {
    const addCommentArg = new AddCommentArg();
    addCommentArg.comment_type = 1;
    addCommentArg.num = '2';
    addCommentArg.post_id = 3;
    addCommentArg.msg = 'test222222';
    addCommentArg.reply = 7;
    console.log('!!!!!!!!!!!!!!!!!!addCommentArg', addCommentArg);
    clientRpcFunc(addCommentPost, addCommentArg, (r: CommentKey) => {
        console.log(r);
    });
};

// 获取评论
export const getCommentPort = () => {
    const arg = new IterCommentArg();
    arg.num = '2';
    arg.post_id = 3;
    arg.id = 99;
    arg.count = 10;
    clientRpcFunc(showCommentPort, arg, (r: CommentArr) => {
        console.log(r);
    });
};

// 评论点赞
export const commentLaud = () => {
    const arg = new CommentKey();
    arg.num = '2';
    arg.post_id = 3;
    arg.id = 7;
    clientRpcFunc(commentLaudPost, arg, (r: CommentArr) => {
        console.log(r);
    });
};

// 获取帖子点赞
export const showLaudLogTest = () => {
    const arg = new IterLaudArg();
    arg.num = '2';
    arg.uid = 0;
    arg.post_id = 1;
    arg.count = 10;
    clientRpcFunc(showLaudLog, arg, (r: LaudLogArr) => {
        console.log(r);
    });
};

// 获取评论点赞
export const getcommentLaudtest = () => {
    const arg = new PostKey();
    arg.num = '2';
    arg.id = 2;
    clientRpcFunc(getCommentLaud, arg, (r: CommentArr) => {
        console.log(r);
    });
};

// 关注用户
export const userFollowTest = () => {
    const num = '3';
    clientRpcFunc(userFollow, num, (r: boolean) => {
        console.log(r);
    });
};

// 获取广场分类的帖子
export const getSquarePostTest = () => {
    const arg = new IterSquarePostArg();
    arg.count = 10;
    arg.num = '5';
    arg.id = 0;
    arg.square_type = 3;
    clientRpcFunc(getSquarePost, arg, (r: PostArr) => {
        console.log(r);
    });
};

// 创建公众号
export const createCommunityNumTest = () => {
    const arg = new CreateCommunity();
    arg.name = 'brain storm';
    arg.comm_type = 2;
    arg.desc = 'lalalalala';
    clientRpcFunc(createCommunityNum, arg, (r: string) => {
        console.log(r);
    });
};

// 获取用户的公众号
export const getUserPublicAccTest = () => {
    clientRpcFunc(getUserPublicAcc, null, (r: string) => {
        console.log(r);
    });
};

// 获取指定社区账号的帖子信息
export const getUserPostTest = () => {
    const arg = new IterPostArg();
    arg.count = 10;
    arg.num = '2';
    arg.id = 0;
    clientRpcFunc(getUserPost, arg, (r: PostArrWithTotal) => {
        console.log(r);
    });
};

// 获取关注
export const getFollowIdTest = () => {
    const uid = 10002;
    clientRpcFunc(getFollowId, uid, (r: CommunityNumList) => {
        console.log(r);
    });
};

// 获取粉丝
export const getFansIdTest = () => {
    const id = '2';
    clientRpcFunc(getFansId, id, (r: CommunityNumList) => {
        console.log(r);
    });
};

// 删除帖子
export const deletePostTest = () => {
    const arg = new PostKey();
    arg.num = '2';
    arg.id = 1;
    clientRpcFunc(deletePost, arg, (r: number) => {
        console.log(r);
    });
};

// 删除评论
export const delCommentPostTest = () => {
    const arg = new CommentKey();
    arg.num = '2';
    arg.post_id = 1;
    arg.id = 2;
    clientRpcFunc(delCommentPost, arg, (r: number) => {
        console.log(r);
    });
};

// 批量获取指定社区号的信息
export const getUserInfoByCommTest = () => {
    const arg = new CommunityNumList();
    arg.list = ['2'];
    clientRpcFunc(getUserInfoByComm, arg, (r: CommUserInfoList) => {
        console.log(r);
    });
};

// 批量获取帖子
export const getPostInfoByIdsTest = () => {
    const arg = new PostKeyList();
    const postKey1 = new PostKey();
    postKey1.num = '2';
    postKey1.id = 1;
    const postKey2 = new PostKey();
    postKey2.num = '2';
    postKey2.id = 2;
    arg.list = [postKey1, postKey2];
    clientRpcFunc(getPostInfoByIds, arg, (r: CommUserInfoList) => {
        console.log(r);
    });
};

// 搜索用户
export const searchFriendTest = () => {
    const arg = 'Stark';
    clientRpcFunc(searchFriend, arg, (r: UserInfoList) => {
        console.log(r);
    });
};

// 搜索群
export const searchGroupTest = () => {
    const arg = '10001';
    clientRpcFunc(searchGroup, arg, (r: GroupInfoList) => {
        console.log(r);
    });
};

const props = {
    bts: [
        
        {
            name: '用户登陆',
            func: () => { chatLogin(); }
        },
        {
            name: '搜索用户',
            func: () => { searchFriendTest(); }
        },
        {
            name: '搜索群',
            func: () => { searchGroupTest(); }
        },
        {
            name: '创建群',
            func: () => { cGroupe(); }
        },
        {
            name: '写帖子',
            func: () => { addPostPortTest(); }
        },
        {
            name: '帖子点赞',
            func: () => { postLaudPostTest(); }
        },
        {
            name: '批量获取帖子',
            func: () => { getPostInfoByIdsTest(); }
        },
        {
            name: '评论帖子',
            func: () => { addComment(); }
        },
        {
            name: '获取评论',
            func: () => { getCommentPort(); }
        },
        {
            name: '评论点赞',
            func: () => { commentLaud(); }
        },
        {
            name: '获取评论点赞',
            func: () => { getcommentLaudtest(); }
        },
        {
            name: '获取帖子点赞',
            func: () => { showLaudLogTest(); }
        },
        {
            name: '分类帖子',
            func: () => { getSquarePostTest(); }
        },
        {
            name: '关注用户',
            func: () => { userFollowTest(); }
        },
        {
            name: '创建公众号',
            func: () => { createCommunityNumTest(); }
        },
        {
            name: '获取公众号',
            func: () => { getUserPublicAccTest(); }
        },
        {
            name: '获取用户帖子',
            func: () => { getUserPostTest(); }
        },
        {
            name: '获取关注',
            func: () => { getFollowIdTest(); }
        },
        {
            name: '获取粉丝',
            func: () => { getFansIdTest(); }
        },
        {
            name: '删除帖子',
            func: () => { deletePostTest(); }
        },
        {
            name: '删除评论',
            func: () => { delCommentPostTest(); }
        },
        {
            name: '社区信息',
            func: () => { getUserInfoByCommTest(); }
        }
    ] // 按钮数组
};

// ================================================ 导出
export class Test extends Widget {
    constructor() {
        super();
        this.props = props;
    }

    public onTap(a: any) {
        props.bts[a].func();
        // console.log('click ',props.bts[a].name);
    }
}

// ================================================ 本地
