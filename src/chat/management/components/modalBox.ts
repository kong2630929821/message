import { Widget } from '../../../pi/widget/widget';
import { getHandleArticle } from '../net/rpc';
import { popNewMessage } from '../utils/logic';
import { rippleShow } from '../utils/tools';

interface Props {
    checkTypeList:string[];// 处罚类型
    reason:string[];// 选择驳回原因
    msg:string;// 客服回复的话
    title:string;// 标题
    avatar:string;// 头像
    name:string;// 名字
    checkedType:number;// 选择发布 驳回
    currentReason:number;// 选中的驳回原因下标
    key:{
        id:number;
        num:string;
    };
}

/**
 * 审核
 */
export class ModalBox extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:Props = {
        checkTypeList:['通过','驳回'],
        reason:['垃圾营销','涉黄信息','人身攻击','有害信息','违法信息','诈骗信息'],
        msg:'',
        title:'',
        avatar:'',
        name:'',
        checkedType:0,
        currentReason:0,
        key:{
            id:0,
            num:'0'
        }
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const title = this.props.title.length > 9 ? `${this.props.title.substring(0,9)}···` :this.props.title;
        this.props.msg = `您的文章“${title}”，通过了审核`;
    }

    // 选择类型
    public btnCheckType(index:number) {
        this.props.checkedType = index;
        const title = this.props.title.length > 9 ? `${this.props.title.substring(0,9)}···` :this.props.title;
        if (index) {
            this.props.msg = `您的文章“${title}”，因为包含“${this.props.reason[this.props.currentReason]}”信息，没有通过审核，请检查后重新提交`;
        } else {
            this.props.msg = `您的文章“${title}”，通过了审核`;
        }
        this.paint();
    }

    // 选择驳回的理由
    public btnCheck(index:number) {
        this.props.currentReason = index;
        const title = this.props.title.length > 9 ? `${this.props.title.substring(0,9)}···` :this.props.title;
        this.props.msg = `您的文章“${title}”，因为包含“${this.props.reason[index]}”信息，没有通过审核，请检查后重新提交` ;
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
        if (this.props.checkedType) {
            reason = this.props.reason[this.props.currentReason];
        }
        // 审核通过传ture 
        getHandleArticle(this.props.checkedType ? false :true,reason,this.props.key.id,this.props.key.num).then(r => {
            if (r === 1) {
                popNewMessage('审核成功');
                this.ok && this.ok();
            } else {
                popNewMessage('审核失败');
            }
        });
        
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}