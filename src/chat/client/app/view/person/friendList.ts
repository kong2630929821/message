/**
 * 邀请成员
 */
 // ================================================ 导入
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { Contact, UserInfo } from '../../../../server/data/db/user.s';
import { getStore, register } from '../../data/store';

interface Props {
    userInfos:UserInfo[];  // 客服账号
}

// ================================================ 导出
export const forelet = new Forelet();
 
export class InviteMember extends Widget {
    public ok:(uid:number) => void;
    public props:Props = {
        userInfos:[]
    };

    public create() {
        super.create();
        const sid = getStore('uid').toString();
        this.state = getStore('contactMap',new Contact()).get(sid);
        this.props.userInfos = getStore('userInfoMap', []);
    }
    
    public goBack() {
        this.ok(0);
    }
   
    // 添加群成员
    public addGroupMember(e:any) {
        this.ok(e.value);
    }
    
}
 
  // ================================================ 本地

register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (const value of r.values()) {
        forelet.paint(value);
    }    
});