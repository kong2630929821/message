import { Widget } from '../../../pi/widget/widget';
import { buildupImgPath } from '../../client/app/logic/logic';
import { ListItem } from '../view/page/application/thirdApplication';

interface Props {
    item:ListItem;
    buildupImgPath:any;
}
/**
 * 游戏列表item
 */
export class ApplicationItem extends Widget {
    public props:Props = {
        item:{
            appid: '',
            buttonMod: 1,
            desc: '',
            groupId: '',
            img: ['','','',''],
            screenMode: '',
            subtitle:'' ,
            title:'',
            url:'',
            webviewName: '',
            time:''
        },
        buildupImgPath:buildupImgPath
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }
}