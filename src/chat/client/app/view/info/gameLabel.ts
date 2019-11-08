import { Widget } from '../../../../../pi/widget/widget';
import { getStore } from '../../data/store';

interface Props {
    gameLabelList:any;// 游戏标签
    label:string;// 选中的游戏标签
}

/**
 * 游戏标签列表
 */
export class GameLabel extends Widget {
    public ok:(name:string) => void;

    public props:Props = {
        gameLabelList:[
            { name:'一代掌门',icon:'../../res/images/gameLabel.png' }
        ],
        label:''
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.initDate();
    }

    // 获取游戏标签
    public initDate() {
        this.props.gameLabelList = [];
        const list = getStore('labelList',[]);
        list.forEach(v => {
            this.props.gameLabelList.push({
                name:v[0],
                icon:v[1]
            });
        });
    }

    // 选中的标签
    public check(index:number) {
        this.props.label = this.props.gameLabelList[index];
        this.goBack();
    }

    // 返回
    public goBack() {
        this.ok && this.ok(this.props.label);
    }
}