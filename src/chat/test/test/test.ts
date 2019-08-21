import { GroupInfo } from '../../../chat/server/data/db/group.s';
import { createGroup } from '../../../chat/server/data/rpc/group.p';
import { GroupCreate } from '../../../chat/server/data/rpc/group.s';
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { clientRpcFunc } from '../../client/app/net/init';
import { CommentKey, PostKey } from '../../server/data/db/community.s';
import { UserInfo } from '../../server/data/db/user.s';
import { login } from '../../server/data/rpc/basic.p';
import { UserType, UserType_Enum, WalletLoginReq } from '../../server/data/rpc/basic.s';
import { addCommentPost, commentLaudPost, getCommentLaud, getSquarePost, showCommentPort, userFollow } from '../../server/data/rpc/community.p';
import { AddCommentArg, CommentArr, IterCommentArg, IterSquarePostArg } from '../../server/data/rpc/community.s';
import { set_gmAccount } from '../../server/data/rpc/user.p';

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
};

// 创建群
export const cGroupe = () => {
    const group = new GroupCreate();
    group.name = 'Avengers';
    group.avatar = 'BigHead';
    group.note = 'peace';
    group.need_agree = false;
    clientRpcFunc(set_gmAccount, group, (r: GroupInfo) => {
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

// 评论帖子
export const addComment = () => {
    const addCommentArg = new AddCommentArg();
    addCommentArg.comment_type = 1;
    addCommentArg.num = '3';
    addCommentArg.post_id = 1;
    addCommentArg.msg = 'test';
    addCommentArg.reply = 0;
    console.log('!!!!!!!!!!!!!!!!!!addCommentArg', addCommentArg);
    clientRpcFunc(addCommentPost, addCommentArg, (r: CommentKey) => {
        console.log(r);
    });
};

// 获取评论
export const getCommentPort = () => {
    const arg = new IterCommentArg();
    arg.num = '3';
    arg.post_id = 1;
    arg.id = 99;
    arg.count = 10;
    clientRpcFunc(showCommentPort, arg, (r: CommentArr) => {
        console.log(r);
    });
};

// 评论点赞
export const commentLaud = () => {
    const arg = new CommentKey();
    arg.num = '3';
    arg.post_id = 1;
    arg.id = 1;
    clientRpcFunc(commentLaudPost, arg, (r: CommentArr) => {
        console.log(r);
    });
};

// 获取评论点赞
export const getcommentLaudtest = () => {
    const arg = new PostKey();
    arg.num = '3';
    arg.id = 1;
    clientRpcFunc(getCommentLaud, arg, (r: CommentArr) => {
        console.log(r);
    });
};

// 关注用户
export const userFollowTest = () => {
    const num = '1';
    clientRpcFunc(userFollow, num, (r: CommentArr) => {
        console.log(r);
    });
};

// 获取广场分类的帖子
export const getSquarePostTest = () => {
    const arg = new IterSquarePostArg();
    arg.count = 10;
    arg.num = '1';
    arg.id = 0;
    arg.square_type = 4;
    clientRpcFunc(getSquarePost, arg, (r: CommentArr) => {
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
            name: '创建群',
            func: () => { cGroupe(); }
        },
        {
            name: '设置官方账号',
            func: () => { setGM(); }
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
            name: '分类帖子',
            func: () => { getSquarePostTest(); }
        },
        {
            name: '关注用户',
            func: () => { userFollowTest(); }
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
