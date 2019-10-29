/**
 * nameCard 组件相关处理
 */

// ===========================导入
import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    avatarPath: string;// 头像
    cardInfo: string; // 名片信息
    cardType: string;// 名片类型 user|group|redEnv
    cardTypeShow:string; // 名片类型展示
    received:boolean; // 是否已领过
}

// ===========================导出
export class NameCard extends Widget {
    public props: Props;
    constructor() {
        super();
        this.props = {
            avatarPath: '../../res/images/emoji.png',
            cardInfo: '群名或用户名或',
            cardType: 'redEnv',
            cardTypeShow:'KuPay红包',
            received:false
        };
    }

    public setProps(props:any) {
        super.setProps(props);
        if (this.props.cardType === 'user') {
            this.props.cardTypeShow = '个人名片';
        } else if (this.props.cardType === 'group') {
            this.props.cardTypeShow = '群名片';
        } else if (this.props.cardType === 'redEnv') {
            this.props.cardTypeShow = '好嗨红包';
        }
    }
}