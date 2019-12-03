import { popNew3 } from '../../../../../app/utils/tools';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import * as store from '../../data/store';
import { rippleShow } from '../../logic/logic';
export const forelet = new Forelet();

const STATE = {
    lastChat:[]
};
/**
 * 聊天通知
 */
export class ContactNotice extends Widget {
    public create() {
        super.create();
        this.state = STATE;
    }

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }
    /**
     * 进入聊天页面
     * @param id 好友ID或群ID
     * @param chatType 群聊或单聊
     */
    public chat(num:number,e:any) {
        // notify(e.node,'ev-chat',null);
        const value = this.state.lastChat[num];
        if (value[2] !== GENERATOR_TYPE.GROUP && value[2] !== GENERATOR_TYPE.USER) {
            popNew3('chat-client-app-view-chat-notice', { name:'消息通知' }) ;
        } else {
            const gid = value.length === 4 ? value[3] :null ;
            popNew3('chat-client-app-view-chat-chat', { id: value[0], chatType: value[2], groupId:gid }) ;
        }
        
    } 

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}

store.register(`lastChat`, (r) => {
    console.log('lastChat: ',r);
    STATE.lastChat = r;
    forelet.paint(STATE);
});