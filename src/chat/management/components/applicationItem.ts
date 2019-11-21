import { Widget } from '../../../pi/widget/widget';

interface Props {
    name:string;// 游戏名
    desc:string;// 游戏描述
    icon:string;// 游戏图标
    customerId:string;// 客服id
    appId:string;// 应用ID
    time:string;// 添加时间
}

/**
 * 游戏列表item
 */
export class ApplicationItem extends Widget {
    public props:Props = {
        name:'',
        desc:'',
        icon:'',
        customerId:'',
        appId:'',
        time:''
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }
}