/**
 * modalbox
 */
import { popNewMessage } from '../../../../../app/utils/tools';
import { Widget } from '../../../../../pi/widget/widget';
interface Props {
    title:string;// 标题
    avatar:string;// 头像
    userName:string;// 用户名
    msg:string;// 举报内容
    selected:any;// 选择举报的类型
    sex:number;// 性别
    selectStaus:any;// 选中的状态
    content:any;// 举报的类型名字
}
/**
 * 举报
 */
export class ModalBox extends Widget {
    public props: Props = {
        title:'',
        avatar:'',
        userName:'',
        msg:'',
        selected:[],
        sex:2,
        selectStaus:[],
        content:[]
    };
    public ok: (selected:any) => void;
    public cancel: () => void;

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.init();
    }

    // 初始化
    public init() {
        this.props.content.forEach(v => {
            this.props.selectStaus.push(false);
        });
    }
    // 选择某个
    public doClick(i:number) {
        const index = this.props.selected.indexOf(i);
        if (index > -1) {
            this.props.selected.splice(index,1);
            this.props.selectStaus[i] = false;
        } else {
            this.props.selected.push(i);
            this.props.selectStaus[i] = true;
        }
        this.paint();
    }
    public cancelBtnClick(e: any) {
        this.cancel && this.cancel();
    }
    public okBtnClick(e: any) {
        if (!this.props.selected) {
            popNewMessage('您未选择举报类型');
            
            return ;
        }
        this.ok && this.ok(this.props.selected);
    }
}