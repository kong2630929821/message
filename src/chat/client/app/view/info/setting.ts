import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    userAlias:string;  // 好友备注
    setList:any[][];
}

/**
 * 消息设置
 */
export class Setting extends Widget {
    public ok:() => void;
    public props:Props = {
        userAlias:'哈哈哈',
        setList:[
            ['修改备注',0,'哈哈哈'],
            ['发送名片',0],
            ['查找聊天记录',0],
            ['聊天置顶',1],  // 1 表示右侧是滑块了切换
            ['消息免打扰',1],
            ['清空聊天记录',0],
            ['举报',0],
            ['加入黑名单',0],
            ['删除好友',0]
        ]
    };

    public goBack() {
        this.ok && this.ok();
    }

    public itemClick(i:number) {
        switch (i) {
            case 0:
                popNew('chat-client-app-widget-pageEdit-pageEdit',{ title:'修改备注', contentInput:this.props.userAlias },(res:any) => {
                    // const friend = new FriendAlias();
                    // friend.rid = this.props.uid;
                    // friend.alias = res.content;
                    // clientRpcFunc(changeFriendAlias, friend, (r: Result) => {
                    //     if (r.r === 1) {
                    //         const sid = store.getStore('uid');
                    //         const friendlink = store.getStore(`friendLinkMap/${genUuid(sid, this.props.uid)}`, {});
                    //         friendlink.alias = friend.alias;
                    //         store.setStore(`friendLinkMap/${genUuid(sid, this.props.uid)}`, friendlink);
                    //         this.props.alias = friend.alias;
                    //         this.paint();
                    //         popNewMessage('修改好友备注成功');
    
                    //     } else {
                    //         popNewMessage('修改好友备注失败');
                    //     }
                    // });
                });
                break;
            case 1:
                break;
            default:
        }
    }
}