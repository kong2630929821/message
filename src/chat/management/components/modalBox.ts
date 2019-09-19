import { Widget } from '../../../pi/widget/widget';

interface Props {
    title:string;// 标题
    avatar:string;// 头像
    name:string;// 名字
    checked:boolean;// 选择 true发布 false驳回
    typeTwo:any;// 驳回时的类型选择
    checkedList:any;// 驳回时选中的类型
}

/**
 * 审核
 */
export class ModalBox extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:Props = {
        title:'',
        avatar:'',
        name:'',
        checked:true,
        typeTwo:['垃圾营销','涉黄信息','人身攻击','有害信息','违法信息','诈骗信息'],
        checkedList:[false,false,false,false,false,false]

    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    // 选择类型
    public check() {
        this.props.checked = !this.props.checked;
        this.paint();
    }

    // 选择驳回的理由
    public checkList(index:number) {
        this.props.checkedList[index] = !this.props.checkedList[index];
        this.paint();
    }
    // 确认
    public okBtn() {
        this.ok && this.ok();
    }

    // 取消
    public cancleBtn() {
        this.cancel && this.cancel();
    }
}