import { Widget } from '../../../pi/widget/widget';
import { rippleShow } from '../../client/app/logic/logic';

interface Props {
    title:string;
    input:string;
    appItem:AppItem;
    checked:boolean;
}

interface AppItem {
    iocn:string;
    name:string;
    desc:string;
    id:string;
}
/**
 * 搜索应用
 */
export class AddApplicationModule extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:Props = {
        title:'添加推荐应用',
        input:'',
        appItem:{
            iocn:'../res/images/xianzhixiadao.png',
            name:'仙之侠道',
            desc:'2019最热奇幻手游',
            id:'123456'
        },
        checked:false
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    public exitBtn() {
        this.cancel && this.cancel();
    }

    public okBtn() {
        this.ok && this.ok();
    }

    public inputChange(e:any) {
        this.props.input = e.value;
    }
    /**
     * 搜索
     */
    public search() {
        
    }
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    /**
     * 切换选中
     */
    public check() {
        this.props.checked = !this.props.checked;
        this.paint();
    }
}