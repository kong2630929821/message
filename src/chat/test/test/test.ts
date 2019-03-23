import { GroupInfo } from '../../../chat/server/data/db/group.s';
import { createGroup } from '../../../chat/server/data/rpc/group.p';
import { GroupCreate } from '../../../chat/server/data/rpc/group.s';
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { UserType, WalletLoginReq, UserType_Enum } from '../../server/data/rpc/basic.s';
import { login } from '../../server/data/rpc/basic.p';
import { clientRpcFunc } from '../../client/app/net/init';
import { UserInfo } from '../../server/data/db/user.s';
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
    })
};

// 创建群
export const cGroupe = () => {
    const group = new GroupCreate();
    group.name = "Avengers";
    group.avatar = "BigHead"
    group.note = "peace";
    group.need_agree = false;
    clientRpcFunc(set_gmAccount, group, (r: GroupInfo) => {
        console.log(r);
    })
};

// 设置官方账号
export const setGM = () => {
    const uid = 10003;
    clientRpcFunc(set_gmAccount, uid, (r: UserInfo) => {
        console.log(r);
    })
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
