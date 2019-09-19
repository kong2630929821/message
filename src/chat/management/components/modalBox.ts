import { Widget } from '../../../pi/widget/widget';
import { getHandleArticle } from '../net/rpc';
import { popNewMessage } from '../utils/logic';

interface Props {
    title:string;// 标题
    avatar:string;// 头像
    name:string;// 名字
    checked:boolean;// 选择 true发布 false驳回
    typeTwo:any;// 驳回时的类型选择
    checkedList:any;// 驳回时选中的类型
    data:any;// 文章详情
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
        checkedList:[false,false,false,false,false,false],
        data:{}
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.props.title = this.props.data.title;
        this.props.name = this.props.data.name;
        this.props.avatar = this.props.data.avatar;
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

    // 取消
    public cancleBtn() {
        this.cancel && this.cancel();
    }

    // 确认
    public okBtn() {
        let reason = '';
        // 判断选择的类型
        if (!this.props.checked) {
            // 驳回
            const checkList = [];
            let fg = true; 
            this.props.checkedList.forEach((v,i) => {
                if (v) {
                    checkList.push(this.props.typeTwo[i]);
                    fg = false;
                }
            });
            if (fg) {
                popNewMessage('请选择驳回的理由');

                return;
            }
            reason = JSON.stringify(checkList);
        }
        getHandleArticle(this.props.checked,reason,this.props.data.key.id,this.props.data.key.num).then(r => {
            if (r === 1) {
                this.ok && this.ok();
            } else {
                popNewMessage('审核失败');
            }
        });
        
    }
}