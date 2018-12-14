/**
 * 群组成员信息组件
 */

// ================================================ 导入
import { Json } from '../../../../../pi/lang/type';
import { Widget } from '../../../../../pi/widget/widget';
import { UserInfo } from '../../../../server/data/db/user.s';
import { Logger } from '../../../../utils/logger';
import { genGuid } from '../../../../utils/util';
import * as store from '../../data/store';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class MemberItem extends Widget {
    public props:Props = {
        id:null,
        name:'',
        gid:null,
        groupInfo:{},
        text:'',
        avatorPath:'', 
        isOperation:false,  
        isOrdinary:true,
        isOwner:false
    };
    public setProps(props:any) {
        super.setProps(props); 
        logger.debug('===============isOperation',props);
        this.props.isOperation = props.isOperation;
        if (!this.props.isOperation) {
            logger.debug('===============isOperation = false',props);
            this.props.id = props.id;   
            this.props.gid = props.gid;
            const guid = genGuid(this.props.gid,this.props.id);
            this.props.groupInfo = store.getStore(`groupInfoMap/${this.props.gid}`);
            const groupUser = store.getStore(`groupUserLinkMap/${guid}`);
            this.props.name = groupUser ? groupUser.userAlias : '';
            this.props.isOrdinary = true;
            if (this.props.id === this.props.groupInfo.ownerid) {
                this.props.isOwner = true;
                this.props.isOrdinary = false;
            }
            if (this.props.groupInfo.adminids.indexOf(this.props.id) > -1) {
                this.props.isOrdinary = false;
            } 
        } else {
            this.props = props;
            logger.debug('===============isOperation = true',props);
        }
    }
}

// ================================================ 本地
interface Props {
    id?:number; // 群成员id
    name:string; // 群成员名
    gid?:number; 
    groupInfo:Json; // 群信息
    text?:string; // 其他文本
    avatorPath:string; // 图片路径
    isOperation: boolean; // 是否是成员 还是操作
    isOrdinary?:boolean; // 是否普通成员
    isOwner:boolean; // 是否群主
}
